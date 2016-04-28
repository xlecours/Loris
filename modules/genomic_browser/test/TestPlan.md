#Genomic Browser module - Test Plan

###Permissions
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

###Page navigation and display
- There should be 6 tabs unders the breadcrumb: Profile, GWAS, SNP, CNV, Methylation and Files
- Clicking each tab should present it as active and the 5 other tabs should remain in te same order.

###Features

***
####Data Filtering


######Profile Tab
- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic filters* block header should hide its content.
- Dropdown filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
    - Candidate filters
        - Site dropdown should present all sites for a user with the genomic_browser_view_allsites permission
        - Site dropdown should present only the user's own site for a user with the genomic_browser_view_site permission
        - DCCID filter is an exact filter (Shows only the record with this exact value)
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

######GWAS tab
######SNP tab
######CNV tab
######Methylation tab
######Files tab


***
####Datatable 
***
######Record count
######Number of rows displayed
######Pagination

***
####Data download 
***
######CSV


###Help 
***
####Help section content
***
####Tooltips
######GWAS tab
######SNP tab
######CNV tab
######Methylation tab
######Files tab
