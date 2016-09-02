<div id='genomic_browser_app_container'></div>
<script>
loris.hiddenHeaders = ['Site', 'Dccid', 'External Id', 'Date Of Birth'];

var app = RGenomicBrowserApp({
  "module": "genomic_browser"
});
React.render(app, document.getElementById('genomic_browser_app_container'));
</script>
