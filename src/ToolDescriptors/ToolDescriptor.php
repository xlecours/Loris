<?php

namespace LORIS\ToolDescriptors;

abstract class ToolDescriptor
{
    // Mandatory Boutique descriptor properties
    private $name;
    private $tool_version;
    private $descrtiption;
    private $command_line;
    private $scheme_version;
    private $inputs;
    private $output_files;

    public function withName( string $name): TollDescriptor
    {
        $new = clone $this;
        $new->name = $name;
        return $new;
    }

    public function withToolVersion( string $version): TollDescriptor
    {
        $new = clone $this;
        $new->tool_version = $version;
        return $new;
    }

    public function withDescrtiption( string $desc): TollDescriptor
    {
        $new = clone $this;
        $new->descrtiption = $desc;
        return $new;
    }
    public function withCommandLine( string $cmd): TollDescriptor
    {
        $new = clone $this;
        $new->command_line = $cmd;
        return $new;
    }
    public function withSchemeVersion( string $version): TollDescriptor
    {
        $new = clone $this;
        $new->scheme_version = $version;
        return $new;
    }
    public function withInputs( string $inputs): TollDescriptor
    {
        $new = clone $this;
        $new->inputs = $inputs;
        return $new;
    }
    public function withOutputFiles( string $filename): TollDescriptor
    {
        $new = clone $this;
        $new->output_files = $filename;
        return $new;
    }

    public function getCommandLine(): string
    {
        return $this->command_line ?? '';
    }

    public function withCommandLine(string $cmd): ToolDescriptor
    {
        $new = clone $this;
        $new->command_line = $cmd;
        return $new;
    }

    public function toJSON: string
    {
        return json_encode(get_object_vars($this),true);
    }
} 
