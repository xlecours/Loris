<?php

namespace LORIS\ToolDescriptors;

class ToolDescriptor
{
    // Mandatory Boutique descriptor properties
    private $name;
    private $tool_version;
    private $descrtiption;
    private $command_line;
    private $scheme_version;
    private $inputs;
    private $output_files;

    // Optionnal Boutique descriptor properties

    // Accessors
    public function withCommandLine(string $cmd): ToolDescriptor
    {
        $new = clone $this;
        $new->command_line = $cmd;
        return $new;
    }

    public function getcommandLine(): string
    {
        return $this->command_line ?? '';
    }
}
