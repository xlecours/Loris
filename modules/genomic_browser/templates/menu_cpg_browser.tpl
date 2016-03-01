{literal}
<script type="text/javascript">
    $(document).ready(function(){
        $("#cand").DynamicTable({ "freezeColumn" : "pscid" });
    });
</script>
{/literal}
<div class="row">
<div class="col-sm-12">
<div class="panel panel-primary">
    <div class="panel-heading" onclick="hideFilter(this)">
        Selection Filter 
        <span class="glyphicon arrow glyphicon-chevron-up pull-right"></span>
    </div>
    <div class="panel-body">
        <form method="post" action="{$baseurl}/genomic_browser/?submenu=cpg_browser">
            <div class="row">
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-5">
                        {$form.genomic_range.label}
                    </label>
                    <div class="col-sm-12 col-md-7">
                        {$form.genomic_range.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-2">
                        {$form.cpg.label}
                    </label>
                    <div class="col-sm-12 col-md-10">
                        {$form.cpg.html}
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.group_level.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.group_level.html}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-sm-4"></div>
                <div class="form-group col-sm-4"></div>
                <div class="form-group col-sm-4">
                    <label class="col-sm-12 col-md-4">
                        {$form.limit.label}
                    </label>
                    <div class="col-sm-12 col-md-8">
                        {$form.limit.html}
                    </div>
                </div>
            </div>
            <div id="buttons">
                <div class="col-sm-3 col-md-2 col-xs-12"></div>
                <div class="col-sm-4 col-md-3 col-xs-12">
                    <input type="submit" name="filter" value="Show Data" id="showdata" class="btn btn-sm btn-primary col-xs-12"/>
                </div>
                <div class="col-sm-4 col-md-3 col-xs-12">
                    <input type="button" name="reset" value="Clear Form" class="btn btn-sm btn-primary col-xs-12" onclick="location.href='{$baseurl}/genomic_browser/?submenu=cpg_browser&reset=true'" />
                </div>
            </div>
        </form>
    </div>
</div>
<div id="datatable"></div>
<script>
var filters = [].slice.call(document.getElementsByTagName('input'));
filters = filters.concat([].slice.call(document.getElementsByTagName('select')));

var params = filters.reduce(function(last,now,index,array) {
    if(now.name == 'filter' || now.name == 'reset') {
        return last;
    } else {
        return last + '&' + now.name + '=' + now.value;
    }
},'');
var table = RDynamicDataTable({
    "DataURL" : "{$baseurl}/genomic_browser/?submenu=cpg_browser&format=json" + params,
    "getFormattedCell" : formatColumn
});

React.render(table, document.getElementById("datatable"));
</script>
