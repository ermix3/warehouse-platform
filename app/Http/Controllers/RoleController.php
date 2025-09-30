<?php

namespace App\Http\Controllers;

use App\Enums\RolesEnum;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Role::class);
        $query = Role::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSortFields = ['id', 'name'];
        $allowedSortOrders = ['asc', 'desc'];
        if (in_array($sortBy, $allowedSortFields) && in_array($sortOrder, $allowedSortOrders)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'desc');
        }

        $roles = $query->with('permissions')->paginate(10)->appends($request->query());
        $permissions = Permission::all();

        return Inertia::render('role/index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ]
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Role::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create(['name' => $validated['name']]);
            $role->syncPermissions($validated['permissions']);
            DB::commit();

            return back()->with('success', 'Role created successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create role: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $this->authorize('update', $role);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        // Prevent updating system roles
        if (in_array($role->name, RolesEnum::cases())) {
            return back()->with('error', 'Cannot update system roles.');
        }

        DB::beginTransaction();
        try {
            $role->update(['name' => $validated['name']]);
            $role->syncPermissions($validated['permissions']);
            DB::commit();

            return back()->with('success', 'Role updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update role: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);

        // Check if the role is assigned to any user
        if ($role->users()->count() > 0) {
            return back()->with('error', 'Cannot delete role assigned to users.');
        }

        try {
            $role->delete();
            return back()->with('success', 'Role deleted successfully.');
        } catch (Exception $e) {
            return back()->with('error', 'Failed to delete role: ' . $e->getMessage());
        }
    }
}
