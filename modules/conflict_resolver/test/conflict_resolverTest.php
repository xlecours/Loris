<?php
/**
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\conflict_resolver;

/**
 * Automated integration tests for conflict resolver module
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ConflictResolverTestIntegrationTest extends \LorisIntegrationTest
{
    //filter location on conflict_resolver page
    static $ForSite    = 'select[name="Site"]';
    static $Instrument = 'select[name="instrument"]';
    static $VisitLabel = 'select[name="VisitLabel"]';
    static $CandID     = 'input[name="CandID"]';
    static $PSCID      = 'input[name="PSCID"]';
    static $Question   = 'input[name="Question"]';
    static $Project    = 'select[name="Project"]';

    //filter location on resolved_conflicts page
    static $Timestamp = 'input[name="ResolutionTimestamp"]';

    //public location for both pages
    static $clearFilter = 'button[type="reset"]';
    static $display     = '.table-header';
    /**
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->setUpConfigSetting("useProjects", "true");
    }
     /**
      * Delete testing data from database
      * author: Wang Shen
      *
      * @return void
      */
    function tearDown()
    {
        parent::tearDown();
        $this->restoreConfigSetting("useProjects");
        // if data not exist then insert the origin test data
        $CommentId1 = $this->DB->pselectOne(
            'SELECT CommentId1 FROM conflicts_unresolved
             WHERE CommentId1 ="475906DCC4222142111524502652"',
            []
        );
        if ($CommentId1 == null) {
            $this->DB->insert(
                "conflicts_unresolved",
                [
                    'TableName'  => 'radiology_review',
                    'FieldName'  => 'Scan_done',
                    'CommentId1' => '475906DCC4222142111524502652',
                    'Value1'     => 'yes',
                    'CommentId2' => 'DDE_475906DCC4222142111524502652',
                    'Value2'     => 'no'
                ]
            );
        }
        $this->DB->delete(
            "conflicts_resolved",
            ["CommentId1" => "475906DCC4222142111524502652"]
        );
    }

     /**
      * Tests that conflict resolver loads with the permission
      *
      * @return void
      */
    function testConflictResolverPermission()
    {
        $this->setupPermissions(array("conflict_resolver"));
        $this->safeGet($this->url . "/conflict_resolver");
        $this->webDriver->wait()->until(
            \WebDriverExpectedCondition::presenceOfElementLocated(
                \WebDriverBy::id('tab-unresolved')
            )
        );

        $this->resetPermissions();
    }
    /**
     * Tests that conflict resolver does not load with the permission
     *
     * @return void
     */
    function testConflictResolverWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/conflict_resolver");
        $bodyText = $this->webDriver->findElement(
            \WebDriverBy::id('lorisworkspace')
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testFiltersForUnresolvedConflicts()
    {
        $this->safeGet($this->url . "/conflict_resolver/");

        $this->webDriver->wait()->until(
            \WebDriverExpectedCondition::presenceOfElementLocated(
                \WebDriverBy::id('tab-unresolved')
            )
        );

        $this->_testFilter(self::$ForSite, "20 rows displayed of 311", '2');
        $this->_testFilter(self::$VisitLabel, "displayed of 573", '1');
        $this->_testFilter(self::$CandID, "2 rows displayed of 2", '300004');
        $this->_testFilter(self::$PSCID, "2 rows displayed of 2", 'MTL004');
        $this->_testFilter(self::$Question, "displayed of 180", 'height_inches');
        $this->_testFilter(self::$Project, "0 rows displayed of 0", '1');
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element location
     * @param string $records The records number in the table
     * @param string $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") === false) {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);
                "
            );
        } else {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
        }

        $row      = self::$display;
        $bodyText = $this->webDriver->executescript(
            "return document.querySelector('$row').textContent"
        );
        $this->assertContains($records, $bodyText);
        //test clear filter
        $btn = self::$clearFilter;
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );
        $inputText = $this->webDriver->executescript(
            "return document.querySelector('$element').value"
        );
        $this->assertEquals("", $inputText);
    }
     /**
      * Tests filter in resolved conflicts
      * author: Wang Shen
      *
      * @return void
      */
    function testFiltersForResolvedConflicts()
    {
        $this->safeGet($this->url . "/conflict_resolver");

        $this->webDriver->wait()->until(
            \WebDriverExpectedCondition::presenceOfElementLocated(
                \WebDriverBy::id('tab-resolved')
            )
        );

        $this->webDriver->executescript(
            "document.querySelector('#tab-resolved').click();"
        );

        // Clicking on the tab renders a new tab content.
        $this->webDriver->wait()->until(
            \WebDriverExpectedCondition::presenceOfElementLocated(
                \WebDriverBy::id('resolved')
            )
        );

        $this->_testFilter(self::$ForSite, "displayed of 14", '2');
        $this->_testFilter(self::$VisitLabel, "displayed of 32", '1');
        $this->_testFilter(self::$CandID, "1 row", '400167');
        $this->_testFilter(self::$PSCID, "1 row", 'ROM167');
        $this->_testFilter(self::$Question, "8 rows", 'date_taken');
        $this->_testFilter(self::$Timestamp, "1 row", '2016-08-16 18:35:51');

    }
     /**
      * Tests save a unresolved conflicts to resolved
      * author: Wang Shen
      *
      * @return void
      */
    function testSaveUnresolvedToResolved()
    {
         //set canID 475906 to resolved
        $this->safeGet(
            $this->url .
            "/conflict_resolver/?candidateID=475906&instrument=radiology_review"
        );
    }
}
