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
    displayName: 'PhenotypesPanel',

    propTypes: {
        onQueryDocumentLoaded: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            availableQueries: []
        };
    },
    componentDidMount: function () {
        var that = this;
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=getSavedQueries.php", {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function (data) {
                that.setState({ availableQueries: data.rows });
            },
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ error: "Error loading data" });
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
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=GetDoc.php&DocID=" + id, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function (data) {
                that.props.onQueryDocumentLoaded(data);
            },
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    render: function () {
        var queries = this.state.availableQueries.map(function (q) {
            return React.createElement(
                'option',
                { value: q.id },
                q.doc.Meta.name
            );
        });
        var options = [React.createElement('option', { value: '' }), ...queries];
        return React.createElement(
            'select',
            { multi: 'true', onChange: this.onQuerySelected },
            options
        );
    }
});

GenomicDatasetsPanel = React.createClass({
    displayName: 'GenomicDatasetsPanel',

    propTypes: {
        onDatasetSelected: React.PropTypes.func.isRequired,
        pscids: React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return {
            availableDatasets: []
        };
    },
    componentDidMount: function () {
        var that = this;
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=getAvailableDatasets.php", {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function (data) {
                that.setState({ availableDatasets: data.rows });
            },
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    handleChange: function (event) {
        var selectedDataset = this.state.availableDatasets.filter(function (query) {
            return query.id == event.target.value;
        }, this);
        this.props.onDatasetSelected(selectedDataset);
    },
    render: function () {

        var intersection = function (a, b) {
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

        var options = [React.createElement('option', { value: '' }), ...datasets];
        return React.createElement(
            'select',
            { onChange: this.handleChange },
            options
        );
    }
});

GenomicRangePanel = React.createClass({
    displayName: 'GenomicRangePanel',

    propTypes: {
        onPreviewPressed: React.PropTypes.func.isRequired,
        onToDataproviderPressed: React.PropTypes.func.isRequired,
        ready: React.PropTypes.bool.isRequired
    },
    getDefaultProps: function () {
        return { ready: false };
    },
    handleSubmit: function (event) {
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
    render: function () {
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

QueryPreviewPannel = React.createClass({
    displayName: 'QueryPreviewPannel',

    render: function () {
        return React.createElement('textarea', { disable: true, value: this.props.data });
    }
});

DatasetMakerApp = React.createClass({
    displayName: 'DatasetMakerApp',

    getInitialState: function () {
        return {
            selectedPSCIDs: [],
            selectedDataset: {},
            queryPreview: " "
        };
    },
    onQueryDocumentLoaded: function (savedQueryDoc) {
        var that = this;
        fields = JSON.stringify(savedQueryDoc.Fields), conditions = JSON.stringify(savedQueryDoc.Conditions);
        $.ajax(loris.BaseURL + "/AjaxHelper.php?Module=dataset_maker&script=runQuery.php&fields=" + fields + "&conditions=" + conditions, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function (data) {
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
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    onDatasetSelected: function (dataset) {
        var dataset = dataset[0];
        this.setState({
            selectedDataset: dataset
        });
    },
    onPreviewPressed: function (event) {
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
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function (data) {
                that.setState({ queryPreview: data });
            },
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    onToDataproviderPressed: function (event) {
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
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                return xhr;
            },
            success: function (data) {
                that.setState({ saved: true });
            },
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    render: function () {
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

RDatasetMakerApp = React.createFactory(DatasetMakerApp);