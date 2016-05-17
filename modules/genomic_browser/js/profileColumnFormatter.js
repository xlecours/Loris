Count = React.createClass({
    displayName: 'Count',

    propTypes: {
        variable_type: React.PropTypes.string.isRequired,
        CandID: React.PropTypes.string.isRequired
    },
    getDefaultProps: function () {
        return {};
    },
    getInitialState: function () {
        return {
            value: 'loading...',
            loaded: false
        };
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return !this.state.loaded || this.props.CandID != nextProps.CandID;
    },
    componentWillUpdate: function () {
        this.getCountValue();
    },
    getCountValue: function () {
        var that = this;
        $.ajax(loris.BaseURL + 'AjaxHelper.php?Module=genomic_browser&script=get_genomic_variable_count.php&CandID=' + this.props.CandID + "&variable_type=" + this.props.variable_type, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        'loadedData': evt.loaded
                    });
                });
                return xhr;
            },
            success: function (data) {
                that.setState({
                    'value': data[0][that.props.variable_type],
                    'loaded': true
                });
                that.props.dataUpdate(data[0][that.props.variable_type]);
            },
            error: function (data, error_code, error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error": "Error loading data" });
            }
        });
    },
    componentDidMount: function () {
        this.getCountValue();
    },
    render: function () {
        return React.createElement(
            'span',
            null,
            this.state.value
        );
    }
});

function formatColumn(column, cell, rowData, rowIndex) {
    var row = [];
    rowData.forEach(function (item, index) {
        row[tableRefs.state.Headers[index]] = item;
    });
    reactElement = null;
    if (-1 == loris.hiddenHeaders.indexOf(column)) {
        var params = [];
        switch (column) {
            case 'PSCID':
                var url = loris.BaseURL + "/" + row.DCCID + "/";
                reactElement = React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'a',
                        { href: url },
                        cell
                    )
                );
                break;
            case 'CNVs':
            case 'CPGs':
            case 'SNPs':
                if (cell == '-') {
                    updateValue = function (val) {
                        console.log(rowIndex);
                        tableRefs.state.Data[rowIndex][tableRefs.state.Headers.indexOf(column)] = val;
                    };
                    reactElement = React.createElement(
                        'td',
                        null,
                        React.createElement(Count, { variable_type: column, CandID: row.DCCID, dataUpdate: updateValue })
                    );
                    break;
                }
            default:
                reactElement = React.createElement(
                    'td',
                    null,
                    cell
                );
                break;
        }
    }
    return reactElement;
}