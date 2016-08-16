/* exported RGenomicBrowserApp */

/**
 * Genomic browser page
 *
 * Renders the genomic browser profile and dataset tab plus a tab for each
 * variable_type of datasets in the variable_type_by_sample view in CouchDB.
 *
 **/
var GenomicBrowserApp = React.createClass({
  getInitialState: function() {
    return {
      activeTab: 'profile',
      tabsNav: ['profile', 'dataset']
    };
  },
  componentDidMount: function() {
   // Get variable_type to create tab labels
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var response = JSON.parse(xhttp.responseText);
        if (Array.isArray(response)) {
          var tabNames = response.map(function(row) {
            return row.key[0];
          });
          var tabLabels = that.state.tabsNav.concat(tabNames);
          that.setState({tabsNav: tabLabels});
        }
      } else {
        console.log(
          'State:'.concat(xhttp.readyState, ', Status:', xhttp.status)
        );
      }
    };
    var url = loris.BaseURL.concat(
      '/genomic_browser/ajax/get_variable_type.php'
    );
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  render: function() {
    var activeTab = {};
    var message = <div />;

    switch (this.state.activeTab) {
      case 'profile':
        activeTab = <ProfileTab />;
        break;
      default:
        activeTab = <VariableTab />;
    }
    console.log(this.state.tabsNav);
    var tabs = this.state.tabsNav.map(function(tabName) {
      var className = tabName === this.state.activeTab ? 'active' : '';
      var tabLabel = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      return <li role="presentation" className={className}>
               <a href={'#'.concat(tabName)} data-toggle="tab">
                 {tabLabel}
               </a>
             </li>;
    }, this);

    return <div className="row">
             {message}
             <div className="col-md-12">
               <nav className="nav nav-tabs">
                 <ul className="nav nav-tabs navbar-left" data-tabs="tabs">
                   {tabs}
                 </ul>
               </nav>
               <div className="tab-content">
                 {activeTab}
               </div>
             </div>
           </div>;
  }
});
var RGenomicBrowserApp = React.createFactory(GenomicBrowserApp);

var ProfileTab = React.createClass({
  getInitialState: function() {
    return {
      filters: null,
      headers: null,
      data: null,
      isLoaded: false
    };
  },
  componentDidMount: function() {
    this.loadCurrentTabContent();
  },
  loadCurrentTabContent: function() {
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var response = JSON.parse(xhttp.responseText);
        that.setState({
          filters: response.Filters,
          data: response.Data,
          headers: response.Headers,
          isLoaded: true,
          error: false
        });
      } else {
        console.log(
          'ReadyState:'.concat(xhttp.readyState, ', Status:', xhttp.status)
        );
      }
    };
    var url = loris.BaseURL.concat(
      '/genomic_browser/?submenu=genomic_profile&format=json'
    );
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  formatColumn: function(column, value, dataRow, headers) {
    var cellContent = null;
    if (loris.hiddenHeaders.indexOf(column) === -1) {
      cellContent = <td>{value}</td>;
    }
    return cellContent;
  },
  render: function() {
    var dataTable;
    if (this.state.isLoaded) {
      dataTable = <StaticDataTable
                    Headers={this.state.headers}
                    Data={this.state.data}
                    getFormattedCell={this.formatColumn}
                  />;
    } else if (this.state.error) {
      dataTable = <div className="alert alert-danger">
                    <strong>
                      Error
                    </strong>
                  </div>;
    } else {
      var style = "glyphicon glyphicon-refresh glyphicon-refresh-animate";
      dataTable = <button className="btn-info has-spinner">
                    Loading
                    <span className={style}></span>
                  </button>;
    }

    return <div>
             <div className="row">
               <FilterTable>
                 {this.state.filters}
               </FilterTable>
               <ActiveFilter>
                 {this.state.filters}
               </ActiveFilter>
             </div>
             <div className="row">
               <div className="col-sm-12">
                 {dataTable}
               </div>
             </div>
           </div>;
  }
});

var ActiveFilter = React.createClass({
  getInitialState: function() {
    return {
      filterTree: []
    };
  },
  render: function() {
    return <div className="col-sm-3">
             <div className="panel panel-primary">
               <div className="panel-heading" onClick={this.toggleCollapsed}>
                 Active Filter
               </div>
               <div className="panel-body">
                 {this.state.filterTree}
               </div>
             </div>
           </div>;
  }
});
