<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users with search and sorting.
     */
    public function index(Request $request): Response
    {
        $query = User::query()->where('id', '!=', auth()->id());

        // Handle search across multiple fields
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Handle sorting with validation
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortFields = ['id', 'name', 'email', 'email_verified_at', 'created_at'];
        $allowedSortOrders = ['asc', 'desc'];

        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            // Fallback to default sorting
            $query->orderBy('id', 'asc');
        }

        $users = $query->paginate(15)->appends($request->query());

        return Inertia::render('user/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(UserRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            $validated['password'] = Hash::make($validated['password']);
            unset($validated['password_confirmation']);

            $user = User::create($validated);

            DB::commit();

            Log::info('User created successfully', [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'created_by' => auth()->id(),
            ]);

            return Redirect::route('users.index')->with('success', 'User created successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to create user', [
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create user. Please try again.']);
        }
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UserRequest $request, User $user): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $oldData = $user->toArray();
            $validated = $request->validated();

            // Handle password update
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }
            unset($validated['password_confirmation']);

            $user->update($validated);

            DB::commit();

            Log::info('User updated successfully', [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'old_data' => $oldData,
                'new_data' => $user->fresh()->toArray(),
                'updated_by' => auth()->id(),
            ]);

            return Redirect::route('users.index')->with('success', 'User updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to update user', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'data' => $request->validated(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update user. Please try again.']);
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $userData = $user->toArray();

            $user->delete();

            DB::commit();

            Log::info('User deleted successfully', [
                'user_data' => $userData,
                'deleted_by' => auth()->id(),
            ]);

            return Redirect::route('users.index')->with('success', 'User deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Failed to delete user', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return Redirect::back()->withErrors([
                'error' => 'Failed to delete user. Please try again.'
            ]);
        }
    }
}
