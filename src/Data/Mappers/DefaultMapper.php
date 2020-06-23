<?php declare(strict_types=1);

namespace LORIS\Data\Mappers;

class DefaultMapper
{
    public function map(string $json): string
    {
        return $json;
    }
}
