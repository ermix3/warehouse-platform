<?php

namespace App\Enums;


enum RolesEnum: string
{
    case ADMIN = 'admin';
    case OFFICER = 'officer';
    case STAFF = 'staff';
    case ACCOUNTANT = 'accountant';
    case CUSTOMER = 'customer';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
