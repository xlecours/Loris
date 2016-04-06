

For each tab (CNV,SNP): 
4. Do the table columns sort upon clicking on the column headers?
5. Test all filters. Does the "Show data" button apply filters correctly?
6. Does the "Clear Form" button reset all filters? (except for user-site filter)
7. Does the dropdown "Display:" filter work? The "Summary fields" option should display a dozen columns in the data table; "All fields" should show many more columns.   
8. Apply a Candidate or Gene filter, then click on a different tab (CNV/SNP).  Verify that the filter still applies.




/****** New stuff *********/
#Genomic Browser module - Test Plan

1. LORIS Menu
	A) For a user that does not have the genomic_browser_view_site and genomic_browser_view_allsites permissions, the 'Genomic Browser' should not appear.
	B) For a user that have the genomic_browser_view_allsites permission, the 'Genomic Browser' menu should appear under 'Tools'.
	C) For a user that have the genomic_browser_view_site permission, the 'Genomic Browser' menu should appear under 'Tools'.

2. Landing page
	A) For a user that have the genomic_browser_view_site or genomic_browser_view_allsites, clicking on the 'Genomic Browser' menu should load the 'profile' tab. 
	B) For a user that does not have the genomic_browser_view_site and genomic_browser_view_allsites a Page showing "You do not have access to this page" should appear.


3. Profile tab
        A) Verify that module loads only data from user`s own site unless they have genomic_browser_view_allsites permission.
	

4. GWAS

5. SNP

6. CNV

7. Methylation

