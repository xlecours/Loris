
Count = React.createClass({
    propTypes: {
        variable_type: React.PropTypes.string.isRequired,
        CandID: React.PropTypes.string.isRequired
    },
    getInitialState: function () {
        return {
            value: 'loading...',
            loaded: false
        };
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },
    componentDidMount: function () {
        var that = this;
        $.ajax(loris.BaseURL + 'AjaxHelper.php?Module=genomic_browser&script=get_genomic_variable_count.php&CandID=' + this.props.CandID + "&variable_type=" + this.props.variable_type, {
            dataType: 'json',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function(evt) {
                    that.setState({
                        'loadedData' : evt.loaded
                    });
                });
                return xhr;
            },
            success: function(data) {
                that.setState({
                    'value' : data[0][that.props.variable_type],
                    'loaded' : true
                });
            },
            error: function(data,error_code,error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error" : "Error loading data" });
            }
        });
    },
    render: function () {
        console.log(this);
        return <span>{this.state.value}</span>;
    }
});

function formatColumn(column, cell, rowData) {
    var row = [];
    rowData.forEach(function(item, index) {
        row[tableRefs.state.Headers[index]] = item;
    });
    reactElement = null;
    if (-1 == loris.hiddenHeaders.indexOf(column)) {
        var params = [];
        switch (column) {
            case 'PSCID':
                var url = loris.BaseURL + "/" + row.DCCID + "/";
                reactElement = (
                    <td><a href={url}>{cell}</a></td>
                );
                break;
            case 'CNVs':
            case 'CPGs':
            case 'SNPs':
                updateValue = function(val) {
                    tableRefs.state.Data[rowIndex][tableRefs.state.Headers.indexOf(column)] = val;
                };
                reactElement = <td><Count variable_type={column} CandID={row.DCCID} dataUpdate={updateValue}/></td>;
                break;
            default:
                reactElement = <td>{cell}</td>;
            break;
        }
    }
    return reactElement;
}
