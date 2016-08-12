GenomicBrowserApp = React.createClass({
    displayName: 'GenomicBrowserApp',

    getInitialState: function () {
        return {
            'activetab': 'profile',
            'headers': [],
            'data': {}
        };
    },
    componentDidMount: function () {
        this.loadCurrentTabContent();
    },
    loadCurrentTabContent: function () {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                that.setState({ data: JSON.parse(xhttp.responseText) });
            }
        };
        var url = loris.BaseURL.concat('/genomic_browser/ajax/get_', this.state.activetab, '_tab_content.php');
        xhttp.open("GET", url, true);
        xhttp.send();
    },
    formatCell: function (a, b, c, d) {
        return React.createElement(
            'td',
            null,
            b
        );
    },
    render: function () {
        var headers = ['PSCID', 'Site', 'Visit Label', 'Subproject', 'Sex', 'Date of Birth'];
        var data = [['0', '0', '0', '0', '0', '0'], ['0', '0', '0', '0', '0', '0']];
        return React.createElement(StaticDataTable
        //Headers={this.state.headers}
        , { Headers: headers
            //Data={this.state.data}
            , Data: data,
            getFormattedCell: this.formatCell
        });
    }
});
RGenomicBrowserApp = React.createFactory(GenomicBrowserApp);