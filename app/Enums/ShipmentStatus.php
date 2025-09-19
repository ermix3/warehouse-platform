<?php
namespace App\Enums;

enum ShipmentStatus: string
{
    case PENDING = 'pending';
    case INTRANSIT = 'in_transit';
    case DELIVERED = 'delivered';
    case RETURNED = 'returned';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

