<?php declare(strict_types=1);

namespace LORIS\dqt;

class QueryFields
{
    private $_fields = [];

    public function __construct(array $fields)
    {
        array_walk($fields, function ($item) {
            // Validate required properties
            $cat = $item['category'] ?? null;
            if ($cat === null) {
                throw new \LorisException('SelectedFieldsResults:: category missing.');
            }

            $field = $item['field'];
            if ($field === null) {
                throw new \LorisException('SelectedFieldsResults:: field missing.');
            }

            // Set instance variable
            if (!isset($this->_fields[$cat])) {
                $this->_fields[$cat] = [];
            }

            $this->_fields[$cat][] = $field;
        });
    }

    public function getSelectedFields(\User $user, \Traversable $sessions): \Traversable
    {
        foreach ($this->_createdKeysChunks($sessions) as $keys) {
            yield from $this->_getResultBatch($user, $keys);
        }
    }

    private function _createdKeysChunks(\Traversable $sessions): \Traversable
    {
        $instruments = array_keys($this->_fields);

        foreach ($sessions as $count => $desired) {
            $value = json_decode($desired, true)['value'];
            foreach ($instruments as $instrument){
                $keys[] = [$instrument,$value[0],$value[1]];
                if (++$count % 25000 === 0) {
                    yield $keys;
                    $keys = null;
                }
            }
        }

        if ($keys !== null) {
            yield $keys;
            $keys = null;
        }
    }

    /**
     * Trusting php copy-on-write strategy here. Do not modify $keys
     */
    private function _getResultBatch(\User $user, array &$keys): \Traversable
    {
        $prov = new CouchDBViewProvisioner(
            'DQG-2.0',
            'instruments',
            [
                "reduce" => "false",
                "keys" => $keys,
                "include_docs" => "true"
            ]
        );        

        $keys = null;

        // Limit the returned data to the selected fields.
        foreach ($prov->execute($user) as $json) {
            $obj = json_decode($json);

            $key  = $obj->key ?? [''];
            $data = $obj->doc->data ?? null;

            $values = [];
            foreach ($this->_fields[$key[0]] as $field) {
                $values[$field] = $data->$field ?? 'N/A';
            }

            $string = json_encode([
                'key' => $key,
                'data' => $values
            ]);

            yield $string;
        }
    }

    private function _createProvisioner(array $keys): CouchDBViewProvisioner
    {
        return new CouchDBViewProvisioner(
            'DQG-2.0',
            'instruments',
            [
                "reduce" => "false",
                "keys" => $keys,
                "include_docs" => "true"
            ]
        );
    }
}
