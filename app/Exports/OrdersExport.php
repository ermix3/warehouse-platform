<?php

namespace App\Exports;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrdersExport implements FromCollection, WithHeadings, WithMapping, WithCustomCsvSettings, ShouldAutoSize
{
    protected ?int $orderId;
    protected ?Order $order = null;

    public function __construct(?int $orderId = null)
    {
        $this->orderId = $orderId;
        if ($orderId) {
            $this->order = Order::with(['customer', 'items.product', 'shipment'])->find($orderId);
        }
    }

    /**
     * Get the collection of export rows for the order(s).
     */
    public function collection(): Collection
    {
        if (!$this->order) {
            return collect();
        }

        return $this->order->items->map(function ($item, $index) {
            $product = $item->product;
            $customerCode = $this->order->customer?->code ?? 'N/A';
            $itemCode = sprintf('%s-%d', $customerCode, $index+1);

            $ctn = (float)($item->ctn ?? 0);
            $boxQty = (float)($item->box_qtt ?? 0);
            $unitPrice = (float)($item->unit_price ?? 0);
            $sum = (float)($item->sum ?? 0);

            $barcode = $product?->barcode ?? 'N/A';
            $name = $product?->name ?? 'N/A';
            $hsCode = $product?->hs_code ?? 'N/A';
            $origin = $product?->origin ?? 'N/A';
            $netWeight = (float)($product->net_weight ?? 0);
            $boxWeight = (float)($product->box_weight ?? 0);
            $width = (float)($product->width ?? 0);
            $height = (float)($product->height ?? 0);
            $length = (float)($product->length ?? 0);

            $totalAmount = $unitPrice * $sum;
            $totalNetWeight = $netWeight * $sum;
            $gross_weight = $boxWeight * $ctn;
            $cbm = ($width * $height * $length * $ctn) / 1000000;

            return [
                'itemCode' => $itemCode,
                'barcode' => $barcode,
                'name' => $name,
                'hsCode' => $hsCode,
                'origin' => $origin,
                'ctn' => $ctn,
                'boxQtt' => $boxQty,
                'totalQtt' => $sum,
                'unitPrice' => $unitPrice,
                'totalAmount' => $totalAmount,
                'netWeight' => $totalNetWeight,
                'grossWeight' => $gross_weight,
                'w' => $width,
                'h' => $height,
                'l' => $length,
                'cbm' => $cbm,
            ];
        });
    }

    /**
     * Map the data for the export.
     */
    public function map($item): array
    {
        return [
            $item['itemCode'],
            $item['barcode'],
            $item['name'],
            $item['hsCode'],
            $item['origin'],
            $item['ctn'],
            $item['boxQtt'],
            $item['totalQtt'],
            ' AED ' . number_format($item['unitPrice'], 2),
            ' AED ' . number_format($item['totalAmount'], 2),
            ' KGS ' . number_format($item['netWeight'], 2),
            ' KGS ' . number_format($item['grossWeight'], 2),
            ' CM ' . number_format($item['w'], 2),
            ' CM ' . number_format($item['h'], 2),
            ' CM ' . number_format($item['l'], 2),
            number_format($item['cbm'], 6),
        ];
    }

    /**
     * Define the headings for the export.
     */
    public function headings(): array
    {
        return [
            'Item code',
            'barcode',
            'name',
            'HSCODE',
            'origin',
            'ctn',
            'box/QTY',
            'Total number',
            'Unit price',
            'Total amount',
            'Net weight',
            'Gross weight',
            'W',
            'H',
            'L',
            'CBM'
        ];
    }

    /**
     * Set CSV specific settings.
     */

    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ',',
            'enclosure' => '"',
            'line_ending' => "\\n",
            'use_bom' => true,
            'include_separator_line' => true,
            'excel_compatibility' => true,
        ];
    }
}
