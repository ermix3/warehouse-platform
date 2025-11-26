<?php

namespace App\Helpers;

class NumberToWords
{
    /**
     * Public entry to convert a number to words with an optional unit (default: DOLLARS).
     */
    public static function toWords($number, string $unit = 'DOLLARS')
    {
        $unitUpper = strtoupper($unit);

        // Currency behavior: include cents
        if ($unitUpper === 'DOLLARS' || $unitUpper === 'DOLLAR') {
            $number = (float)$number;
            $whole = (int)$number;
            $fraction = (int)round(($number - $whole) * 100);

            $words = self::convertNumberToWords($whole) . ' DOLLARS';

            if ($fraction > 0) {
                $words .= ' AND ' . self::convertNumberToWords($fraction) . ' CENTS';
            }

            return $words . ' ONLY';
        }

        // Non-currency units (treat as whole numbers)
        $whole = (int)round($number);

        $unitWord = $unitUpper;
        if ($whole === 1) {
            if (substr($unitWord, -1) === 'S') {
                $unitWord = substr($unitWord, 0, -1);
            }
        }

        return self::convertNumberToWords($whole) . ' ' . $unitWord . ' ONLY';
    }

    /**
     * Internal: convert integer portion to words (UPPERCASE)
     */
    private static function convertNumberToWords($number)
    {
        $number = (int)$number;
        $result = '';

        if ($number < 0) {
            $result = 'NEGATIVE ' . self::convertNumberToWords(abs($number));
        } elseif ($number < 20) {
            $result = self::getUnits($number);
        } elseif ($number < 100) {
            $result = self::getTens($number);
        } elseif ($number < 1000) {
            $result = self::getHundreds($number);
        } else {
            $thousands = ['', 'THOUSAND', 'MILLION', 'BILLION', 'TRILLION'];
            $word = '';
            $i = 0;

            while ($number > 0) {
                $chunk = $number % 1000;
                if ($chunk != 0) {
                    $word = self::convertNumberToWords($chunk) . ' ' . $thousands[$i] . ' ' . $word;
                }
                $number = (int)($number / 1000);
                $i++;
            }

            $result = trim($word);
        }

        return $result;
    }

    private static function getUnits($number)
    {
        $units = [
            0 => 'ZERO',
            1 => 'ONE',
            2 => 'TWO',
            3 => 'THREE',
            4 => 'FOUR',
            5 => 'FIVE',
            6 => 'SIX',
            7 => 'SEVEN',
            8 => 'EIGHT',
            9 => 'NINE',
            10 => 'TEN',
            11 => 'ELEVEN',
            12 => 'TWELVE',
            13 => 'THIRTEEN',
            14 => 'FOURTEEN',
            15 => 'FIFTEEN',
            16 => 'SIXTEEN',
            17 => 'SEVENTEEN',
            18 => 'EIGHTEEN',
            19 => 'NINETEEN'
        ];

        return $units[$number] ?? '';
    }

    private static function getTens($number)
    {
        $tens = [
            2 => 'TWENTY',
            3 => 'THIRTY',
            4 => 'FORTY',
            5 => 'FIFTY',
            6 => 'SIXTY',
            7 => 'SEVENTY',
            8 => 'EIGHTY',
            9 => 'NINETY'
        ];

        $tensDigit = (int)($number / 10);
        $unitsDigit = $number % 10;

        $result = $tens[$tensDigit] ?? '';

        if ($unitsDigit > 0) {
            $result .= '-' . self::getUnits($unitsDigit);
        }

        return $result;
    }

    private static function getHundreds($number)
    {
        $hundreds = (int)($number / 100);
        $remainder = $number % 100;

        $result = self::getUnits($hundreds) . ' HUNDRED';

        if ($remainder > 0) {
            $result .= ' AND ' . self::convertNumberToWords($remainder);
        }

        return $result;
    }
}

