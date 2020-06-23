<?php declare(strict_types=1);
namespace LORIS\dqt;

class SelectedFieldsResults
{
    private $fields = [];

    public function __construct(array $fields) {
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

    public function map(string $json): string
    {
        $obj = json_decode($json);

        $key  = $obj->key ?? [''];
        $data = $obj->doc->data ?? null;

        $values = [];
        foreach ($this->_fields[$key[0]] as $field) {
            $values[$field] = $data->$field ?? 'N/A';   
        }

        return json_encode([
            'key' => $key,
            'data' => $values
        ]);
    }
}
