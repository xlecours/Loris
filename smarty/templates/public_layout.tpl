{*
  This layout is used for all the 'public' modules
  (i.e Loris modules or pages that don't require user to be logged in)
*}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="DC.identifier" content="https://doi.org/10.3389/fninf.2011.00037">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{$page_title}</title>
  <link rel="stylesheet" href="{$baseurl}/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="{$baseurl}/css/public_layout.css">
  <link type="image/x-icon" rel="icon" href="{$baseurl}/images/favicon.ico">
  <script src="{$baseurl}/js/jquery/jquery-1.11.0.min.js" type="text/javascript"></script>
  <script>
  document.addEventListener('DOMContentLoaded', function(event) {

    const dcIdentifier = $("meta[name='DC.identifier']").attr("content");
    if (dcIdentifier === undefined) {
      return;
    }

    const doi = dcIdentifier.substr(16);
    let url = "https://data.datacite.org/application/vnd.schemaorg.ld+json/" + doi;

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status != 200) { 
          console.error("Request failed");
        }
        
        let script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify({
          "@context": "http://schema.org",
          "@type": "SoftwareApplication",
          "name": "LORIS",
          "applicationCategory": "Science",
          "applicationSubCategory": [
            "neuroimaging",
            "data management",
            "data querying",
            "imaging data",
            "behavioral data"
          ],
          "isBasedOn": "https://github.com/aces/Loris",
          "citation": JSON.parse(xhr.responseText), 
          "operatingSystem": "GNU/Linux"
        });
        document.head.appendChild(script);
      }
    };
    
    xhr.open('GET', url);
    xhr.send();
  });
  </script>
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="flex-wrapper">
        <div class="loris-logo">
          <a href="{$baseurl}">
            <img src="{$baseurl}/images/LORIS_logo_white.svg" class="loris-logo" alt="Loris Logo"/>
          </a>
        </div>
        <div class="study-title hidden-xs">
          {$study_title}
        </div>
        <div class="github-logo">
          <a href="https://github.com/aces/Loris" target="_blank">
            <img src="{$baseurl}/images/GitHub-Mark-Light-64px.png" alt="Github"/>
          </a>
        </div>
      </div>
    </div>
  </header>

  <section class="main-content">
    {* Load appropriate page content, default to login page *}
    {if $page == 'password-reset'}
      {include file='password_reset.tpl'}
    {elseif $page == 'password-expiry'}
      {include file='password_expiry.tpl'}
    {elseif $page == 'request_account'}
      {include file='request_account.tpl'}
    {else}
      {include file='login.tpl'}
    {/if}
  </section>

  <footer class="footer">
    Powered by <a href="http://www.loris.ca/" target="_blank">LORIS</a>
    | GPL-3.0 &copy; {$currentyear} <br/>
    Developed at
    <a href="http://www.mni.mcgill.ca" target="_blank">
      Montreal Neurological Institute and Hospital
    </a>
    by <a href="http://mcin-cnim.ca" target="_blank">MCIN</a>
  </footer>
  <script src="{$baseurl}/js/modernizr/modernizr.min.js"/>
  <script>
    if (!Modernizr.webgl) {
      alert("Please download the latest version of Google Chrome of Mozilla Firefox in order to use Loris!");
    }
  </script>
</body>
</html>
