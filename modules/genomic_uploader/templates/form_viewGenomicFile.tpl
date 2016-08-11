



<!DOCTYPE html>
<html lang="en" class="">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    

    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/frameworks-be4c6e0e479a2d4d0eb3159c8772b5bfc4aa39831cb28f5f92cc2e448d93eaa1.css" media="all" rel="stylesheet" />
    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github-d2dde4889cb969579b012dac0a02a7e61f6cd718193cbd6bc214b5c6892b594e.css" media="all" rel="stylesheet" />
    
    
    <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/site-c31d97cdffdd1a140b356a16a2e2b37db7c98fa23ce2127f79a61bc338af1083.css" media="all" rel="stylesheet" />
    

    <link as="script" href="https://assets-cdn.github.com/assets/frameworks-efdb851061bb7933d0e409f8be67f6ae483a2fa8612b913ae2678aa4abf4569a.js" rel="preload" />
    
    <link as="script" href="https://assets-cdn.github.com/assets/github-fa1ccb00d3f50cb35d9e0c4f04344327d0c184c13fb46070dfedab0fafd3950a.js" rel="preload" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <meta name="viewport" content="width=device-width">
    
    <title>Loris/form_viewGenomicFile.tpl at 16.1-dev · aces/Loris · GitHub</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="https://avatars2.githubusercontent.com/u/472868?v=3&amp;s=400" name="twitter:image:src" /><meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="aces/Loris" name="twitter:title" /><meta content="Loris - LORIS is a web-accessible database solution for longitudinal multi-site studies." name="twitter:description" />
      <meta content="https://avatars2.githubusercontent.com/u/472868?v=3&amp;s=400" property="og:image" /><meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="aces/Loris" property="og:title" /><meta content="https://github.com/aces/Loris" property="og:url" /><meta content="Loris - LORIS is a web-accessible database solution for longitudinal multi-site studies." property="og:description" />
      <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">
    <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">
    <link rel="assets" href="https://assets-cdn.github.com/">
    
    <meta name="pjax-timeout" content="1000">
    
    <meta name="request-id" content="84CEB28E:4464:11226DF:57ACBAA2" data-pjax-transient>

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>

    <meta name="google-site-verification" content="KT5gs8h0wvaagLKAVWq8bbeNwnZZK1r1XQysX3xurLU">
<meta name="google-site-verification" content="ZzhVyEFwb7w3e0-uOTltm8Jsck2F5StVihD0exw2fsA">
    <meta name="google-analytics" content="UA-3769691-2">

<meta content="collector.githubapp.com" name="octolytics-host" /><meta content="github" name="octolytics-app-id" /><meta content="84CEB28E:4464:11226DF:57ACBAA2" name="octolytics-dimension-request_id" />
<meta content="/&lt;user-name&gt;/&lt;repo-name&gt;/blob/show" data-pjax-transient="true" name="analytics-location" />



  <meta class="js-ga-set" name="dimension1" content="Logged Out">



        <meta name="hostname" content="github.com">
    <meta name="user-login" content="">

        <meta name="expected-hostname" content="github.com">
      <meta name="js-proxy-site-detection-payload" content="ZDk0NzQ2MmY0NDNlY2ZiN2EzNzViNTY5NGY3MThjNDEyMmRjM2E1ZTE0MGI3N2Y5M2YzMjY1ODMyYWRkNGE0N3x7InJlbW90ZV9hZGRyZXNzIjoiMTMyLjIwNi4xNzguMTQyIiwicmVxdWVzdF9pZCI6Ijg0Q0VCMjhFOjQ0NjQ6MTEyMjZERjo1N0FDQkFBMiIsInRpbWVzdGFtcCI6MTQ3MDkzNzc2Mn0=">


      <link rel="mask-icon" href="https://assets-cdn.github.com/pinned-octocat.svg" color="#4078c0">
      <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">

    <meta name="html-safe-nonce" content="8350649ba79f80e8f32a87018f284467f3a96159">
    <meta content="7cfe253640d8ce207d715bbdaf240c2275f1acb0" name="form-nonce" />

    <meta http-equiv="x-pjax-version" content="bb39aae5a4ead283a1594c66733256ab">
    

      
  <meta name="description" content="Loris - LORIS is a web-accessible database solution for longitudinal multi-site studies.">
  <meta name="go-import" content="github.com/aces/Loris git https://github.com/aces/Loris.git">

  <meta content="472868" name="octolytics-dimension-user_id" /><meta content="aces" name="octolytics-dimension-user_login" /><meta content="1125630" name="octolytics-dimension-repository_id" /><meta content="aces/Loris" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="1125630" name="octolytics-dimension-repository_network_root_id" /><meta content="aces/Loris" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/aces/Loris/commits/16.1-dev.atom" rel="alternate" title="Recent Commits to Loris:16.1-dev" type="application/atom+xml">


      <link rel="canonical" href="https://github.com/aces/Loris/blob/16.1-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl" data-pjax-transient>
  </head>


  <body class="logged-out  env-production  vis-public page-blob">
    <div id="js-pjax-loader-bar" class="pjax-loader-bar"><div class="progress"></div></div>
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>

    
    
    



          <header class="site-header js-details-container" role="banner">
  <div class="container-responsive">
    <a class="header-logo-invertocat" href="https://github.com/" aria-label="Homepage" data-ga-click="(Logged out) Header, go to homepage, icon:logo-wordmark">
      <svg aria-hidden="true" class="octicon octicon-mark-github" height="32" version="1.1" viewBox="0 0 16 16" width="32"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>

    <button class="btn-link right site-header-toggle js-details-target" type="button" aria-label="Toggle navigation">
      <svg aria-hidden="true" class="octicon octicon-three-bars" height="24" version="1.1" viewBox="0 0 12 16" width="18"><path d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"></path></svg>
    </button>

    <div class="site-header-menu">
      <nav class="site-header-nav site-header-nav-main">
        <a href="/personal" class="js-selected-navigation-item nav-item nav-item-personal" data-ga-click="Header, click, Nav menu - item:personal" data-selected-links="/personal /personal">
          Personal
</a>        <a href="/open-source" class="js-selected-navigation-item nav-item nav-item-opensource" data-ga-click="Header, click, Nav menu - item:opensource" data-selected-links="/open-source /open-source">
          Open source
</a>        <a href="/business" class="js-selected-navigation-item nav-item nav-item-business" data-ga-click="Header, click, Nav menu - item:business" data-selected-links="/business /business/features /business/customers /business">
          Business
</a>        <a href="/explore" class="js-selected-navigation-item nav-item nav-item-explore" data-ga-click="Header, click, Nav menu - item:explore" data-selected-links="/explore /trending /trending/developers /integrations /integrations/feature/code /integrations/feature/collaborate /integrations/feature/ship /explore">
          Explore
</a>      </nav>

      <div class="site-header-actions">
            <a class="btn btn-primary site-header-actions-btn" href="/join?source=header-repo" data-ga-click="(Logged out) Header, clicked Sign up, text:sign-up">Sign up</a>
          <a class="btn site-header-actions-btn mr-2" href="/login?return_to=%2Faces%2FLoris%2Fblob%2F16.1-dev%2Fmodules%2Fgenomic_browser%2Ftemplates%2Fform_viewGenomicFile.tpl" data-ga-click="(Logged out) Header, clicked Sign in, text:sign-in">Sign in</a>
      </div>

        <nav class="site-header-nav site-header-nav-secondary">
          <a class="nav-item" href="/pricing">Pricing</a>
          <a class="nav-item" href="/blog">Blog</a>
          <a class="nav-item" href="https://help.github.com">Support</a>
          <a class="nav-item header-search-link" href="https://github.com/search">Search GitHub</a>
              <div class="header-search scoped-search site-scoped-search js-site-search" role="search">
  <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="/aces/Loris/search" class="js-site-search-form" data-scoped-search-url="/aces/Loris/search" data-unscoped-search-url="/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
    <label class="form-control header-search-wrapper js-chromeless-input-container">
      <div class="header-search-scope">This repository</div>
      <input type="text"
        class="form-control header-search-input js-site-search-focus js-site-search-field is-clearable"
        data-hotkey="s"
        name="q"
        placeholder="Search"
        aria-label="Search this repository"
        data-unscoped-placeholder="Search GitHub"
        data-scoped-placeholder="Search"
        autocapitalize="off">
    </label>
</form></div>

        </nav>
    </div>
  </div>
</header>



    <div id="start-of-content" class="accessibility-aid"></div>

      <div id="js-flash-container">
</div>


    <div role="main">
        <div itemscope itemtype="http://schema.org/SoftwareSourceCode">
    <div id="js-repo-pjax-container" data-pjax-container>
      
<div class="pagehead repohead instapaper_ignore readability-menu experiment-repo-nav">
  <div class="container repohead-details-container">

    

<ul class="pagehead-actions">

  <li>
      <a href="/login?return_to=%2Faces%2FLoris"
    class="btn btn-sm btn-with-count tooltipped tooltipped-n"
    aria-label="You must be signed in to watch a repository" rel="nofollow">
    <svg aria-hidden="true" class="octicon octicon-eye" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
    Watch
  </a>
  <a class="social-count" href="/aces/Loris/watchers">
    20
  </a>

  </li>

  <li>
      <a href="/login?return_to=%2Faces%2FLoris"
    class="btn btn-sm btn-with-count tooltipped tooltipped-n"
    aria-label="You must be signed in to star a repository" rel="nofollow">
    <svg aria-hidden="true" class="octicon octicon-star" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg>
    Star
  </a>

    <a class="social-count js-social-count" href="/aces/Loris/stargazers">
      35
    </a>

  </li>

  <li>
      <a href="/login?return_to=%2Faces%2FLoris"
        class="btn btn-sm btn-with-count tooltipped tooltipped-n"
        aria-label="You must be signed in to fork a repository" rel="nofollow">
        <svg aria-hidden="true" class="octicon octicon-repo-forked" height="16" version="1.1" viewBox="0 0 10 16" width="10"><path d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
        Fork
      </a>

    <a href="/aces/Loris/network" class="social-count">
      58
    </a>
  </li>
</ul>

    <h1 class="public ">
  <svg aria-hidden="true" class="octicon octicon-repo" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
  <span class="author" itemprop="author"><a href="/aces" class="url fn" rel="author">aces</a></span><!--
--><span class="path-divider">/</span><!--
--><strong itemprop="name"><a href="/aces/Loris" data-pjax="#js-repo-pjax-container">Loris</a></strong>

</h1>

  </div>
  <div class="container">
    
<nav class="reponav js-repo-nav js-sidenav-container-pjax"
     itemscope
     itemtype="http://schema.org/BreadcrumbList"
     role="navigation"
     data-pjax="#js-repo-pjax-container">

  <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
    <a href="/aces/Loris" aria-selected="true" class="js-selected-navigation-item selected reponav-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /aces/Loris" itemprop="url">
      <svg aria-hidden="true" class="octicon octicon-code" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"></path></svg>
      <span itemprop="name">Code</span>
      <meta itemprop="position" content="1">
</a>  </span>

    <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
      <a href="/aces/Loris/issues" class="js-selected-navigation-item reponav-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /aces/Loris/issues" itemprop="url">
        <svg aria-hidden="true" class="octicon octicon-issue-opened" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg>
        <span itemprop="name">Issues</span>
        <span class="counter">4</span>
        <meta itemprop="position" content="2">
</a>    </span>

  <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
    <a href="/aces/Loris/pulls" class="js-selected-navigation-item reponav-item" data-hotkey="g p" data-selected-links="repo_pulls /aces/Loris/pulls" itemprop="url">
      <svg aria-hidden="true" class="octicon octicon-git-pull-request" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
      <span itemprop="name">Pull requests</span>
      <span class="counter">31</span>
      <meta itemprop="position" content="3">
</a>  </span>

    <a href="/aces/Loris/wiki" class="js-selected-navigation-item reponav-item" data-hotkey="g w" data-selected-links="repo_wiki /aces/Loris/wiki">
      <svg aria-hidden="true" class="octicon octicon-book" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"></path></svg>
      Wiki
</a>

  <a href="/aces/Loris/pulse" class="js-selected-navigation-item reponav-item" data-selected-links="pulse /aces/Loris/pulse">
    <svg aria-hidden="true" class="octicon octicon-pulse" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0v2h3.6l.9-1.8.9 5.4L9 8.5l1.6 1.5H14V8z"></path></svg>
    Pulse
</a>
  <a href="/aces/Loris/graphs" class="js-selected-navigation-item reponav-item" data-selected-links="repo_graphs repo_contributors /aces/Loris/graphs">
    <svg aria-hidden="true" class="octicon octicon-graph" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"></path></svg>
    Graphs
</a>

</nav>

  </div>
</div>

<div class="container new-discussion-timeline experiment-repo-nav">
  <div class="repository-content">

    

<a href="/aces/Loris/blob/89b0467ba73254273f4cbd56ad9bf2f69e627085/modules/genomic_browser/templates/form_viewGenomicFile.tpl" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

<!-- blob contrib key: blob_contributors:v21:0665245f552f277f547faac217f2c03b -->

<div class="file-navigation js-zeroclipboard-container">
  
<div class="select-menu branch-select-menu js-menu-container js-select-menu left">
  <button class="btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
    
    type="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <i>Branch:</i>
    <span class="js-select-button css-truncate-target">16.1-dev</span>
  </button>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>
        <span class="select-menu-title">Switch branches/tags</span>
      </div>

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="form-control js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab" role="tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab" role="tab">Tags</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches" role="menu">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/aces/Loris/blob/15.10-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
               data-name="15.10-dev"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                15.10-dev
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open selected"
               href="/aces/Loris/blob/16.1-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
               data-name="16.1-dev"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                16.1-dev
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/aces/Loris/blob/16.04-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
               data-name="16.04-dev"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                16.04-dev
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/aces/Loris/blob/17.0-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
               data-name="17.0-dev"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                17.0-dev
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/aces/Loris/blob/master/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
               data-name="master"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                master
              </span>
            </a>
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v16.0.2/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v16.0.2"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v16.0.2
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v16.0.1/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v16.0.1"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v16.0.1
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v16.0-rc2/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v16.0-rc2"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v16.0-rc2
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v16.0-rc1/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v16.0-rc1"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v16.0-rc1
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10.2/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10.2"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10.2
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10.1/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10.1"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10.1
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10-rc5/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10-rc5"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10-rc5
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10-rc4/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10-rc4"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10-rc4
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10-rc3/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10-rc3"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10-rc3
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10-rc2/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10-rc2"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10-rc2
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.10-rc1/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.10-rc1"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.10-rc1
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.4/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.4"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.4
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/v15.4k/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="v15.4k"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                v15.4k
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/state_20080930/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="state_20080930"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                state_20080930
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/loris-14.12.1/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="loris-14.12.1"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                loris-14.12.1
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/loris-14.12/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="loris-14.12"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                loris-14.12
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/loris-14.10/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="loris-14.10"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                loris-14.10
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/PublicRelease2/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="PublicRelease2"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                PublicRelease2
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/GitHubRelease-201312111/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="GitHubRelease-201312111"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                GitHubRelease-201312111
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/16.0.0/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="16.0.0"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                16.0.0
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
              href="/aces/Loris/tree/16.0-rc3/modules/genomic_browser/templates/form_viewGenomicFile.tpl"
              data-name="16.0-rc3"
              data-skip-pjax="true"
              rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
              <span class="select-menu-item-text css-truncate-target">
                16.0-rc3
              </span>
            </a>
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div>

    </div>
  </div>
</div>

  <div class="btn-group right">
    <a href="/aces/Loris/find/16.1-dev"
          class="js-pjax-capture-input btn btn-sm"
          data-pjax
          data-hotkey="t">
      Find file
    </a>
    <button aria-label="Copy file path to clipboard" class="js-zeroclipboard btn btn-sm zeroclipboard-button tooltipped tooltipped-s" data-copied-hint="Copied!" type="button">Copy path</button>
  </div>
  <div class="breadcrumb js-zeroclipboard-target">
    <span class="repo-root js-repo-root"><span class="js-path-segment"><a href="/aces/Loris"><span>Loris</span></a></span></span><span class="separator">/</span><span class="js-path-segment"><a href="/aces/Loris/tree/16.1-dev/modules"><span>modules</span></a></span><span class="separator">/</span><span class="js-path-segment"><a href="/aces/Loris/tree/16.1-dev/modules/genomic_browser"><span>genomic_browser</span></a></span><span class="separator">/</span><span class="js-path-segment"><a href="/aces/Loris/tree/16.1-dev/modules/genomic_browser/templates"><span>templates</span></a></span><span class="separator">/</span><strong class="final-path">form_viewGenomicFile.tpl</strong>
  </div>
</div>

<include-fragment class="commit-tease" src="/aces/Loris/contributors/16.1-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl">
  <div>
    Fetching contributors&hellip;
  </div>

  <div class="commit-tease-contributors">
    <img alt="" class="loader-loading left" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32-EAF2F5.gif" width="16" />
    <span class="loader-error">Cannot retrieve contributors at this time</span>
  </div>
</include-fragment>
<div class="file">
  <div class="file-header">
  <div class="file-actions">

    <div class="btn-group">
      <a href="/aces/Loris/raw/16.1-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl" class="btn btn-sm " id="raw-url">Raw</a>
        <a href="/aces/Loris/blame/16.1-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl" class="btn btn-sm js-update-url-with-hash">Blame</a>
      <a href="/aces/Loris/commits/16.1-dev/modules/genomic_browser/templates/form_viewGenomicFile.tpl" class="btn btn-sm " rel="nofollow">History</a>
    </div>


        <button type="button" class="btn-octicon disabled tooltipped tooltipped-nw"
          aria-label="You must be signed in to make or propose changes">
          <svg aria-hidden="true" class="octicon octicon-pencil" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg>
        </button>
        <button type="button" class="btn-octicon btn-octicon-danger disabled tooltipped tooltipped-nw"
          aria-label="You must be signed in to make or propose changes">
          <svg aria-hidden="true" class="octicon octicon-trashcan" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path></svg>
        </button>
  </div>

  <div class="file-info">
      91 lines (89 sloc)
      <span class="file-info-divider"></span>
    5.44 KB
  </div>
</div>

  

  <div itemprop="text" class="blob-wrapper data type-smarty">
      <table class="highlight tab-size js-file-line-container" data-tab-size="8">
      <tr>
        <td id="L1" class="blob-num js-line-number" data-line-number="1"></td>
        <td id="LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-c">&lt;!-- Main table --&gt;</span></td>
      </tr>
      <tr>
        <td id="L2" class="blob-num js-line-number" data-line-number="2"></td>
        <td id="LC2" class="blob-code blob-code-inner js-file-line">&lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>row<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L3" class="blob-num js-line-number" data-line-number="3"></td>
        <td id="LC3" class="blob-code blob-code-inner js-file-line"><span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">headerTable</span></span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L4" class="blob-num js-line-number" data-line-number="4"></td>
        <td id="LC4" class="blob-code blob-code-inner js-file-line">&lt;/<span class="pl-ent">div</span>&gt;</td>
      </tr>
      <tr>
        <td id="L5" class="blob-num js-line-number" data-line-number="5"></td>
        <td id="LC5" class="blob-code blob-code-inner js-file-line">
</td>
      </tr>
      <tr>
        <td id="L6" class="blob-num js-line-number" data-line-number="6"></td>
        <td id="LC6" class="blob-code blob-code-inner js-file-line">&lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel panel-default<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L7" class="blob-num js-line-number" data-line-number="7"></td>
        <td id="LC7" class="blob-code blob-code-inner js-file-line">    &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-heading<span class="pl-pds">&quot;</span></span> <span class="pl-e">id</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-main-heading<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L8" class="blob-num js-line-number" data-line-number="8"></td>
        <td id="LC8" class="blob-code blob-code-inner js-file-line">        &lt;<span class="pl-ent">h3</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-title<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">if</span> <span class="pl-smi">$<span class="pl-smi">files</span></span>|@count<span class="pl-pse">}</span><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>|@count<span class="pl-pse">}</span></span> file(s) displayed.&lt;/<span class="pl-ent">h3</span>&gt;</td>
      </tr>
      <tr>
        <td id="L9" class="blob-num js-line-number" data-line-number="9"></td>
        <td id="LC9" class="blob-code blob-code-inner js-file-line">        <span class="pl-c">{*&lt;span class=&quot;pull-right clickable mri-arrow glyphicon glyphicon-chevron-up&quot;&gt;&lt;/span&gt;*}</span></td>
      </tr>
      <tr>
        <td id="L10" class="blob-num js-line-number" data-line-number="10"></td>
        <td id="LC10" class="blob-code blob-code-inner js-file-line">    &lt;/<span class="pl-ent">div</span>&gt; <span class="pl-c">&lt;!-- closing panel-heading div--&gt;</span></td>
      </tr>
      <tr>
        <td id="L11" class="blob-num js-line-number" data-line-number="11"></td>
        <td id="LC11" class="blob-code blob-code-inner js-file-line">    &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-body<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L12" class="blob-num js-line-number" data-line-number="12"></td>
        <td id="LC12" class="blob-code blob-code-inner js-file-line">        <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">section</span> <span class="pl-v">name=</span>file <span class="pl-v">loop=</span><span class="pl-smi">$<span class="pl-smi">files</span></span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L13" class="blob-num js-line-number" data-line-number="13"></td>
        <td id="LC13" class="blob-code blob-code-inner js-file-line">            &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-12 col-md-6 ib_frame<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L14" class="blob-num js-line-number" data-line-number="14"></td>
        <td id="LC14" class="blob-code blob-code-inner js-file-line">                &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel panel-default<span class="pl-pds">&quot;</span></span> <span class="pl-e">id</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>subpanel-<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].GenomicFileID<span class="pl-pse">}</span></span><span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L15" class="blob-num js-line-number" data-line-number="15"></td>
        <td id="LC15" class="blob-code blob-code-inner js-file-line">                      &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-heading<span class="pl-pds">&quot;</span></span> <span class="pl-e">id</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>mri-panel-<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].GenomicFileID<span class="pl-pse">}</span></span><span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L16" class="blob-num js-line-number" data-line-number="16"></td>
        <td id="LC16" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">h3</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-title<span class="pl-pds">&quot;</span></span>&gt; </td>
      </tr>
      <tr>
        <td id="L17" class="blob-num js-line-number" data-line-number="17"></td>
        <td id="LC17" class="blob-code blob-code-inner js-file-line">                              <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">if</span> <span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Filename <span class="pl-k">!=</span> <span class="pl-s"><span class="pl-pds">&quot;</span><span class="pl-pds">&quot;</span></span><span class="pl-pse">}</span><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Filename<span class="pl-pse">}</span></span> </td>
      </tr>
      <tr>
        <td id="L18" class="blob-num js-line-number" data-line-number="18"></td>
        <td id="LC18" class="blob-code blob-code-inner js-file-line">                              <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">else</span><span class="pl-pse">}</span></span><span class="pl-c1">&amp;nbsp;</span><span class="pl-s1"><span class="pl-pse">{</span>/<span class="pl-k">if</span><span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">h3</span>&gt;</td>
      </tr>
      <tr>
        <td id="L19" class="blob-num js-line-number" data-line-number="19"></td>
        <td id="LC19" class="blob-code blob-code-inner js-file-line">                            <span class="pl-c">{* &lt;span class=&quot;pull-right clickable glyphicon arrow glyphicon-chevron-up&quot; onclick=&quot;toggle_mriPanel(&#39;{$files[file].GenomicFileID}&#39;)&quot;&gt;&lt;/span&gt; *}</span></td>
      </tr>
      <tr>
        <td id="L20" class="blob-num js-line-number" data-line-number="20"></td>
        <td id="LC20" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>pull-right<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L21" class="blob-num js-line-number" data-line-number="21"></td>
        <td id="LC21" class="blob-code blob-code-inner js-file-line">                                &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>btn-group views<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L22" class="blob-num js-line-number" data-line-number="22"></td>
        <td id="LC22" class="blob-code blob-code-inner js-file-line">                                    &lt;<span class="pl-ent">a</span> <span class="pl-e">href</span>=<span class="pl-s"><span class="pl-pds">&quot;</span><span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">baseurl</span></span><span class="pl-pse">}</span></span>/genomic_browser/ajax/get_genomic_file.php?GenomicFileID=<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].FileID<span class="pl-pse">}</span></span><span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L23" class="blob-num js-line-number" data-line-number="23"></td>
        <td id="LC23" class="blob-code blob-code-inner js-file-line">                                        &lt;<span class="pl-ent">button</span> <span class="pl-e">type</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>button<span class="pl-pds">&quot;</span></span> </td>
      </tr>
      <tr>
        <td id="L24" class="blob-num js-line-number" data-line-number="24"></td>
        <td id="LC24" class="blob-code blob-code-inner js-file-line">                                        <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>btn btn-default btn-xs <span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L25" class="blob-num js-line-number" data-line-number="25"></td>
        <td id="LC25" class="blob-code blob-code-inner js-file-line">                                        &lt;<span class="pl-ent">span</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>hidden=xs<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L26" class="blob-num js-line-number" data-line-number="26"></td>
        <td id="LC26" class="blob-code blob-code-inner js-file-line">                                        <span class="pl-c1">&amp;nbsp;&amp;nbsp;</span> Download </td>
      </tr>
      <tr>
        <td id="L27" class="blob-num js-line-number" data-line-number="27"></td>
        <td id="LC27" class="blob-code blob-code-inner js-file-line">                                        &lt;/<span class="pl-ent">span</span>&gt;</td>
      </tr>
      <tr>
        <td id="L28" class="blob-num js-line-number" data-line-number="28"></td>
        <td id="LC28" class="blob-code blob-code-inner js-file-line">                                        &lt;<span class="pl-ent">span</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>pull-right glyphicon glyphicon-download-alt<span class="pl-pds">&quot;</span></span>&gt;&lt;/<span class="pl-ent">span</span>&gt;</td>
      </tr>
      <tr>
        <td id="L29" class="blob-num js-line-number" data-line-number="29"></td>
        <td id="LC29" class="blob-code blob-code-inner js-file-line">                                        <span class="pl-c1">&amp;nbsp;&amp;nbsp;</span></td>
      </tr>
      <tr>
        <td id="L30" class="blob-num js-line-number" data-line-number="30"></td>
        <td id="LC30" class="blob-code blob-code-inner js-file-line">                                      &lt;/<span class="pl-ent">button</span>&gt;</td>
      </tr>
      <tr>
        <td id="L31" class="blob-num js-line-number" data-line-number="31"></td>
        <td id="LC31" class="blob-code blob-code-inner js-file-line">                                    &lt;/<span class="pl-ent">a</span>&gt; </td>
      </tr>
      <tr>
        <td id="L32" class="blob-num js-line-number" data-line-number="32"></td>
        <td id="LC32" class="blob-code blob-code-inner js-file-line">                                &lt;/<span class="pl-ent">div</span>&gt;<span class="pl-c">&lt;!--closing btn-group views div --&gt;</span></td>
      </tr>
      <tr>
        <td id="L33" class="blob-num js-line-number" data-line-number="33"></td>
        <td id="LC33" class="blob-code blob-code-inner js-file-line">                            &lt;/<span class="pl-ent">div</span>&gt;<span class="pl-c">&lt;!--cloding pull-right div --&gt;</span></td>
      </tr>
      <tr>
        <td id="L34" class="blob-num js-line-number" data-line-number="34"></td>
        <td id="LC34" class="blob-code blob-code-inner js-file-line">                      &lt;/<span class="pl-ent">div</span>&gt; <span class="pl-c">&lt;!--closing panel-heading clickable --&gt;</span></td>
      </tr>
      <tr>
        <td id="L35" class="blob-num js-line-number" data-line-number="35"></td>
        <td id="LC35" class="blob-code blob-code-inner js-file-line">                <span class="pl-c">{*  &lt;/div&gt; *}</span><span class="pl-c">&lt;!--closing row div --&gt;</span></td>
      </tr>
      <tr>
        <td id="L36" class="blob-num js-line-number" data-line-number="36"></td>
        <td id="LC36" class="blob-code blob-code-inner js-file-line">                      &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>panel-body<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L37" class="blob-num js-line-number" data-line-number="37"></td>
        <td id="LC37" class="blob-code blob-code-inner js-file-line">                      &lt;<span class="pl-ent">div</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>mri-righttable col-xs-12<span class="pl-pds">&quot;</span></span> <span class="pl-e">id</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>mri-righttable-<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].GenomicFileID<span class="pl-pse">}</span></span><span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L38" class="blob-num js-line-number" data-line-number="38"></td>
        <td id="LC38" class="blob-code blob-code-inner js-file-line">                      &lt;<span class="pl-ent">table</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>table table-hover table-bordered header-info col-xs-12 dynamictable<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L39" class="blob-num js-line-number" data-line-number="39"></td>
        <td id="LC39" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L40" class="blob-num js-line-number" data-line-number="40"></td>
        <td id="LC40" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Analysis Modality&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].AnalysisModality<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L41" class="blob-num js-line-number" data-line-number="41"></td>
        <td id="LC41" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Date Inserted&lt;/<span class="pl-ent">th</span>&gt;</td>
      </tr>
      <tr>
        <td id="L42" class="blob-num js-line-number" data-line-number="42"></td>
        <td id="LC42" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;</td>
      </tr>
      <tr>
        <td id="L43" class="blob-num js-line-number" data-line-number="43"></td>
        <td id="LC43" class="blob-code blob-code-inner js-file-line">                                <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">if</span> <span class="pl-smi">$<span class="pl-smi">files</span></span>[file].FileInsertDate<span class="pl-k">&gt;</span>0<span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L44" class="blob-num js-line-number" data-line-number="44"></td>
        <td id="LC44" class="blob-code blob-code-inner js-file-line">                                     <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].FileInsertDate<span class="pl-c1">|date_format</span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L45" class="blob-num js-line-number" data-line-number="45"></td>
        <td id="LC45" class="blob-code blob-code-inner js-file-line">                                <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">else</span><span class="pl-pse">}</span></span><span class="pl-c1">&amp;nbsp;</span></td>
      </tr>
      <tr>
        <td id="L46" class="blob-num js-line-number" data-line-number="46"></td>
        <td id="LC46" class="blob-code blob-code-inner js-file-line">                                <span class="pl-s1"><span class="pl-pse">{</span>/<span class="pl-k">if</span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L47" class="blob-num js-line-number" data-line-number="47"></td>
        <td id="LC47" class="blob-code blob-code-inner js-file-line">                            &lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L48" class="blob-num js-line-number" data-line-number="48"></td>
        <td id="LC48" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L49" class="blob-num js-line-number" data-line-number="49"></td>
        <td id="LC49" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Analysis Date&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].AnalysisDate<span class="pl-c1">|date_format</span><span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L50" class="blob-num js-line-number" data-line-number="50"></td>
        <td id="LC50" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Analysis Protocol&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].AnalysisProtocol<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L51" class="blob-num js-line-number" data-line-number="51"></td>
        <td id="LC51" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L52" class="blob-num js-line-number" data-line-number="52"></td>
        <td id="LC52" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Category&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;&lt;/<span class="pl-ent">b</span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Category<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">b</span>&gt;&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L53" class="blob-num js-line-number" data-line-number="53"></td>
        <td id="LC53" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Normalization&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Normalization<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L54" class="blob-num js-line-number" data-line-number="54"></td>
        <td id="LC54" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L55" class="blob-num js-line-number" data-line-number="55"></td>
        <td id="LC55" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L56" class="blob-num js-line-number" data-line-number="56"></td>
        <td id="LC56" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Pipeline&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Pipeline<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L57" class="blob-num js-line-number" data-line-number="57"></td>
        <td id="LC57" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Algorithm&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Algorithm<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L58" class="blob-num js-line-number" data-line-number="58"></td>
        <td id="LC58" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L59" class="blob-num js-line-number" data-line-number="59"></td>
        <td id="LC59" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L60" class="blob-num js-line-number" data-line-number="60"></td>
        <td id="LC60" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Description&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Description<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L61" class="blob-num js-line-number" data-line-number="61"></td>
        <td id="LC61" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Caveat&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Caveat<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L62" class="blob-num js-line-number" data-line-number="62"></td>
        <td id="LC62" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L63" class="blob-num js-line-number" data-line-number="63"></td>
        <td id="LC63" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L64" class="blob-num js-line-number" data-line-number="64"></td>
        <td id="LC64" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;FileType&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].FileType<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L65" class="blob-num js-line-number" data-line-number="65"></td>
        <td id="LC65" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;FileName&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Filename<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L66" class="blob-num js-line-number" data-line-number="66"></td>
        <td id="LC66" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L67" class="blob-num js-line-number" data-line-number="67"></td>
        <td id="LC67" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L68" class="blob-num js-line-number" data-line-number="68"></td>
        <td id="LC68" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;FileSize (Mb)&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].FileSize<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L69" class="blob-num js-line-number" data-line-number="69"></td>
        <td id="LC69" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Platform&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Platform<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L70" class="blob-num js-line-number" data-line-number="70"></td>
        <td id="LC70" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L71" class="blob-num js-line-number" data-line-number="71"></td>
        <td id="LC71" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L72" class="blob-num js-line-number" data-line-number="72"></td>
        <td id="LC72" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Batch&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Batch<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L73" class="blob-num js-line-number" data-line-number="73"></td>
        <td id="LC73" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Source&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Source<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L74" class="blob-num js-line-number" data-line-number="74"></td>
        <td id="LC74" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L75" class="blob-num js-line-number" data-line-number="75"></td>
        <td id="LC75" class="blob-code blob-code-inner js-file-line">                        &lt;<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L76" class="blob-num js-line-number" data-line-number="76"></td>
        <td id="LC76" class="blob-code blob-code-inner js-file-line">                            &lt;<span class="pl-ent">th</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2 info<span class="pl-pds">&quot;</span></span>&gt;Notes&lt;/<span class="pl-ent">th</span>&gt;&lt;<span class="pl-ent">td</span> <span class="pl-e">class</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>col-xs-2<span class="pl-pds">&quot;</span></span> <span class="pl-e">colspan</span>=<span class="pl-s"><span class="pl-pds">&quot;</span>3<span class="pl-pds">&quot;</span></span>&gt;<span class="pl-s1"><span class="pl-pse">{</span><span class="pl-smi">$<span class="pl-smi">files</span></span>[file].Notes<span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">td</span>&gt;</td>
      </tr>
      <tr>
        <td id="L77" class="blob-num js-line-number" data-line-number="77"></td>
        <td id="LC77" class="blob-code blob-code-inner js-file-line">                        &lt;/<span class="pl-ent">tr</span>&gt;</td>
      </tr>
      <tr>
        <td id="L78" class="blob-num js-line-number" data-line-number="78"></td>
        <td id="LC78" class="blob-code blob-code-inner js-file-line">                    &lt;/<span class="pl-ent">table</span>&gt;</td>
      </tr>
      <tr>
        <td id="L79" class="blob-num js-line-number" data-line-number="79"></td>
        <td id="LC79" class="blob-code blob-code-inner js-file-line">                    &lt;/<span class="pl-ent">div</span>&gt;<span class="pl-c">&lt;!--closing mri-righttable --&gt;</span></td>
      </tr>
      <tr>
        <td id="L80" class="blob-num js-line-number" data-line-number="80"></td>
        <td id="LC80" class="blob-code blob-code-inner js-file-line">                    &lt;/<span class="pl-ent">div</span>&gt; <span class="pl-c">&lt;!--closing panel-body --&gt;</span></td>
      </tr>
      <tr>
        <td id="L81" class="blob-num js-line-number" data-line-number="81"></td>
        <td id="LC81" class="blob-code blob-code-inner js-file-line">        &lt;/<span class="pl-ent">div</span>&gt; <span class="pl-c">&lt;!--panel panel-default --&gt;</span></td>
      </tr>
      <tr>
        <td id="L82" class="blob-num js-line-number" data-line-number="82"></td>
        <td id="LC82" class="blob-code blob-code-inner js-file-line">    &lt;/<span class="pl-ent">div</span>&gt; <span class="pl-c">&lt;!--closing ib_frame div--&gt;</span></td>
      </tr>
      <tr>
        <td id="L83" class="blob-num js-line-number" data-line-number="83"></td>
        <td id="LC83" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1"><span class="pl-pse">{</span>/<span class="pl-k">section</span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L84" class="blob-num js-line-number" data-line-number="84"></td>
        <td id="LC84" class="blob-code blob-code-inner js-file-line">&lt;/<span class="pl-ent">div</span>&gt; <span class="pl-c">&lt;!-- closing panel-body div--&gt;</span></td>
      </tr>
      <tr>
        <td id="L85" class="blob-num js-line-number" data-line-number="85"></td>
        <td id="LC85" class="blob-code blob-code-inner js-file-line">&lt;/<span class="pl-ent">div</span>&gt;</td>
      </tr>
      <tr>
        <td id="L86" class="blob-num js-line-number" data-line-number="86"></td>
        <td id="LC86" class="blob-code blob-code-inner js-file-line">    <span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">else</span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L87" class="blob-num js-line-number" data-line-number="87"></td>
        <td id="LC87" class="blob-code blob-code-inner js-file-line">        &lt;<span class="pl-ent">h3</span>&gt;No data selected&lt;/<span class="pl-ent">h3</span>&gt;</td>
      </tr>
      <tr>
        <td id="L88" class="blob-num js-line-number" data-line-number="88"></td>
        <td id="LC88" class="blob-code blob-code-inner js-file-line">&lt;/<span class="pl-ent">div</span>&gt;</td>
      </tr>
      <tr>
        <td id="L89" class="blob-num js-line-number" data-line-number="89"></td>
        <td id="LC89" class="blob-code blob-code-inner js-file-line"><span class="pl-s1"><span class="pl-pse">{</span>/<span class="pl-k">if</span><span class="pl-pse">}</span></span></td>
      </tr>
      <tr>
        <td id="L90" class="blob-num js-line-number" data-line-number="90"></td>
        <td id="LC90" class="blob-code blob-code-inner js-file-line"><span class="pl-s1"><span class="pl-pse">{</span><span class="pl-k">if</span> <span class="pl-smi">$<span class="pl-smi">has_permission</span></span><span class="pl-pse">}</span></span>&lt;/<span class="pl-ent">form</span>&gt;<span class="pl-s1"><span class="pl-pse">{</span>/<span class="pl-k">if</span><span class="pl-pse">}</span></span> </td>
      </tr>
</table>

  </div>

</div>

<button type="button" data-facebox="#jump-to-line" data-facebox-class="linejump" data-hotkey="l" class="hidden">Jump to Line</button>
<div id="jump-to-line" style="display:none">
  <!-- </textarea> --><!-- '"` --><form accept-charset="UTF-8" action="" class="js-jump-to-line-form" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
    <input class="form-control linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" aria-label="Jump to line" autofocus>
    <button type="submit" class="btn">Go</button>
</form></div>

  </div>
  <div class="modal-backdrop js-touch-events"></div>
</div>


    </div>
  </div>

    </div>

        <div class="container site-footer-container">
  <div class="site-footer" role="contentinfo">
    <ul class="site-footer-links right">
        <li><a href="https://github.com/contact" data-ga-click="Footer, go to contact, text:contact">Contact GitHub</a></li>
      <li><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
      <li><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
      <li><a href="https://shop.github.com" data-ga-click="Footer, go to shop, text:shop">Shop</a></li>
        <li><a href="https://github.com/blog" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
        <li><a href="https://github.com/about" data-ga-click="Footer, go to about, text:about">About</a></li>

    </ul>

    <a href="https://github.com" aria-label="Homepage" class="site-footer-mark" title="GitHub">
      <svg aria-hidden="true" class="octicon octicon-mark-github" height="24" version="1.1" viewBox="0 0 16 16" width="24"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
</a>
    <ul class="site-footer-links">
      <li>&copy; 2016 <span title="0.07097s from github-fe133-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="https://github.com/site/terms" data-ga-click="Footer, go to terms, text:terms">Terms</a></li>
        <li><a href="https://github.com/site/privacy" data-ga-click="Footer, go to privacy, text:privacy">Privacy</a></li>
        <li><a href="https://github.com/security" data-ga-click="Footer, go to security, text:security">Security</a></li>
        <li><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
        <li><a href="https://help.github.com" data-ga-click="Footer, go to help, text:help">Help</a></li>
    </ul>
  </div>
</div>



    

    <div id="ajax-error-message" class="ajax-error-message flash flash-error">
      <svg aria-hidden="true" class="octicon octicon-alert" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M8.865 1.52c-.18-.31-.51-.5-.87-.5s-.69.19-.87.5L.275 13.5c-.18.31-.18.69 0 1 .19.31.52.5.87.5h13.7c.36 0 .69-.19.86-.5.17-.31.18-.69.01-1L8.865 1.52zM8.995 13h-2v-2h2v2zm0-3h-2V6h2v4z"></path></svg>
      <button type="button" class="flash-close js-flash-close js-ajax-error-dismiss" aria-label="Dismiss error">
        <svg aria-hidden="true" class="octicon octicon-x" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>
      </button>
      You can't perform that action at this time.
    </div>


      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/compat-40e365359d1c4db1e36a55be458e60f2b7c24d58b5a00ae13398480e7ba768e0.js"></script>
      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/frameworks-efdb851061bb7933d0e409f8be67f6ae483a2fa8612b913ae2678aa4abf4569a.js"></script>
      <script async="async" crossorigin="anonymous" src="https://assets-cdn.github.com/assets/github-fa1ccb00d3f50cb35d9e0c4f04344327d0c184c13fb46070dfedab0fafd3950a.js"></script>
      
      
      
      
      
      
    <div class="js-stale-session-flash stale-session-flash flash flash-warn flash-banner hidden">
      <svg aria-hidden="true" class="octicon octicon-alert" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M8.865 1.52c-.18-.31-.51-.5-.87-.5s-.69.19-.87.5L.275 13.5c-.18.31-.18.69 0 1 .19.31.52.5.87.5h13.7c.36 0 .69-.19.86-.5.17-.31.18-.69.01-1L8.865 1.52zM8.995 13h-2v-2h2v2zm0-3h-2V6h2v4z"></path></svg>
      <span class="signed-in-tab-flash">You signed in with another tab or window. <a href="">Reload</a> to refresh your session.</span>
      <span class="signed-out-tab-flash">You signed out in another tab or window. <a href="">Reload</a> to refresh your session.</span>
    </div>
    <div class="facebox" id="facebox" style="display:none;">
  <div class="facebox-popup">
    <div class="facebox-content" role="dialog" aria-labelledby="facebox-header" aria-describedby="facebox-description">
    </div>
    <button type="button" class="facebox-close js-facebox-close" aria-label="Close modal">
      <svg aria-hidden="true" class="octicon octicon-x" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>
    </button>
  </div>
</div>

  </body>
</html>

