<?php

namespace App\Exports;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shipment;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ShipmentsExport implements FromCollection, WithHeadings, WithMapping, WithCustomCsvSettings
{
    protected ?int $shipmentId;

    public function __construct(?int $shipmentId = null)
    {
        $this->shipmentId = $shipmentId;
    }

    /**
     * Get the collection of export rows for the shipment(s).
     */
    public function collection(): Collection
    {
        $query = Shipment::with([
            'orders.items.product',
            'orders.customer',
        ]);

        if ($this->shipmentId) {
            $query->where('id', $this->shipmentId);
        }

        $shipments = $query->get();
        $exportData = collect();

        foreach ($shipments as $shipment) {
            $customerOrderIndexes = [];

            foreach ($shipment->orders as $order) {
                $customerCode = $order->customer?->code ?? 'UNKNOWN';
                if (!isset($customerOrderIndexes[$customerCode])) {
                    $customerOrderIndexes[$customerCode] = 1;
                }
                $customerIdx = $customerOrderIndexes[$customerCode];
                $customerOrderIndexes[$customerCode]++;

                $itemIndex = 1;
                foreach ($order->items as $orderItem) {
                    $product = $orderItem->product;
                    if (!$product) {
                        continue;
                    }

                    // Create a data row for each order item
                    $exportData->push((object)[
                        'customer_code' => $customerCode,
                        'customer_index' => $customerIdx,
                        'item_index' => $itemIndex++, // per order
                        'product' => $product,
                        'order_item' => $orderItem,
                        'order' => $order,
                        'shipment' => $shipment,
                    ]);
                }
            }
        }

        return $exportData;
    }

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
            'W', 'H', 'L',
            'CBM'
        ];
    }

    /**
     * Map each row according to the detailed requirements from comments.
     *
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        /** @var Product $product */
        $product = $row->product;
        /** @var OrderItem $orderItem */
        $orderItem = $row->order_item;
        $customerCode = $row->customer_code;
        $customerIdx = $row->customer_index;
        $itemIdx = $row->item_index;

        // Item code: composite of `code` and `order index` and `item index` of product (Example: C1 1 (1))
        $itemCode = sprintf('%s %d (%d)', $customerCode, $customerIdx, $itemIdx);

        // Calculations
        $ctn = (float)($orderItem->ctn ?? 0);
        $boxQty = (float)($product->box_qtt ?? 0);
        $unitPrice = (float)($product->unit_price ?? 0);
        $netWeight = (float)($product->net_weight ?? 0);
        $boxWeight = (float)($product->box_weight ?? 0);
        $width = (float)($product->width ?? 0);
        $height = (float)($product->height ?? 0);
        $length = (float)($product->length ?? 0);

        // Total number: ctn * box_qtt
        $totalNumber = $ctn * $boxQty;

        // Total amount: ctn * box_qtt * unit_price
        $totalAmount = $totalNumber * $unitPrice;

        // Net weight: net_weight * ctn * box_qtt
        $totalNetWeight = $netWeight * $totalNumber;

        // Gross weight: box_weight * ctn
        $totalGrossWeight = $boxWeight * $ctn;

        // CBM: (width * height * length * ctn) / 1000000
        $cbm = ($width * $height * $length * $ctn) / 1000000;

        return [
            $itemCode,
            $product->barcode ?? '',
            $product->name ?? '',
            $product->hs_code ?? '',
            $product->origin ?? '',
            $ctn,
            $boxQty,
            $totalNumber,
            ' AED ' . $unitPrice,
            ' AED ' . $totalAmount,
            ' KGS ' . $totalNetWeight,
            ' KGS ' . $totalGrossWeight,
            ' CM ' . $width,
            ' CM ' . $height,
            ' CM ' . $length,
            round($cbm, 6),
        ];
    }

    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ',',
            'enclosure' => '"',
            'line_ending' => "\r\n",
            'use_bom' => true, // Helps with Excel opening UTF-8 CSV
            'include_separator_line' => false,
            'excel_compatibility' => true,
        ];
    }
}
