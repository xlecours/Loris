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
- The only candidate's data that should appear in the datatable of the Profile, CNV,  SNP and Methylation tabs should be those of the same site then this user's site.


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
