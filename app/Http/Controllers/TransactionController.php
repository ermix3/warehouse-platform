<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Customer;
use App\Models\Transaction;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions with search and sorting.
     */
    public function index(Request $request, string $type='date'): Response
    {
        $this->authorize('viewAny', Transaction::class);

        $sortOrder = $request->get('sort_order', 'desc');
        $sortBy = $request->get('sort_by', $type == 'date' ? 'created_at' : 'id');
        $search = $request->get('search', '');
        $customers = Customer::all();

        $allowedSortFields = ['id', 'type', 'value', 'customer_name', 'created_at', 'updated_at'];
        $allowedSortOrders = ['asc', 'desc'];

        $query = Transaction::query()->with('customer');

        if ($search = $request->get('search')) {
            $query->where(function ($subQ) use ($search) {
                $subQ->whereAny(['notes', 'value', 'type'], 'like', "%{$search}%")
                    ->orWhereRelation('customer', 'name', 'like', "%{$search}%");
            });
        }

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            if ($sortBy === 'customer_name') {
                $query->orderBy(
                    Customer::select('name')
                        ->whereColumn('customers.id', 'transactions.customer_id'),
                    $sortOrder
                );
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        } else {
            $query->orderBy('id', 'desc');
        }

        // Get transactions by date
        $transactionsByDate = $query->paginate(15)->withQueryString();

        // Get transactions grouped by customer for the summary
        $transactionsByCustomer = Transaction::query()
            ->selectRaw("
                customer_id,
                SUM(CASE WHEN type = ? THEN value ELSE 0 END) as incomes,
                SUM(CASE WHEN type = ? THEN value ELSE 0 END) as outcomes,
                SUM(CASE WHEN type = ? THEN value ELSE -value END) as difference
            ", ['income', 'outcome', 'income'])
            ->when($request->get('search'), fn (Builder $q, $search) =>
                $q->whereRelation('customer', 'name', 'like', "%{$search}%")
            )
            ->groupBy('customer_id')
            ->with('customer')
            ->withCasts([
                'incomes' => 'float',
                'outcomes' => 'float',
                'difference' => 'float',
            ]);

        $allowedSummarySorts = ['customer_id', 'incomes', 'outcomes', 'difference', 'customer_name'];
        if (in_array($sortBy, $allowedSummarySorts) && in_array($sortOrder, $allowedSortOrders)) {
            if ($sortBy === 'customer_name') {
                $transactionsByCustomer->orderBy(
                    Customer::select('name')
                        ->whereColumn('customers.id', 'transactions.customer_id'),
                    $sortOrder
                );
            } else {
                $transactionsByCustomer->orderBy($sortBy, $sortOrder);
            }
        } else {
            $transactionsByCustomer->orderBy('difference', 'desc');
        }

        $transactionsByCustomer = $transactionsByCustomer->paginate(15)->withQueryString();

        return Inertia::render('transaction/index', [
            'customers' => $customers,
            'transactionsByDate' => $transactionsByDate,
            'transactionsByCustomer' => $transactionsByCustomer,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction): Response
    {
        $this->authorize('view', $transaction);

        // Load the transaction with its customer relationship
        $transaction->load('customer');

        return Inertia::render('transaction/show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     */
    public function store(TransactionRequest $request): RedirectResponse
    {
        $this->authorize('create', Transaction::class);

        try {
            DB::beginTransaction();

            $transaction = Transaction::create($request->validated());

            DB::commit();

            Log::info('Transaction created successfully', [
                'transaction_id' => $transaction->id,
                'type' => $transaction->type,
                'value' => $transaction->value,
                'customer_id' => $transaction->customer_id,
                'created_by' => Auth::id(),
            ]);

            return back()->with('success', 'Transaction created successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create transaction', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => Auth::id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create transaction. Please try again.']);
        }
    }

    /**
     * Update the specified transaction in storage.
     */
    public function update(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $this->authorize('update', $transaction);

        try {
            DB::beginTransaction();

            $oldData = $transaction->toArray();
            $transaction->update($request->validated());

            DB::commit();

            Log::info('Transaction updated successfully', [
                'transaction_id' => $transaction->id,
                'old_data' => $oldData,
                'new_data' => $transaction->fresh()->toArray(),
                'updated_by' => Auth::id(),
            ]);

            return Redirect::route('transactions.index')->with('success', 'Transaction updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update transaction', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => Auth::id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update transaction. Please try again.']);
        }
    }

    /**
     * Remove the specified transaction from storage.
     */
    public function destroy(Transaction $transaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        try {
            DB::beginTransaction();

            $transactionData = $transaction->toArray();

            $transaction->delete();

            DB::commit();

            Log::info('Transaction deleted successfully', [
                'transaction_data' => $transactionData,
                'deleted_by' => Auth::id(),
            ]);

            return Redirect::route('transactions.index')->with('success', 'Transaction deleted successfully.');
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete transaction', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete transaction. Please try again.'
            ]);
        }
    }

    public function histories(Customer $customer)
    {

        $this->authorize('viewAny', Transaction::class);

        $transactions = Transaction::where('customer_id', $customer->id)->get();

        return Inertia::render('transaction/index', [
            'transactions' => $transactions
        ]);
    }
}
