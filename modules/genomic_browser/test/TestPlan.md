Genomic Browser module - Test Plan
-------------

Permissions
: For a user without neither **genomic_browser_view_allsites** nor **genomic_browser_view_site** :

	- The Loris menu should not contain a *Genomic Browser* item.
	- Accessing the http://your-base-url/genomic_browser/ should present the following error message: 
	> **You do not have access to this page.**  
 
 : For a user with  **genomic_browser_view_allsites** only:

	- There should be a *Genomic Browser* item in the Loris Menu under tools.
	- Accessing the http://your-base-url/genomic_browser/ should load the Genomic Browser Profile tab.
















#Genomic Browser module - Test Plan

1. Verify that module is listed under the Tools menu only if the user has genomic_browser_view_site or genomic_browser_view_allsites permission.
2. Verify that module loads only if the user has genomic_browser_view_site or genomic_browser_view_allsites permission.
3. Verify that module loads only data from user\'s own site unless they have genomic_browser_view_allsites permission.

For each tab (CNV,SNP): 
4. Do the table columns sort upon clicking on the column headers?
5. Test all filters. Does the "Show data" button apply filters correctly?
6. Does the "Clear Form" button reset all filters? (except for user-site filter)
7. Does the dropdown "Display:" filter work? The "Summary fields" option should display a dozen columns in the data table; "All fields" should show many more columns.   
8. Apply a Candidate or Gene filter, then click on a different tab (CNV/SNP).  Verify that the filter still applies.

