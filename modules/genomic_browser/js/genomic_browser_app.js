GenomicBrowserApp = React.createClass({
    displayName: 'GenomicBrowserApp',

    getInitialState: function () {
        return {
            'activeTab': 'profile',
            'candidateList': [],
            'datasets': [],
            'genomicRanges': []
        };
    },
    updateCandidateList: function (newList) {
        this.setState({ candidateList: newList });
    },
    render: function () {
        var activeTab = {};
        var tabsNav = [];
        var message = React.createElement('div', null);

        switch (this.state.activeTab) {
            case 'profile':
                activeTab = React.createElement(ProfileTab, { candidateList: this.state.candidateList, formatColumn: this.props.profileColumnFormatter });
                break;
        }

        return React.createElement(
            'div',
            { className: 'row' },
            message,
            React.createElement(
                'div',
                { className: 'col-md-12' },
                React.createElement(
                    'nav',
                    { className: 'nav nav-tabs' },
                    React.createElement(
                        'ul',
                        { className: 'nav nav-tabs navbar-left', 'data-tabs': 'tabs' },
                        React.createElement(
                            'li',
                            { role: 'presentation', className: 'active' },
                            React.createElement(
                                'a',
                                { href: '#profile', 'data-toggle': 'tab' },
                                'Profile'
                            )
                        ),
                        React.createElement(
                            'li',
                            { role: 'presentation' },
                            React.createElement(
                                'a',
                                { href: '#snp', 'data-toggle': 'tab' },
                                'SNP'
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'tab-content' },
                    activeTab
                )
            )
        );
    }
});
RGenomicBrowserApp = React.createFactory(GenomicBrowserApp);

ProfileTab = React.createClass({
    displayName: 'ProfileTab',

    getInitialState: function () {
        return {
            'filters': null,
            'headers': null,
            'data': null,
            'isLoaded': false
        };
    },
    componentDidMount: function () {
        console.log(this.props.candidateList);
        this.loadCurrentTabContent();
    },
    loadCurrentTabContent: function () {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                response = JSON.parse(xhttp.responseText);
                that.setState({ data: response.Data, headers: response.Headers, isLoaded: true });
            }
            if (xhttp.readyState == 4 && xhttp.status == 500) {
                console.log(xhttp.responseText);
                that.setState({ error: true });
            }
        };
        var url = loris.BaseURL.concat('/genomic_browser/?submenu=genomic_profile&format=json');
        xhttp.open("GET", url, true);
        xhttp.send();
    },
    render: function () {
        var dataTable;
        if (this.state.isLoaded) {
            dataTable = React.createElement(StaticDataTable, {
                Headers: this.state.headers,
                Data: this.state.data,
                getFormattedCell: this.props.formatColumn
            });
        } else {
            if (this.state.error) {
                dataTable = React.createElement(
                    'div',
                    { className: 'alert alert-danger' },
                    React.createElement(
                        'strong',
                        null,
                        'Error'
                    )
                );
            } else {
                dataTable = React.createElement(
                    'button',
                    { className: 'btn-info has-spinner' },
                    'Loading',
                    React.createElement('span', { className: 'glyphicon glyphicon-refresh glyphicon-refresh-animate' })
                );
            }
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    FilterTable,
                    null,
                    this.state.filters
                ),
                React.createElement(
                    ActiveFilter,
                    null,
                    this.state.filters
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-sm-12' },
                    dataTable
                )
            )
        );
    }
});

ActiveFilter = React.createClass({
    displayName: 'ActiveFilter',

    render: function () {
        var filterTree = [];
        return React.createElement(
            'div',
            { className: 'col-sm-3' },
            React.createElement(
                'div',
                { className: 'panel panel-primary' },
                React.createElement(
                    'div',
                    { className: 'panel-heading', onClick: this.toggleCollapsed },
                    'Active Filter'
                ),
                React.createElement(
                    'div',
                    { className: 'panel-body' },
                    filterTree
                )
            )
        );
    }
});