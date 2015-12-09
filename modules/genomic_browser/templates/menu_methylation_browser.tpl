<div class="col-sm-12">
  <div class="row">
    <div id="tabs">
      <ul class="nav nav-tabs">
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser">CNV</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=snp_browser">SNP</a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=cpg_browser">CpG</a></li>
        <li class="statsTab active"><a class="statsTabLink" id="onLoad"><strong>CpG 2</strong></a></li>
        <li class="statsTab"><a class="statsTabLink" href="main.php?test_name=genomic_browser&submenu=visual_explorer">Visual Explorer</a></li>
      </ul>
      <br>
    </div>
  </div>
  <div class="row">
    <div class="tab-content">
      <div class="tab-pane active">
        <form method="post" action="main.php?test_name=genomic_browser&submenu=methylation_browser">
          <div class="col-sm-12">
<!--
            <div class="row">
              <div class="form-group col-sm-12">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilter();">
                    Probe Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-gene"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-gene"></span>
                  </div>
                  <div class="panel-body" id="panel-body-gene">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Probe_name.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Probe_name.html}
                        </div>
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Manufacturer_ID.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Manufacturer_ID.html}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
-->
            <div class="row">
              <div class="form-group col-sm-12">
                <div class="panel panel-primary">
                  <div class="panel-heading" onclick="hideFilter();">
                    Annotations Filters
                    <span class="glyphicon glyphicon-chevron-down pull-right" style="display:none" id="down-gene"></span>
                    <span class="glyphicon glyphicon-chevron-up pull-right" id="up-gene"></span>
                  </div>
                  <div class="panel-body" id="panel-body-gene">
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Chromosome.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Chromosome.html}
                        </div>
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Start_loc.label}
                        </label>
                        <div class="col-sm-12 col-md-4">
                          {$form.Start_loc.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
<!--
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Strand.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Strand.html}
                        </div>
-->
                        <label class="col-sm-12 col-md-2" data-toggle="tooltip" data-placement="top" title="">
                          {$form.End_loc.label}
                        </label>
                        <div class="col-sm-12 col-md-4">
                          {$form.End_loc.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="HUGO Gene Nomenclature Committee ID ex: PINK1">
                          {$form.Gene_name.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Gene_name.html}
                        </div>
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Gene_group.label}
                        </label>
                        <div class="col-sm-12 col-md-3">
                          {$form.Gene_group.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Regulatory_feature_name.label}
                        </label>
                        <div class="col-sm-12 col-md-5">
                          {$form.Regulatory_feature_name.html}
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-sm-12">
                        <label class="col-sm-12 col-md-3" data-toggle="tooltip" data-placement="top" title="">
                          {$form.Regulatory_feature_group.label}
                        </label>
                        <div class="col-sm-12 col-md-5">
                          {$form.Regulatory_feature_group.html}
                        </div>
                      </div>
                    </div>
                  </div>
                </div> <!-- end of `Genomic Range Filters` panel-primary -->
              </div>
              <div class="form-group col-sm-4">
<!--
                <div class="panel panel-primary">
                <div class="panel-body" id="panel-body-query">
                </div>
                </div>
-->
                <div class="panel panel-primary">
                <div class="panel-body" id="panel-body-submit">
                <div class="row">
                  <div class="form-group col-sm-12">
                    <label class="col-sm-4 col-md-3">
                      {$form.Show_results_options.label}
                    </label>
                    <div class="col-sm-8 col-md-8">
                      {$form.Show_results_options.html}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-sm-12">
                    <div class="col-sm-6 col-xs-12 col-md-6">
                      <input type="submit" name="filter" value="Show data" id="showdata" class="btn btn-sm btn-primary col-xs-12"/>
                    </div>
                    <div class="col-sm-6 col-xs-12 col-md-5">
                      <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='main.php?test_name=genomic_browser&reset=true'" />
                    </div>
                  </div>
                </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div> <!-- end row containing all filters-->
  <div class="row">
    <!-- title table with pagination -->
    <table border="0" valign="bottom" width="100%"><tr>
      <!-- title -->
      {if {$resultcount} != '' }
        <td class="controlpanelsection">Results found: <strong>{$resultcount}</strong> total</td>
        <a href="{$csvUrl}" download="{$csvFile}.csv">
            Download as CSV
        </a>
      {else}
        <td>No variants found. </td>
      {/if} 
      <!-- display pagination links -->
      {if {$resultcount} != '' && $resultcount > 25}  
        <td align="right" id="pageLinks"></td>
      {/if}
    </tr>
    </table>
<!-- start data table -->
    <table  class ="dynamictable table table-hover table-primary table-bordered" border="0" width="100%">
      <thead>
        <tr class="info">
          <th>No.</th>
          <!-- print out column headings - quick & dirty hack -->
          {section name=header loop=$headers}
            <th><a href="main.php?test_name=genomic_browser&submenu=methylation_browser&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}">{$headers[header].displayName}</a></th>
          {/section}
        </tr>
      </thead>
      <tbody>
        {section name=item loop=$items}
          <tr>
        <!-- print out data rows -->
          {section name=piece loop=$items[item]}
            {if $items[item][piece].bgcolor != ''}
              <td style="background-color:{$items[item][piece].bgcolor}">
            {else}
              <td>
            {/if}
            {if $items[item][piece].DCCID != "" AND $items[item][piece].name == "PSCID"}
              {assign var="PSCID" value=$items[item][piece].value}
              <a href="main.php?test_name=timepoint_list&candID={$items[item][piece].DCCID}">{$items[item][piece].value}</a>
            {else}
              {$items[item][piece].value}
            {/if }
            </td>
          {/section}
        </tr>
        {/section}
      </tbody>
      <!-- end data table -->
    </table>
  </div>
</div>
<br>
<script>
var pageLinks = RPaginationLinks(
{
    RowsPerPage : {$rowsPerPage},
    Total: {$TotalItems},
    onChangePage: function(pageNum) {
        location.href="{$baseurl}/main.php?test_name=genomic_browser&&submenu=methylation_browser&pageID=" + pageNum
    },
    Active: {$pageID}
});
React.render(pageLinks, document.getElementById("pageLinks"));
</script>
