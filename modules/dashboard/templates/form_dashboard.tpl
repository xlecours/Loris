<link rel="stylesheet" href="{$baseurl}/css/c3.css">

<div class="row">
    <div class="col-lg-8">

        <!-- Welcome panel -->
        <div class="panel panel-default">
            <div class="panel-body">
                <h3 class="welcome">Welcome, {$username}.</h3>
                <p class="pull-right small login-time">Last login: {$last_login}</p>
                {if !is_null($project_description)}
                    <p class="project-description">{$project_description}</p>
                {/if}
            </div>
            <!-- Only add the welcome panel footer if there are links -->
            {if $dashboard_links neq ""}
                <div class="panel-footer">|
                    <a href="https://douglas.research.mcgill.ca/stop-ad-centre" target="">StoP-AD Centre</a>
                    |
                    <a href="https://prevent-alzheimer.net/" target="">PREVENT-AD</a>
                    |
                </div>
            {/if}
        </div>

        <!-- Recruitment -->
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Cohort Description</h3>
                <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                <div class="pull-right">
                    <div class="btn-group views">
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li class="active"><a data-target="overall-recruitment">View overall recruitment</a></li>
                            <li><a data-target="recruitment-site-breakdown">View site breakdown</a></li>
                            {if $useProjects eq "true"}
                                <li><a data-target="recruitment-project-breakdown">View project breakdown</a></li>
                            {/if}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div class="container">
                    <div class="row">
                        <div class="recruitment-panel col-xs-6 col-sm-6 col-md-6" id="overall-recruitment">
                            <div class="container-fluid">
                                <div class="row">
                                    <div>
                                        {include file='progress_bar.tpl' project=$recruitment["overall"]}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class=''>
                                        {include file='progress_bar_language.tpl' project=$recruitment["overallLanguage"]}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="recruitment-panel col-xs-6 col-sm-6 col-md-6">
                            <div class="container-fluid">
                                <div class="row">
                                    <div style="display: inline-block; width: 200px;">
                                        Pie Chart 1
                                    </div>
                                    <div style="display: inline-block; width: 200px;">
                                        Pie Chart 2
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {if $useProjects eq "true"}
                    <div class="recruitment-panel hidden" id="recruitment-project-breakdown">
                        {foreach from=$recruitment key=ID item=project}
                            {if $ID != "overall"}
                                {include file='progress_bar.tpl' project=$project}
                            {/if}
                        {/foreach}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Charts -->
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Cohort Progression</h3>
                <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                <div class="pull-right">
                    <div class="btn-group views">
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li class="active"><a data-target="scans-line-chart-panel">View scans per site</a></li>
                            <li><a data-target="recruitment-line-chart-panel">View recruitment per site</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel-body">
                <div id="scans-line-chart-panel">
                    <h5 class="chart-title">Scan sessions per site</h5>
                    {if $total_scans neq 0}
                        <div id="scanChart"></div>
                    {else}
                        <p>There have been no scans yet.</p>
                    {/if}
                </div>
                <div id="recruitment-line-chart-panel" class="hidden">
                    <h5 class="chart-title">Recruitment per site</h5>
                    {if $recruitment['overall']['total_recruitment'] neq 0}
                        <div id="recruitmentChart"></div>
                    {else}
                        <p>There have been no candidates registered yet.</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div class="col-lg-4">

        <!-- Document Repository -->
        {if $document_repository_notifications neq ""}
            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Document Repository Notifications</h3>
                        <span class="pull-right clickable glyphicon glyphicon-chevron-up"></span>
                    </div>
                    <!-- /.panel-heading -->
                    <div class="panel-body">
                        <div class="list-group document-repository-item">
                            {foreach from=$document_repository_notifications item=link}
                                <a href="AjaxHelper.php?Module=document_repository&script=GetFile.php&File={$link.Data_dir}"
                                   download="{$link.File_name}" class="list-group-item">
                                    {if $link.new eq 1}
                                        <span class="pull-left new-flag">NEW</span>
                                    {/if}
                                    <span class="pull-right text-muted small">Uploaded: {$link.Date_uploaded}</span>
                                    <br>
                                    {$link.File_name}
                                </a>
                            {/foreach}
                        </div>
                        <!-- /.list-group -->
                        <a href="{$baseURL}/document_repository/" class="btn btn-default btn-block">Document Repository
                            <span class="glyphicon glyphicon-chevron-right"></span></a>
                    </div>
                    <!-- /.panel-body -->
                </div>
            </div>
        {/if}

    </div>
</div>
