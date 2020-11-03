<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Mapper
 * @package    Data Query Tool
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\dqt;

class CategoryMapper
{
    /**
     * Map returns a copy of $resource that has been modified in some way
     * It must return a new DataInstance without having modified the original.
     *
     * The data mapping should be a pure function of the original data and
     * the user that it's being mapped for.
     *
     * @param \User        $user     The user that this is being mapped on
     *                               behalf of.
     * @param DataInstance $resource The data being mapped from.
     *
     * @return DataInstance a new DataInstance with the map applied.
     */
    public function map(string $json) : array
    {
        $data = json_decode($json, true);
        $categoryname = $data['key'][0];
        $fieldname    = $data['key'][1];
        $type         = $data['value']['Type'];
        $description  = $data['value']['Description'];

        return [
            'name'        => $categoryname,
            'field'       => $fieldname,
            'type'        => $type,
            'description' => $description
        ];
    }
}
