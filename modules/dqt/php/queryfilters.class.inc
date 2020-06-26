<?php declare(strict_types=1);

namespace LORIS\dqt;

/**
 * Either a FilterGroup of a FilterItem
 */
interface QueryFilters extends \JsonSerializable
{
     public function getFilteredSessions(\User $user): \Traversable; 
}
