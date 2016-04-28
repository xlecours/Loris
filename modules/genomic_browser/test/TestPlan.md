#Genomic Browser module - Test Plan

Permissions : For a user without neither genomic_browser_view_allsites nor genomic_browser_view_site :

- The Loris menu should not contain a *Genomic Browser* item.
- Accessing the http://your-base-url/genomic_browser/ should present the following error message: 

> **You do not have access to this page.**  

For a user with genomic_browser_view_allsites only:

- There should be a *Genomic Browser* item in the Loris Menu under tools.
- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.
