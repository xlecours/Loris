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

    public function withName( string $name): ToolDescriptor
    {
        $new = clone $this;
        $new->name = $name;
        return $new;
    }

    public function withToolVersion( string $version): ToolDescriptor
    {
        $new = clone $this;
        $new->tool_version = $version;
        return $new;
    }

    public function withDescrtiption( string $desc): ToolDescriptor
    {
        $new = clone $this;
        $new->descrtiption = $desc;
        return $new;
    }

    public function withCommandLine( string $cmd): ToolDescriptor
    {
        $new = clone $this;
        $new->command_line = $cmd;
        return $new;
    }

    public function withSchemeVersion( string $version): ToolDescriptor
    {
        $new = clone $this;
        $new->scheme_version = $version;
        return $new;
    }

    public function withInputs( string $inputs): ToolDescriptor
    {
        $new = clone $this;
        $new->inputs = $inputs;
        return $new;
    }

    public function withOutputFiles( string $filename): ToolDescriptor
    {
        $new = clone $this;
        $new->output_files = $filename;
        return $new;
    }

    public function getName(): string
    {
        return $this->name ?? '';
    }

    public function getTool_version(): string
    {
        return $this->tool_version ?? '';
    }

    public function getDescrtiption(): string
    {
        return $this->description ?? '';
    }

    public function getCommandLine(): string
    {
        return $this->command_line ?? '';
    }

    public function getScheme_version(): string
    {
        return $this->schema_version ?? '';
    }

    public function getInputs(): string
    {
        return $this->inputs ?? '';
    }

    public function getOutput_files(): string
    {
        return $this->output_files ?? '';
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
} 

