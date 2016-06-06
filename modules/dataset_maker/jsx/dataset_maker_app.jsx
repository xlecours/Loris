/**
 *  ...
 *
 *  @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt @GPLv3
 *  @link     https://www.github.com/aces/Loris/
 */

/*
 *  ...
 */
PhenotypesPanel = React.createClass({
    propTypes: {
        onQueryDocumentLoaded : React.PropTypes.func.isRequired,
    },
    getInitialState: function () {
        return {
            availableQueries: [],
        };
    },
    componentDidMount: function () {
        var that = this;
        $.ajax(
            loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=getSavedQueries.php", {
            dataType: 'json',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function(data) {
                that.setState({ availableQueries: data.rows });
            },
            error: function(data,error_code,error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ error : "Error loading data" });
            }
        });
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return nextProps.id !== this.props.id || nextState.availableQueries != undefined;
    },
    onQuerySelected: function (event) {
        event.preventDefault();
        var id = event.target.value;
        var that = this;
        $.ajax(
            loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=GetDoc.php&DocID=" + id, {
            dataType: 'json',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function(data) {
                that.props.onQueryDocumentLoaded(data);
            },
            error: function(data,error_code,error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error" : "Error loading data" });
            }
        });
    },
    render: function () {
        var queries = this.state.availableQueries.map(function (q) {return <option value={q.id} >{q.doc.Meta.name}</option>;});
        var options = [<option value="" ></option>, ...queries];
        return (
            <select onChange={this.onQuerySelected}>
                {options}
            </select>
        );
    }
});

GenomicVariablesPanel = React.createClass({
    render: function() {
        var pscids = JSON.stringify(this.props.pscids);
        return (
            <div>
                {pscids}
            </div>
        );
    }
});

DatasetMakerApp = React.createClass({
    getInitialState: function () {
        return {
            selectedPSCIDs: []
        };
    },
    onQueryDocumentLoaded : function (savedQueryDoc) {
        var that = this
            fields = JSON.stringify(savedQueryDoc.Fields),
            conditions = JSON.stringify(savedQueryDoc.Conditions);
        $.ajax(
            loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=runQuery.php&fields=" + fields + "&conditions=" + conditions, {
            dataType: 'json',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function(data) {
                var pscidsFilters = {};
                if(Array.isArray(data.result)) {
                    data.result.forEach(function(row) {
                        console.log(row);
                        if(row.filteredOut != undefined) {
                            pscidsFilters[row.value[0]] = (row.filteredOut || pscidsFilters[row.value[0]] == 'out') ? 'out' : 'in';
                        }
                    }, this);
                }
                that.setState({selectedPSCIDs : Object.keys(pscidsFilters).filter(function(key){return pscidsFilters[key] == 'in'})});
            },
            error: function(data,error_code,error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error" : "Error loading data" });
            }
        }); 
    },
    render: function () {
        return (
            <div>
                <PhenotypesPanel onQueryDocumentLoaded={this.onQueryDocumentLoaded}/>
                <GenomicVariablesPanel pscids={this.state.selectedPSCIDs}/>
            </div>
        );
    }
});

RDatasetMakerApp = React.createFactory(DatasetMakerApp);
