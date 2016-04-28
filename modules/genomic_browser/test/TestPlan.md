#Genomic Browser module - Test Plan
<br>
###Table of Contents  

####[Permissions](#permissions)   
####[Navigation](#navigation)  
####[Features](#features)  
######[Filtering](#data_filtering)  
######[Datatable](#datatable)
######[Download](#data_download)  
######[Upload](#data_upload)  
####[Help](#help)  
######[Help content](#help_content)
######[Tooltips](#tooltips)

<br>

<a name="permissions">
###Permissions
</a>
***

The following permissions should be available in the database

| code | description |
| :---: | --- |
| genomic_browser_view_site | View Genomic Browser data from own site |
| genomic_browser_view_allsites | View Genomic Browser data across all sites |
| genomic_data_manager | Manage the genomic files |

***
#####For a user without neither genomic_browser_view_allsites nor genomic_browser_view_site

- The Loris menu should not contain a *Genomic Browser* item.
- Accessing the http://your-base-url/genomic_browser/ should present the following error message: 

> **You do not have access to this page.**  

***
#####For a user with genomic_browser_view_allsites only

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.

***
#####For a user with genomic_browser_view_site only

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.
- The only candidate's data that should appear in the Datatable of the Profile, CNV,  SNP and Methylation tabs should be those of the same site then this user's site.

***
#####For a user with genomic_data_manager and one of genomic_data_manager or genomic_browser_view_allsites

- In the File tab of the genomic browser, there should be a *Upload File* button

<a name="navigation">
###Page navigation and display
</a>
***

- There should be 6 tabs unders the breadcrumb: Profile, GWAS, SNP, CNV, Methylation and Files
- Clicking each tab should present it as active and the 5 other tabs should remain in te same order.

<a name="features">
###Features
</a>
***
<a name="data_filtering">
####Data Filtering
</a>

######Profile tab
- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic filters
        * For the four filters, selecting 'Any' should only present record that have at least one, and selecting 'None' should present only record that don't have Files, SNP, CNV or CPG accordingly.

- The datatable should display the folowing columns (Summary fields)

| No. | PSCID | Gender | Subproject | Files | SNPs | CNVs | CPGs |
| ---| --- | ---| --- | ---| --- | ---| ---|
| | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the folowing columns in the Datatable

No.|PSC|DCCID|PSCID|Gender|Subproject|DoB|ExternalID|Files|SNPs|CNVs|CPGs|
| ---| --- | --- | ---| --- | ---| --- | ---| ---| --- | ---| ---|
| | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

<br>
######GWAS tab

- Clicking on the *GWAS filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - GWAS filters
        - *Chromosome* filter is an exact filter (Shows only the record with this exact value)
        - All other filters are contains filters (Shows all records that contains this value)

- Clicking the *Clear Form* button should reset the filters.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.

<br>
######SNP tab
- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic Range filters* block header should hide its content.
- Clicking on the *SNP filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic Range filters
        - *Genomic Range* filter should filter SNP to prensent only SNP that *StartLoc* is contain withing the range (i.e. chr14:100000-200000 should prensent all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.
    - SNP filters
        - All the filters are contains filters (Shows all records that contains this value)
- The datatable should display the folowing columns (Summary fields)

|No.|PSCID|Gender|RsID|Observed Base|Reference Base|Function Prediction|Damaging|Exonic Function|
| ---| --- | ---| --- | ---| --- | ---| ---| ---|
| | | | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the folowing columns in the Datatable

|No.|PSC|DCCID|PSCID|Gender|Subproject|DoB|ExternalID|Chromosome|Strand|StartLoc|EndLoc|Size|Gene Symbol|Gene Name|Platform|RsID|SNP|Name|SNP Description|External Source|Observed Base|Reference Base|Array Report|Markers|Validation Method|Validated|Function Prediction|Damaging|Genotype Quality|Exonic Function|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---| --- | --- | --- |
| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.
<br>

######CNV tab

 Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic Range filters* block header should hide its content.
- Clicking on the *CNV filters* block header should hide its content.
- Filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - *Site* dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - *Site* dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - *DCCID* filter is an exact filter (Shows only the record with this exact value)
        - *External ID* and *PSCID* are contains filters (Shows all records that contains this value)
    - Genomic Range filters
        - *Genomic Range* filter should filter SNP to prensent only SNP that *StartLoc* is contain withing the range (i.e. chr14:100000-200000 should prensent all the SNP on the chromosome 14 between position 1000000 and 2000000 inclusively.
        - By entering only the chromosome name in the *Genomic Range*, all the SNP on that chromosome should appear.
    - CNV filters
        - All the filters are contains filters (Shows all records that contains this value)
- The datatable should display the folowing columns (Summary fields)

|No.|PSCID|Gender|Location|CNV Description|CNV Type|Copy Num Change|Common CNV|Characteristics|Inheritance|
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the folowing columns in the Datatable

|No.|PSC|DCCID|PSCID|Gender|Subproject|DoB|ExternalID|Chromosome|Strand|StartLoc|EndLoc|Size|Location|Gene Symbol|Gene Name|CNV Description|CNV Type|Copy Num Change|Event Name|Common CNV|Characteristics|Inheritance|Array Report|Markers|Validation Method|Platform|
| | | | | | | | | | | | | | | | | | | | | | | | | | | |

- Clicking the *Clear Form* button should reset the filters and the Datatable should prensent the Summary fields columns only.
- Clicking on column headers should sort data in ascending order on the first click then descending order on the second click.
<br>
######Methylation tab

<br>
######Files tab


***
<a name="datatable">
####Datatable 
</a>
#####Record count
#####Number of rows displayed
#####Pagination
#####Special formated columns
######Profile tab
######GWAS tab
######SNP tab
######CNV tab
######Methylation tab
######Files tab

***
<a name="data_download">
####Data download 
</a>
######CSV
- The 6 tab Datatables should provide a *Download as CSV* button.
- Clicking on the *Download as CSV* button should trigger a file download.
- The file content should follow the filtered values of the tab.

######View Genomic File
- The view genomic file page should provide a *Download* button for each file.
- Clicking on the *Download* button should trigger a file download.

<a name="help">
###Help 
</a>

***
<a name="data_upload">
####Data upload 
</a>
***

<a name="help_content">
####Help section content
</a>
- The help panel should appear when clicking on the question mark in the LORIS menu bar.  
- The help text should be accurate at formatted properly.

<a name="tooltips">
####Tooltips
</a>
######GWAS tab
######SNP tab
######CNV tab
######Methylation tab
######Files tab
