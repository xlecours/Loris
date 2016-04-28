
#Genomic Browser module - Test Plan

####Permissions
***

#####For a user without neither genomic_browser_view_allsites nor genomic_browser_view_site :

- The Loris menu should not contain a *Genomic Browser* item.
- Accessing the http://your-base-url/genomic_browser/ should present the following error message: 

> **You do not have access to this page.**  


***

#####For a user with genomic_browser_view_allsites only :

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.

***

#####For a user with genomic_browser_view_site only :

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.
- The only candidate's data that should appear in the Datatable of the Profile, CNV,  SNP and Methylation tabs should be those of the same site then this user's site.


####Features
#####Filters 
######Profile Tab
- Clicking on the *Candidate filters* block header should hide its content.
- Clicking on the *Genomic filters* block header should hide its content.
- Dropdown filters should filter data presented in the Datatable according to the selected values after clicking on the *Show Data* button.
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


####Features
#####Filters 
######Profile Tab
- Clicking on the *Candidate filters* block header should hide its content
- Clicking on the *Genomic filters* block header should hide its content
- Dropdown filters should filter data presented in the datatable
- The datatable should display the folowing columns

| No. | PSCID | Gender | Subproject | Files | SNPs | CNVs | CPGs |
| ---| --- | ---| --- | ---| --- | ---| ---|
| | | | | | | | |

- Setting the Display filter to All fields and click in the *Show Data* button should present the folowing columns in the Datatable

No.|PSC|DCCID|PSCID|Gender|Subproject|DoB|ExternalID|Files|SNPs|CNVs|CPGs|
| ---| --- | --- | ---| --- | ---| --- | ---| ---| --- | ---| ---|
| | | | | | | | | | | |
