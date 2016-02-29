<?php
/**
* The candidate list menu
*
* PHP Version 5
*
* @category Main
* @package  Candidate_List
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/

/**
 * Implements the candidate_list menu
 *
* @category Main
* @package  Candidate_List
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Filter_Candidate_List extends NDB_Menu_Filter
{
    var $AjaxModule = true;
    /**
     * Overloading this method to allow access to site users (their own site only)
     * and users w/ multisite privs
     *
     * @return true if user has access, false otherwise
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        $site =& Site::singleton($user->getData('CenterID'));
        $aap  = $user->hasPermission('access_all_profiles');
        $this->tpl_data['access_all_profiles'] = $aap;
        return (
            $user->hasPermission('access_all_profiles')
            || ($site->isStudySite() && $user->hasPermission('data_entry'))
        );
    }

    /**
     * Sets up all the class variables needed for the candidate_list menu
     * filter
     *
     * @return true on success
     */
    function _setupVariables()
    {
        $user   =& User::singleton();
        $config =& NDB_Config::singleton();

        $this->tpl_data['toggled_visible'] =false;

        // set the class variables
        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "false") {
            $useProjects = false;
        }

        // set the class variables
        $this->columns = array(
                          'psc.Name AS Site',
                          'c.CandID AS DCCID',
                          'c.PSCID',
                          'c.Gender',
                          "COALESCE(pso.Description,'\"Active\"') "
                          . " AS Participant_Status",
                         );
        if ($useProjects) {
            $this->columns[] = 'p.Name as Project';
        }
        $this->columns =array_merge(
            $this->columns,
            array(
             'GROUP_CONCAT(DISTINCT sp.title) as Subproject',
             'DATE_FORMAT(c.DoB,\'%Y-%m-%d\') AS DoB',
             'MAX(s.Scan_done) as scan_Done',
            )
        );

        $this->formToFilter = array(
                               'centerID'     => 'c.CenterID',
                               'DCCID'        => 'c.CandID',
                               'PSCID'        => 'c.PSCID',
                               'gender'       => 'c.Gender',
                               'SubprojectID' => 's.SubprojectID',
                              );

        $this->validFilters = array(
                               'pso.ID',
                               'c.CenterID',
                               'c.CandID',
                               'c.PSCID',
                               'c.Gender',
                              );
        if ($config->getSetting("useEDC")==="true") {
            $this->columns[]           ='DATE_FORMAT((c.EDC),\'%Y-%m-%d\') AS EDC';
            $this->formToFilter['edc'] = 'c.EDC';
            $this->validFilters[]      = 'c.EDC';
        }

        // Need distinct because of joining with feedback_bvl_thread
        $VisitCountSQL = 'COUNT(DISTINCT s.Visit_label)';
        $FeedbackSQL   = 'MIN(feedback_bvl_thread.Status+0)';

        $this->columns = array_merge(
            $this->columns,
            array(
             "$VisitCountSQL as Visit_count",
             'max(s.Current_stage) as Latest_visit_status',
             "$FeedbackSQL as Feedback",
            )
        );

        $this->query = " FROM candidate c
            LEFT JOIN psc ON (c.CenterID=psc.CenterID)
            LEFT JOIN session s ON (c.CandID = s.CandID AND s.Active = 'Y')
            LEFT JOIN feedback_bvl_thread
                ON (c.CandID=feedback_bvl_thread.CandID)
            LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
            LEFT JOIN participant_status_options pso
                ON (ps.participant_status=pso.ID)
            LEFT JOIN Project p ON (c.ProjectID=p.ProjectID)
            LEFT JOIN subproject sp ON (s.SubprojectID=sp.SubprojectID)
            WHERE c.Entity_type = 'Human' AND c.Active = 'Y'";

        if (!$user->hasPermission('access_all_profiles')) {
            $this->query .= " AND c.CenterID=" . $user->getCenterID();
        }

                          //'COALESCE(pso.ID,1) AS Participant_Status',
        $this->group_by = 'c.CandID, psc.Name, c.PSCID, c.Gender';
        $this->order_by = 'psc.Name, c.CandID DESC';

        if ($useProjects) {
            $this->validFilters[] = 'c.ProjectID';
        }
        $this->validFilters = array_merge(
            $this->validFilters,
            array(
             's.SubprojectID',
             'c.DoB',
             $VisitCountSQL,
             'max(s.Current_stage)',
             $FeedbackSQL,
             's.Scan_done',
             's.Visit_label',
            )
        );

        $this->validHavingFilters = array(
                                     $VisitCountSQL,
                                     'max(s.Current_stage)',
                                     $FeedbackSQL,
                                    );
        $this->EqualityFilters    = array(
                                     's.SubprojectID',
                                     'c.CenterID',
                                     'c.ProjectID',
                                     's.Scan_done',
                                     'pso.ID',
                                     's.Visit_label',
                                     'c.Gender',
                                    );

        if ($useProjects) {
            $this->formToFilter = array_merge(
                $this->formToFilter,
                array('ProjectID' => 'c.ProjectID')
            );
        }
        $this->formToFilter = array_merge(
            $this->formToFilter,
            array(
             'dob'                 => 'c.DoB',
             'Visit_Count'         => $VisitCountSQL,
             'Latest_Visit_Status' => 'max(s.Current_stage)',
             'Feedback'            => $FeedbackSQL,
             'Participant_Status'  => 'pso.ID',
             'scan_done'           => 's.Scan_done',
             'Visit_label'         => 's.Visit_label',
            )
        );

        return true;
    }


    /**
     * Create the form for the candidate_list menu page
     *
     * @return none
     */
    function _setFilterForm()
    {
        include_once __DIR__
            . "/../../candidate_parameters/php/"
            . "NDB_Form_candidate_parameters.class.inc";
            //+  NDB_Form_candidate_parameters::getParticipantStatusOptions();
        // create user object
        $user   =& User::singleton();
        $config =& NDB_Config::singleton();

        // PSC
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'All') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $list_of_sites = array();
                $list_of_sites[$user->getData('CenterID')] = $user->getData('Site');
            }
        }

        // SubprojectID
        $list_of_subprojects = Utility::getSubprojectList();

        // list of feedback statuses
        $feedback_status_options = array(
                                    null => 'All',
                                    '0'  => 'None',
                                    '1'  => 'opened',
                                    '2'  => 'answered',
                                    '3'  => 'closed',
                                    '4'  => 'comment',
                                   );

        $latest_visit_status_options = array(
                                        null            => 'All',
                                        'Not Started'   => 'Not Started',
                                        'Screening'     => 'Screening',
                                        'Visit'         => 'Visit',
                                        'Approval'      => 'Approval',
                                        'Recycling Bin' => 'Recycling Bin',
                                       );

        $participant_status_options = array(null => 'All')
            +  NDB_Form_candidate_parameters::getParticipantStatusOptions();
        $scan_options = array(
                         null => 'All',
                         'Y'  => 'Yes',
                         'N'  => 'No',
                        );
        // Get visits
        $visits = Utility::getVisitList();
        $visits = array_merge(array('' => 'All'), $visits);

        // add form elements
        $this->addSelect('centerID', 'Site', $list_of_sites);
        $this->addBasicText('PSCID', 'PSCID');
        $this->addBasicText('DCCID', 'DCCID');
        $this->addBasicText('candID', 'DCCID');
        $this->addSelect(
            'Visit_label',
            'Visit Label',
            $visits
        );

        $this->addSelect(
            'gender',
            'Gender',
            array(
             ''       => 'All',
             'Male'   => 'Male',
             'Female' => 'Female',
            )
        );
        $this->addSelect(
            'SubprojectID',
            'Subproject',
            array('' => 'All') + $list_of_subprojects
        );
        $this->addBasicText('dob', 'Date of Birth', array('maxlength' => 10));
        $this->addBasicText('Visit_Count', 'Number of Visits');
        $this->addSelect(
            'Latest_Visit_Status',
            'Latest Visit Status',
            $latest_visit_status_options
        );
        $this->addSelect('Feedback', 'Feedback', $feedback_status_options);
        $this->addSelect(
            'Participant_Status',
            'Participant Status',
            $participant_status_options
        );
        $this->addSelect('scan_done', 'Scan Done', $scan_options);

        // Project list, if applicable
        if ($config->getSetting("useProjects")==="true") {
            $list_of_projects = array(null => 'All');
            $projectList      = Utility::getProjectList();
            foreach ($projectList as $key => $value) {
                $list_of_projects[$key] =$value;
            }
            $this->addSelect('ProjectID', 'Project', $list_of_projects);
        }
        if ($config->getSetting("useEDC")=="true") {
            $this->addBasicText(
                'edc',
                'EDC',
                array('maxlength' => 10)
            );
            $this->tpl_data['useEDC'] = "true";
        }
        $this->addSelect(
            'feedback',
            'Feedback Status',
            array_merge(array('' => 'All'), $feedback_status_options)
        );

        return true;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/js/advancedMenu.js",
             $baseURL . "/candidate_list/js/columnFormatter.js",
            )
        );
    }
}
?>
