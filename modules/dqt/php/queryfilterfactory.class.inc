<?php declare(strict_types=1);

namespace LORIS\dqt;

class QueryFilterFactory
{
    /**
     * Handles the creation of the query filter tree. 
     *
     * @param $queryfilter an array which shape is a Filter or a Group.
     *
     * @return QueryFilters
     * @see API schema
     */
    public static function create(array $queryfilter): QueryFilters
    {
        $type = $queryfilter['type'] ?? null;
        switch ($type) {
            case 'group':
                return new QueryGroup($queryfilter);

            case 'filter':
                return new QueryFilter($queryfilter);

        default:
            throw new \LorisException(
                'Unknowned fitler type: ' . print_r($type, true)
            );
        }
    }
}
