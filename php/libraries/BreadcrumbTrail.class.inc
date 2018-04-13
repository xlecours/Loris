<?php

namespace LORIS;

class BreadcrumbTrail
{

    protected $breadcrumbs;

    public function __construct(Breadcrumb ...$crumbs)
    {
        $this->breadcrumbs = $crumbs ?? array();
    }

    public function withBreadcrumb(Breadcrumb $crumb): BreadcrumbTrail
    {
        $new = clone $this;
        array_push($new->breadcrumb, $crumb);
        return $new;
    }

    public function __toString(): string
    {
        return '[' . implode(',', $this->breadcrumbs) . ']';
    }
}
