GenomicBrowserApp = React.createClass({
    getInitialState: function() {
        return {
            'activeTab': 'profile',
            'candidateList' : [],
            'datasets' : [],
            'genomicRanges' : []
        };
    },
    updateCandidateList: function (newList) {
        this.setState({candidateList: newList});
    },
    render: function() {
        var activeTab = {};
        var tabsNav = [];
        var message = <div />;

        switch (this.state.activeTab) {
            case 'profile':
                activeTab = <ProfileTab candidateList={this.state.candidateList}/>;
                break;
        }

        return <div className="row">
                    {message}
                    <div className="col-md-12">
                        <nav className="nav nav-tabs">
                            <ul className="nav nav-tabs navbar-left" data-tabs="tabs">
                                <li role="presentation" className="active"><a href="#profile" data-toggle="tab">Profile</a></li>
                                <li role="presentation"><a href="#snp" data-toggle="tab">SNP</a></li>
                            </ul>
                        </nav>
                        <div className="tab-content">
                            {activeTab}
                        </div>
                    </div>
                </div>;
    }
});
RGenomicBrowserApp = React.createFactory(GenomicBrowserApp);

ProfileTab = React.createClass({
    getInitialState: function() {
        return {
            'filters' : null,
            'headers' : null,
            'data' : null,
            'isLoaded' : false
        };
    },
    componentDidMount: function () {
        console.log(this.props.candidateList);
        this.loadCurrentTabContent();
    },
    loadCurrentTabContent : function() {
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                response = JSON.parse(xhttp.responseText);
                that.setState({data: response.Data, headers: response.Headers, isLoaded: true });
            }
            if (xhttp.readyState == 4 && xhttp.status == 500) {
                console.log(xhttp.responseText);
                that.setState({error: true });
            }
        };
        var url = loris.BaseURL.concat('/genomic_browser/?submenu=genomic_profile&format=json');
        xhttp.open("GET", url, true);
        xhttp.send();
    },
    formatCell: function (a,b,c,d) {
        return <td>{b}</td>;
    },
    render: function () {
        var dataTable;
        if (this.state.isLoaded) {
            dataTable = <StaticDataTable
                            Headers={this.state.headers}
                            Data={this.state.data}
                            getFormattedCell={this.formatCell}
                        />;
        } else {
            if (this.state.error) {
                dataTable = <div className="alert alert-danger">
                               <strong>
                                   Error
                               </strong>
                            </div>;
            } else {
                dataTable = <button className="btn-info has-spinner">
                                Loading
                                <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
                                </span>
                            </button>;
            }
        }
        return <div>
                   <div className='row'>
                       <FilterTable>
                           {this.state.filters}
                       </FilterTable>
                       <ActiveFilter>
                           {this.state.filters}
                       </ActiveFilter>
                   </div>
                   <div className='row'>
                       <div className='col-sm-12'>
                           {dataTable}
                       </div>
                   </div>
               </div>
    } 
});

ActiveFilter = React.createClass({
    render: function () {
        var filterTree = [];
        return <div className="col-sm-3">
                   <div className="panel panel-primary">
                       <div className="panel-heading" onClick={this.toggleCollapsed}>
                           Active Filter
                       </div>
                       <div className="panel-body">
                           {filterTree}
                       </div>
                   </div>
               </div>
    }
});
