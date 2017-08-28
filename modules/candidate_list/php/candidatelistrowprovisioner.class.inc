<?php

namespace LORIS\candidate_list;

use \LORIS\Data\Models\AccessObjects;

class CandidateListRowProvisioner extends \LORIS\Data\Provisioner {
    protected function GetAllRows() : array {
        $candidate_dao = new AccessObjects\Candidate();
        $site_dao      = new AccessObjects\Site();

        return array_map(function($c) use ($site_dao) {
            $site   = $site_dao->getOne(array($c->getCenterID()));

//          $visits = $visit_dao->getAllByCandidate($c->getCandID()); 
            $visits = array();

            $hasScanDone = array_reduce($visits, function ($carry, $item) {
                return $carry || $item->getScan_done() == 'Y';
            }, false);

            $chrono_cmp = function ($v1, $v2) {
                return strcmp($v1->getDate_visit(), $v2->getDate_visit());
            };
            usort($visits, $chrono_cmp);

//          $latestVisitStatus = end($visits)->getCurrent_stage();
            $latestVisitStatus = 'TBD';

            $row = array(
                "Site"                => $site->getName(),
                "DCCID"               => $c->getCandId(),
                "PSCID"               => $c->getPscid(),
                "Gender"              => $c->getGender(),
                "Entity Type"         => $c->getEntity_Type(),
                "Participant Status"  => 'Active', // TODO 
                "Subproject"          => 'High, Low', // TODO
                "DoB"                 => $c->getDob(),
                "Scan Done"           => $hasScanDone,
                "Visit Count"         => count($visits),
                "Latest Visit Status" => $latestVisitStatus,
                "Feedback"            => 'Yeah!'
            );
            return new CandidateListRow($row, $c->getCenterID());
        }, $candidate_dao->getAll());
    }
}
