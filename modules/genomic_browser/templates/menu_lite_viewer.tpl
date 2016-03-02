<link rel="stylesheet" href="css/c3.css">
<link rel="stylesheet" href="GetCSS.php?Module=genomic_browser&file=visual_explorer.css">
<link rel="stylesheet" href="GetCSS.php?Module=genomic_browser&file=lite_viewer.css">
<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser">Profile</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=cnv_browser">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=snp_browser">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=cpg_browser">CpG</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>Visual Explorer</strong></a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <div class="col-sm-12">
          <div class="row">
            <div id="filters-div">
              <div class="panel panel-primary">
                <div class="panel-heading panel-clickable" onclick="hideFilterCoord();">
                  Coordinates selection
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div class="row">
                    <div class="form-group col-sm-12">
                      <label class="col-sm-12 col-md-1 col-lg-1" data-toggle="tooltip" title="Choose your chromosome">
                        {$form.Chromosome.label}
                      </label>
                      <div class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Chromosome.html}
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Start_loc.label}
                      </label>
                      <div class="col-sm-12 col-md-2 col-lg-2">
                        {$form.Start_loc.html}
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        {$form.End_loc.label}
                      </label>
                      <div class="col-sm-12 col-md-2 col-lg-2">
                        {$form.End_loc.html}
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Strand.label}
                      </label>
                      <div class="col-sm-12 col-md-1 col-lg-1">
                        {$form.Strand.html}
                      </div>
                    </div>
                    <div class="form-group col-sm-12">
                      <div class="col-sm-2 col-xs-6 col-md-2">
                        <input type="button" id="update" value="Show data" onclick="showData();" class="btn btn-sm btn-primary col-xs-12"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12">
          <div class="row">
            <div id="chart-div-2">
              <div class="panel panel-primary">
                <div class="panel-heading panel-clickable" onclick="hideFilterCoord();">
                  Chart
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div id="chart-placeholder-2" class="chart-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--
        <div class="col-sm-12">
          <div class="row">
            <div id="chart-div-1">
              <div class="panel panel-primary">
                <div class="panel-heading panel-clickable">
                  Chart
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div id="chart-placeholder-1" class="col-sm-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        -->
      </div>
    </div>
  </div> <!-- end row containing all filters-->
</div>
