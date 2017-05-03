'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var PhenotypesPanel = React.createClass({
    displayName: 'PhenotypesPanel',

    propTypes: {
        onQueryDocumentLoaded: React.PropTypes.func.isRequired
    },
    getInitialState: function getInitialState() {
        return {
            availableQueries: []
        };
    },
    componentDidMount: function componentDidMount() {
        var that = this;
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=getSavedQueries.php", {
            dataType: 'json',
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function success(data) {
                that.setState({ availableQueries: data.rows });
            },
            error: function error(data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ error: "Error loading data" });
            }
        });
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return nextProps.id !== this.props.id || nextState.availableQueries != undefined;
    },
    onQuerySelected: function onQuerySelected(event) {
        event.preventDefault();
        var id = event.target.value;
        var that = this;
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=GetDoc.php&DocID=" + id, {
            dataType: 'json',
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function success(data) {
                that.props.onQueryDocumentLoaded(data);
            },
            error: function error(data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    render: function render() {
        var queries = this.state.availableQueries.map(function (q) {
            return React.createElement(
                'option',
                { value: q.id },
                q.doc.Meta.name
            );
        });
        var options = [React.createElement('option', { value: '' })].concat(_toConsumableArray(queries));
        return React.createElement(
            'select',
            { multi: 'true', onChange: this.onQuerySelected },
            options
        );
    }
});

var GenomicDatasetsPanel = React.createClass({
    displayName: 'GenomicDatasetsPanel',

    propTypes: {
        onDatasetSelected: React.PropTypes.func.isRequired,
        pscids: React.PropTypes.array.isRequired
    },
    getInitialState: function getInitialState() {
        return {
            availableDatasets: []
        };
    },
    componentDidMount: function componentDidMount() {
        var that = this;
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=getAvailableDatasets.php", {
            dataType: 'json',
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function success(data) {
                that.setState({ availableDatasets: data.rows });
            },
            error: function error(data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    handleChange: function handleChange(event) {
        var selectedDataset = this.state.availableDatasets.filter(function (query) {
            return query.id == event.target.value;
        }, this);
        this.props.onDatasetSelected(selectedDataset);
    },
    render: function render() {

        var intersection = function intersection(a, b) {
            if (a.length > b.length) {
                var t = a;
                a = b;
                b = t;
            }
            return a.filter(function (value) {
                return b.indexOf(value) != -1;
            });
        };

        var datasets = this.state.availableDatasets.map(function (dataset) {
            var intersect = intersection(this.props.pscids, dataset.value);
            var title = "Intersection : " + intersect.length + " samples";
            return React.createElement(
                'option',
                {
                    value: dataset.id,
                    'data-toggle': 'tooltip', title: title
                },
                dataset.key
            );
        }, this);

        var options = [React.createElement('option', { value: '' })].concat(_toConsumableArray(datasets));
        return React.createElement(
            'select',
            { onChange: this.handleChange },
            options
        );
    }
});

var GenomicRangePanel = React.createClass({
    displayName: 'GenomicRangePanel',

    propTypes: {
        onPreviewPressed: React.PropTypes.func.isRequired,
        onToDataproviderPressed: React.PropTypes.func.isRequired,
        ready: React.PropTypes.bool.isRequired
    },
    getDefaultProps: function getDefaultProps() {
        return { ready: false };
    },
    handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        switch (event.nativeEvent.explicitOriginalTarget.name) {
            case "preview":
                this.props.onPreviewPressed(event);
                break;
            case "save":
                this.props.onToDataproviderPressed(event);
                break;
        }
    },
    render: function render() {
        var disabled = this.props.ready ? '' : 'disabled';
        return React.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            React.createElement('input', { id: 'genomic_range', type: 'text', defaultValue: 'chr1:15865-1266504' }),
            React.createElement(
                'button',
                { name: 'preview', disabled: disabled },
                'Preview'
            ),
            React.createElement(
                'button',
                { name: 'save', disabled: disabled },
                'Save to data provider'
            )
        );
    }
});

var QueryPreviewPannel = React.createClass({
    displayName: 'QueryPreviewPannel',

    render: function render() {
        return React.createElement('textarea', { disable: true, value: this.props.data });
    }
});

var DatasetMakerApp = React.createClass({
    displayName: 'DatasetMakerApp',

    getInitialState: function getInitialState() {
        return {
            selectedPSCIDs: [],
            selectedDataset: {},
            queryPreview: " "
        };
    },
    onQueryDocumentLoaded: function onQueryDocumentLoaded(savedQueryDoc) {
        var that = this;
        fields = JSON.stringify(savedQueryDoc.Fields), conditions = JSON.stringify(savedQueryDoc.Conditions);
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=runQuery.php&fields=" + fields + "&conditions=" + conditions, {
            dataType: 'json',
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function success(data) {
                var pscidsFilters = {};
                if (Array.isArray(data.result)) {
                    data.result.forEach(function (row) {
                        if (row.filteredOut != undefined) {
                            pscidsFilters[row.value[0]] = row.filteredOut || pscidsFilters[row.value[0]] == 'out' ? 'out' : 'in';
                        }
                    }, this);
                }
                that.setState({ selectedPSCIDs: Object.keys(pscidsFilters).filter(function (key) {
                        return pscidsFilters[key] == 'in';
                    }) });
            },
            error: function error(data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    onDatasetSelected: function onDatasetSelected(dataset) {
        var dataset = dataset[0];
        this.setState({
            selectedDataset: dataset
        });
    },
    onPreviewPressed: function onPreviewPressed(event) {
        event.preventDefault();
        var pscidMapping = {};
        var genomic_range = event.target.getElementsByTagName('input')[0].value;
        var that = this;

        this.state.selectedPSCIDs.forEach(function (pscid) {
            pscidMapping[pscid] = this.state.selectedDataset.value.indexOf(pscid);
        }, this);
        console.log(pscidMapping);
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=previewDatasetQuery.php&dataset_id=" + that.state.selectedDataset.id + "&genomic_range=" + genomic_range + "&pscids=" + JSON.stringify(pscidMapping), {
            dataType: 'text',
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function success(data) {
                that.setState({ queryPreview: data });
            },
            error: function error(data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    onToDataproviderPressed: function onToDataproviderPressed(event) {
        event.preventDefault();
        var pscidMapping = {};
        var genomic_range = event.target.getElementsByTagName('input')[0].value;
        var that = this;

        this.state.selectedPSCIDs.forEach(function (pscid) {
            pscidMapping[pscid] = this.state.selectedDataset.value.indexOf(pscid);
        }, this);
        console.log(pscidMapping);
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=runDatasetQuery.php&dataset_id=" + that.state.selectedDataset.id + "&genomic_range=" + genomic_range + "&pscids=" + JSON.stringify(pscidMapping), {
            dataType: 'text',
            xhr: function xhr() {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function success(data) {
                that.setState({ saved: true });
            },
            error: function error(data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(PhenotypesPanel, { onQueryDocumentLoaded: this.onQueryDocumentLoaded }),
            React.createElement(GenomicDatasetsPanel, { pscids: this.state.selectedPSCIDs, onDatasetSelected: this.onDatasetSelected }),
            React.createElement(GenomicRangePanel, { onPreviewPressed: this.onPreviewPressed, onToDataproviderPressed: this.onToDataproviderPressed, ready: Object.keys(this.state.selectedDataset).length > 0 }),
            React.createElement(QueryPreviewPannel, { data: this.state.queryPreview })
        );
    }
});

var RDatasetMakerApp = React.createFactory(DatasetMakerApp);