<?php
// https://aarenson.github.io/PHPCap/api/

namespace LORIS\redcap;

use \IU\PHPCap\RedCap;

class Project extends \NDB_Page
{
    public $skipTemplate = true;

    public function setup() {
        $rc = new RedCap('https://bbmc.ouhsc.edu/redcap/api/');
        // $api = $rc->getConnection(); RedCapApiConnectionInterface

        $p = $rc->getProject('0434F0E9CF53ED0587847AB6E51DE762');
        $project_infos = $p->exportProjectInfo('php');
        // Many information about the project
 
        // Arms seems to be like cohortes
        $arms = $p->exportArms('php');
        /**
        array of:
        array(
            [arm_num] => 1
            [name] => Drug A
        )
         */

        // Notable events per cohort: Enrolement, visit 1, deadline to report
        $events = $p->exportEvents('php');
        /**
        array of:
        array(
            [event_name] => Deadline to return feedback
            [arm_num] => 2
            [day_offset] => 30
            [offset_min] => 0
            [offset_max] => 0
            [unique_event_name] => deadline_to_return_arm_2
            [custom_event_label] => 
        )
         */

        $fields = $p->exportFieldNames('php');
        /**
        array of:
        array(
            [original_field_name] => aerobics
            [choice_value] => 3
            [export_field_name] => aerobics___3
        )
         */
        
        // $file = $p->exportFile( string $recordId, string $field, string $event = null, integer $repeatInstance = null );
        // TODO :: To create a loop from getNextRecordID to 0 -- and each field name

        $instruments = $p->exportInstruments('php');
        /**
        array(
            [demographics] => Demographics
            [contact_info] => Contact Info
            [baseline_data] => Baseline Data
            [visit_lab_data] => Visit Lab Data
            [patient_morale_questionnaire] => Patient Morale Questionnaire
            [visit_blood_workup] => Visit Blood Workup
            [visit_observed_behavior] => Visit Observed Behavior
            [completion_data] => Completion Data
            [completion_project_questionnaire] => Completion Project Questionnaire
        )
         */

        $file = '/tmp/filename.txt'; //the name of the file (possibly with a path specified also) to store the PDF instruments in.
        $recordId = null; //if record ID is specified, the forms retrieved will be filled with values for that record. Otherwise, they will be blank.
        $event = null; // (only for longitudinal projects) a unique event name that is used when a record ID has been specified to return only forms that are in that event (for the specified records).
        $form = null;//if this is specified, only this form will be returned.
        $allRecords=true;//if this is set to true, all forms for all records will be retrieved (the $recordId, $event, and $form arguments will be ignored)
        // write all instruments forms in a pdf
        $p->exportPdfFileOfInstruments($file,$recordId,$event,$form,$allRecords );

        $instrumentMapping = $p->exportInstrumentEventMappings('php');
        /**
        array of:
        array
        (
            [arm_num] => 1
            [unique_event_name] => enrollment_arm_1
            [form] => demographics
        )
         */

        $metadata = $p->exportMetadata('php');
        /**
        array of:
        array(
            [field_name] => pmq2
            [form_name] => patient_morale_questionnaire
            [section_header] => 
            [field_type] => dropdown
            [field_label] => Using the handout, which level of dependence do you feel you are currently at?
            [select_choices_or_calculations] => 0, 0 | 1, 1 | 2, 2 | 3, 3 | 4, 4 | 5, 5
            [field_note] => 
            [text_validation_type_or_show_slider_number] => 
            [text_validation_min] => 
            [text_validation_max] => 
            [identifier] => 
            [branching_logic] => 
            [required_field] => 
            [custom_alignment] => 
            [question_number] => 
            [matrix_group_name] => 
            [matrix_ranking] => 
            [field_annotation] => 
        )
         */

        
        $returnMetadataOnly= false; //if this is set to true, only the metadata for the project is returned. If it is not set to true, the metadata and data for the project is returned.
        $recordIds = []; //array of strings with record id's that are to be retrieved.
        $fields = [];//array of field names to export
        $events = []; //array of event names for which fields should be exported
        $filterLogic = null; //logic used to restrict the records retrieved, e.g., "[last_name] = 'Smith'".
        $exportSurveyFields = false; //specifies whether survey fields should be exported.
        /**
            true - export the following survey fields:
                survey identifier field ('redcap_survey_identifier')
                survey timestamp fields (instrument+'_timestamp')
        */
        $exportDataAccessGroups = false; //specifies whether the data access group field ('redcap_data_access_group') should be exported.
        /**
            true - export the data access group field if there is at least one data access group, and the user calling the method (as identified by the API token) is not in a data access group.
         */
        $exportFiles = false; //If this is set to true, files will be exported in the XML. If it is not set to true, files will not be exported.

        $xml = $p->exportProjectXml($returnMetadataOnly,$recordIds,$fields,$events,$filterLogic,$exportSurveyFields,$exportDataAccessGroups,$exportFiles);
        $json = json_encode(simplexml_load_string($xml));
        $projectData = json_decode($json, TRUE);

        $nextRecordId = $p->generateNextRecordName();
     
        $participantData = $p->exportRecords('php', 'eav', [100]);

        $version = $p->exportRedcapVersion();

        //$x = $p->exportReports();

        $recId = 100;
        foreach ($instruments as $name => $label) {
            try {
                $x = $p->exportSurveyLink($recId, $name);
                print_r($x);
            } catch (\Exception $e) {
                //print_r($e->getMessage());
            }
        }

        foreach ($instruments as $name => $label) {
            try {
                $x = $p->exportSurveyParticipants($name);
                print_r($x);
            } catch (\Exception $e) {
                //print_r($e->getMessage());
            }
        }

        //$x = $p->exportSurveyQueueLink($recId); // The Survey Queue has not been enabled in this project

        $users = $p->exportUsers('php');

        $participantBatches = $p->getRecordIdBatches($batchSize = 2, $filterLogic = [],  $recordIdFieldName = null );

        $particpantFieldName = $p->getRecordIdFieldName();
        print_r($x);
    }
}
