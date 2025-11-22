<?php

namespace App\Http\Controllers;

use App\Http\Services\GlobalSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GlobalSearchController extends Controller
{
    public function __invoke(Request $request, GlobalSearchService $search): JsonResponse
    {
        $query = trim($request->get('q', ''));
        $limit = (int)$request->get('limit', 10);

        if ($query === '' || Str::length($query) < 2) {
            return response()->json([
                'query' => $query,
                'results' => [
                    'customers' => [],
                    'suppliers' => [],
                    'products' => [],
                    'orders' => [],
                    'shipments' => [],
                    'transactions' => [],
                ],
            ]);
        }

        return response()->json([
            'query' => $query,
            'results' => $search->search($query, $limit),
        ]);
    }
}
