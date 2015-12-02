<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=snp_browser">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=cpg_browser">CpG Methylation</a></li>
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
            <div id="file_div"></div>
              <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilterFiles();">
                  Dataset
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-file"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-file"></span>
                </div>
                <div class="panel-body" id="panel-body-file">
                  <div class="row">
                    <div class="form-group col-sm-12">
                      <h5>Infinium HumanMethylation450k</h5>
                      <label class="col-sm-12 col-md-12 col-lg-12" data-toggle="tooltip" title="Choose your chromosome">
                        Beta values file
                      </label>
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <input type="file" id="input_file_beta_values">
                        <output id="list"></output>
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
            <div id="filters-div">
              <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilterCoord();">
                  Coordinates selection
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div class="row">
                    <div class="form-group col-sm-12">
                      <h5>Homo sapiens, GRCh37/hg19</h5>
                      <label class="col-sm-12 col-md-1 col-lg-1" data-toggle="tooltip" title="Choose your chromosome">
                        Chromosome
                      </label>
                      <div class="col-sm-12 col-md-3 col-lg-3">
                        <select id="chr"></select> 
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        Start
                      </label>
                      <div class="col-sm-12 col-md-3 col-lg-3">
                        <input id="start"></input> 
                      </div>
                      <label class="col-sm-12 col-md-1 col-lg-1">
                        End
                      </label>
                      <div class="col-sm-12 col-md-3 col-lg-3">
                        <input id="end"></input> 
                      </div>
                    </div>
                    <div class="form-group col-sm-12">
                      <label class="col-sm-12 col-md-1 col-lg-1" data-toggle="tooltip" title="Choose your gene">
                        Gene
                      </label>
                      <div class="col-sm-12 col-md-3 col-lg-3">
                         <select id="gene"></select> 
                      </div>
                      <br>
                    </div>
                    <div class="form-group col-sm-12">
                      <div class="col-sm-2 col-xs-6 col-md-2">
                        <input type="button" id="update" value="Show data" class="btn btn-sm btn-primary col-xs-12"/>
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
            <div id="chart-div">
              <div class="panel panel-primary">
                <div class="panel-heading" onclick="hideFilterCoord();">
                  Chart
                  <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-coord"></span>
                  <span class="glyphicon glyphicon-chevron-up pull-right" id="up-coord"></span>
                </div>
                <div class="panel-body" id="panel-body-coord">
                  <div id="chart-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> <!-- end row containing all filters-->
</div>
<script src="js/d3.min.js" charset="utf-8"></script>
<script src="js/c3.min.js"></script>
<script src="GetJS.php?Module=genomic_browser&file=visual_explorer.js" charset="utf-8"></script>
<link rel="stylesheet" href="css/c3.css">
<link rel="stylesheet" href="GetCSS.php?Module=genomic_browser&file=visual_explorer.css">
