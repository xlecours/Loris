<?php
/**
  This is a pipeline to run a pcev analysis from the R package on CBRAIN.

  https://github.com/eauforest/pcev_pipelineCBRAIN
*/
namespace LORIS\tools;

abstract class Tool extends \NDB_Form
{
    
    public function setup()
    {
        $this->form = new \LorisForm();
    }

    public function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        $this->addHeader("_setupPage function must be overidden in " . get_class($this));
    }

    public function save()
    {
        $method = 'handle' . $_SERVER['REQUEST_METHOD'] ?? '';
        if (method_exists($this, $method)) {
            $this->{$method}();
        }   
    }

    public function _hasAccess()
    {
        return true;
    }

    public function display()
    {
        $content = null;
        $format = $_REQUEST['format'] ?? null;
        switch ($format) {
            case 'json':
                $content = json_encode($this->form->toArray());
                break;
            case 'html':
                $content = $this->form->toHTML();
                break;
        }
        return $content;
    }
}
