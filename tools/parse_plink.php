<?php

$sample_pscid_mapping = new SplFileInfo('/data/loris/data/genomics/genomic_uploader/sample_pscid_mapping.csv');
$samples_file = $sample_pscid_mapping->openFile('r');

$values = new SplFileInfo('/data/loris/data/genomics/genomic_uploader/plink.tped');
$values_file = $values->openFile('r');

$sample_index = 0;
while (!$samples_file->eof()) {
    list($sample_name, $pscid) = $samples_file->fgetcsv();
    while (!$values_file->eof()) {
       $line = $values_file->fgets();
       list($chr, $name, $dist, $location, $alleles) = preg_split('/ /', $line, 5);
       $tuples = preg_split('/([\w-]+ [\w-]+) /', $alleles, null, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
       echo "$name $sample_name $tuples[$sample_index]\n";
    }
    $values_file->rewind();
    $sample_index++;
}
