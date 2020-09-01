<?php declare(strict_types=1);

namespace LORIS\dqt;
/**
 * api_docs unit tests for the QueryGroup class
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use PHPUnit\Framework\TestCase;

require(__DIR__ . '/../php/queryfilters.class.inc');
require(__DIR__ . '/../php/querygroup.class.inc');

class QueryGroupTest extends TestCase
{
    /**
     * @dataProvider intersectProvider
     */
    public function test_intersect(\Traversable $a, \Traversable $b, \Traversable $expected, string $msg): void
    {
        $obj    = new \ReflectionClass('\LORIS\dqt\QueryGroup');
        $method = $obj->getMethod('_intersect');
        $method->setAccessible(true);
        
        $result = $method->invokeArgs($obj, [$a, $b]);

        $this->assertEquals(
            iterator_to_array($expected),
            iterator_to_array($result),
            $msg
        );
    } 

    /**
     * @dataProvider unionProvider
     */
    public function test_union(\Traversable $a, \Traversable $b, \Traversable $expected, string $msg): void
    {
        $obj    = new \ReflectionClass('\LORIS\dqt\QueryGroup');
        $method = $obj->getMethod('_union');
        $method->setAccessible(true);

        $result = $method->invokeArgs($obj, [$a, $b]);

        $this->assertEquals(
            iterator_to_array($expected),
            iterator_to_array($result),
            $msg
        );
    }

    public function intersectProvider()
    {
        return [
            [$this->emptygenerator(), $this->emptygenerator(), $this->emptygenerator(), 'empty, empty, empty'],
            [$this->emptygenerator(), $this->evengenerator(), $this->emptygenerator(), 'empty, even, empty'],
            [$this->evengenerator(), $this->emptygenerator(), $this->emptygenerator(), 'even, empty, empty'],
            [$this->evengenerator(), $this->evengenerator(), $this->evengenerator(), 'even, even, even'],
            [$this->evengenerator(), $this->oddgenerator(), $this->emptygenerator(), 'even, odd, empty'],
            [$this->oddgenerator(), $this->evengenerator(), $this->emptygenerator(), 'odd, even, empty'],
            [$this->oddgenerator(), $this->onetotengenerator(), $this->oddgenerator(), 'odd, onetoten, odd'],
            [$this->onetotengenerator(), $this->oddgenerator(), $this->oddgenerator(), 'onetoten, odd, odd'],
            [$this->oddgenerator(), $this->primegenerator(), new \ArrayIterator([3,5,7]), 'odd, prime, custom'],
            [$this->primegenerator(), $this->oddgenerator(), new \ArrayIterator([3,5,7]), 'prime, odd, custom'],
        ];
    }

    public function unionProvider()
    {
        return [
            [$this->emptygenerator(), $this->emptygenerator(), $this->emptygenerator(), 'empty, empty, empty'],
            [$this->emptygenerator(), $this->evengenerator(), $this->evengenerator(), 'empty, even, even'],
            [$this->evengenerator(), $this->emptygenerator(), $this->evengenerator(), 'even, empty, even'],
            [$this->evengenerator(), $this->evengenerator(), $this->evengenerator(), 'even, even, even'],
            [$this->evengenerator(), $this->oddgenerator(), $this->onetotengenerator(), 'even, odd, onetoten'],
            [$this->oddgenerator(), $this->evengenerator(), $this->onetotengenerator(), 'odd, even, onetoten'],
            [$this->oddgenerator(), $this->primegenerator(), new \ArrayIterator([1,2,3,5,7,9]), 'odd, prime, custom'],
            [$this->primegenerator(), $this->oddgenerator(), new \ArrayIterator([1,2,3,5,7,9]), 'prime, odd,custom'],
        ];
    }

    public function emptygenerator() : \Traversable
    {
        yield from [];
    }

    public function evengenerator() : \ Traversable
    {
        yield from range(0,10,2);
    }

    public function oddgenerator() : \Traversable
    {
        yield from range(1,10,2);
    }

    public function onetotengenerator() : \Traversable
    {
        yield from range(0,10,1);
    }

    public function primegenerator(): \Traversable
    {
        yield from [2,3,5,7];
    }
}
