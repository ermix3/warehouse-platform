<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Commercial Invoice</title>
    <style>
        /* Page setup for DomPDF */
        @page {
            size: A4;
            margin: 12mm 10mm;
        }

        /* Simplified body for DomPDF (avoid flex and full viewport heights) */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #222;
        }

        .invoice-container {
            padding: 16px;
            box-sizing: border-box;
        }

        .top-section {
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 100%;
            height: auto;
        }

        .table-container {
            padding-left: 5px;
        }

        .table-3x1 {
            width: 100%;
            border-collapse: collapse;
        }

        .table-3x1 td {
            padding-top: 10px;
            text-align: center;
        }

        .invoice-title {
            text-align: center;
            font-weight: bold;
            text-decoration: underline;
            font-size: 24px;
            margin: 20px 0;
        }

        .table-data {
            width: 100%;
            border-collapse: collapse;
        }

        .table-data th,
        .table-data td {
            padding: 8px;
            border: 1px solid black;
            text-align: left;
        }

        .amount-section {
            width: 100%;
            margin-top: 20px;
            font-family: Arial, sans-serif;
        }

        .amount-words {
            font-weight: bold;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }

        .totals {
            width: 100%;
            text-align: left;
            margin-top: 20px;
        }

        .label {
            width: 30%;
            font-weight: bold;
        }

        .value {
            /*width: 15%;*/
            text-align: right;
        }

        .stamp img {
            width: 100px;
            /*height: auto;*/
        }

        /* ---- */
        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
@php
    // Prepare base64 logo data so DomPDF can embed the image reliably
    $logoPath = public_path('images/Picture1.png');
    $logoData = null;
    if (file_exists($logoPath)) {
        $ext = strtolower(pathinfo($logoPath, PATHINFO_EXTENSION));
        $mime = $ext === 'svg' ? 'image/svg+xml' : ($ext === 'jpg' || $ext === 'jpeg' ? 'image/jpeg' : 'image/png');
        $logoData = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($logoPath));
    }

    $stampPath = public_path('images/stamp.png');
    $stampData = null;
    if (file_exists($stampPath)) {
        $ext = strtolower(pathinfo($stampPath, PATHINFO_EXTENSION));
        $mime = $ext === 'svg' ? 'image/svg+xml' : ($ext === 'jpg' || $ext === 'jpeg' ? 'image/jpeg' : 'image/png');
        $stampData = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($stampPath));
    }
@endphp

<div class="invoice-container">
    <!-- LOGO and TABLE side-by-side in one div -->
    <header class="top-section" style="display:block; margin-bottom:20px;">
        <div class="logo" style="float:left; width:40%;">
            @if ($logoData)
                <img src="{{ $logoData }}" alt="Company Logo">
            @else
                <img src="{{ asset('images/Picture1.png') }}" alt="Company Logo">
            @endif
        </div>
        <div class="table-container" style="float:right; width:58%; padding-left:5px;">
            <table class="table-3x1" style="width:100%;">
                <tr>
                    <td style="font-weight:bolder;">BRAGADO TRADING L.L.C</td>
                </tr>
                <tr>
                    <td>405-407 (8), TOWER B, BUSINESS VILLAGE, DEIRA, DUBAI, U.A.E</td>
                </tr>
                <tr>
                    <td>TEL: +971 55-180 21 20, +971 52-6321959</td>
                </tr>
            </table>
        </div>
        <div style="clear:both"></div>
    </header>
    <hr>

    <section>
        <!-- PACKING LIST text -->
        <div class="invoice-title">PACKING LIST</div>

        <!-- Consignee and Invoice Info Side by Side -->
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
            <tr>
                <td style="vertical-align:top; width:60%; padding-right:10px;">
                    <div class="info-box" style="padding:0;">
                        <strong>Consignee:</strong><br>
                        BARAGADO GRUOUP <br>
                        RAFIDIA, NABLUS - WEST BANK - ISRAEL <br>
                        V.A.T NO: 562578245 <br>
                        TEL: 00972-9 2377-070 <br>
                    </div>
                </td>
                <td style="vertical-align:top; width:40%; padding-left:10px;">
                    <div class="info-box" style="padding:0;">
                        <strong>Invoice Number:</strong> INV-001<br>
                        <strong>Date:</strong> {{ $date }}
                    </div>
                </td>
            </tr>
        </table>
    </section>

    <main>
        <table class="table-data">
            <thead>
            <th>NO</th>
            <th>DESCRIPTION</th>
            <th>PACKING</th>
            <th>CTN</th>
            <th>UNIT</th>
            <th>TOTAL</th>
            <th>NET WEIGHT</th>
            <th>GROSS WEIGHT</th>
            </thead>
            <tbody>
            @foreach ($groupedData as $customerCode => $items)
                @foreach ($items as $item)
                    @php
                        $itemCode = sprintf('%s %d (%d)', $item->customer_code, $item->customer_index, $item->item_index);
                        $totalNumber = $item->order_item->ctn * $item->product->box_qtt;
                    @endphp
                    <tr>
                        <td>{{ $itemCode }}</td>
                        <td class="text-left">
                            {{ $item->product->name }}
                        </td>
                        <td>{{ $item->product->box_qtt }}</td>
                        <td>{{ $item->order_item->ctn }}</td>
                        <td>PCS</td>
                        <td>{{ $totalNumber }}</td>
                        <td>{{ $item->product->net_weight }}</td>
                        <td>{{ $item->product->box_weight * $item->order_item->ctn }}</td>
                    </tr>
                @endforeach
            @endforeach
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3" style="text-align: right; font-weight: bold; text-transform: uppercase;">
                    Total
                </td>
                <td style="text-align: center; font-weight: bold; text-transform: uppercase;">
                    {{ number_format($totalCartons, 2) }}
                </td>
                <td colspan="2" >
                    CARTONS
                </td>
                <td>
                    {{ $totalNetWeight }} KGS
                </td>
                <td>
                    {{ $totalGrossWeight }} KGS
                </td>
            </tr>
            </tfoot>
        </table>
    </main>

    <footer class="amount-section">
        <div><span class="amount-words">TOTAL AMOUNT IN THE WORDS: </span>{{ $totalCartonsInWords }}</div>

        <table class="totals">
            <tr>
                <td colspan="3"></td>
                <td style="text-align: end; font-weight: bold;">STAMP AND SIGNATURE</td>
            </tr>
            <tr>
                <td class="label">TOTAL CARTONS :</td>
                <td class="value">{{ $totalCartons }} CTN</td>
                <td></td>
                <td rowspan="3" style="text-align: center; ">
                    @if ($stampData)
                        <img src="{{ $stampData }}" alt="Stamp">
                    @else
                        <img src="{{ asset('images/stamp.png') }}" alt="Stamp">
                    @endif
                </td>
            </tr>
            <tr>
                <td class="label">TOTAL GROSS WEIGHT :</td>
                <td class="value">{{ $totalGrossWeight }} KGS</td>
                <td></td>
            </tr>
            <tr>
                <td class="label">TOTAL NET WEIGHT :</td>
                <td class="value">{{ $totalNetWeight }} KGS</td>
                <td></td>
            </tr>
        </table>
    </footer>

</div>
</body>

</html>
