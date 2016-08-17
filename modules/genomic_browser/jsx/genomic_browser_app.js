/* exported RGenomicBrowserApp */
/* global QueryString  */

/**
 * Genomic browser page
 *
 * Renders the genomic browser profile and dataset tab plus a tab for each
 * variable_type of datasets in the variable_type_by_sample view in CouchDB.
 *
 * @author Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @version 1.0.0
 **/
var GenomicBrowserApp = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      activeTab: 'profile',
      tabsNav: ['profile', 'dataset'],
      filter: {}
    };
  },
  componentDidMount: function() {
    var newState = {};
    var queryString = new QueryString();
    var queryStringObj = queryString.get();
    newState['filter'] = JSON.parse(JSON.stringify(queryStringObj));
   // Get variable_type to create tab labels
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
            var response = JSON.parse(xhttp.responseText);
            if (Array.isArray(response)) {
              var tabNames = response.map(function(row) {
                return row.key[0];
              });
              newState['tabsNav'] = that.state.tabsNav.concat(tabNames);;
            }
        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(xhttp.statusText);
        }
      }
      that.setState(newState);
    };
    var url = loris.BaseURL.concat(
      '/genomic_browser/ajax/get_variable_type.php'
    );
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  render: function() {
    var activeTab = {};
    var message = {};
console.log(this.state);
    if (this.state.error) {
      message = <div className="col-md-12">
                  <div className="alert alert-warning">
                    'Error: '.concat(this.state.errorText)
                  </div>
                </div>;
    }

    switch (this.state.activeTab) {
      case 'profile':
        activeTab = <ProfileTab filter={this.state.filter}/>;
        break;
      default:
        activeTab = <VariableTab />;
    }

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
  propTypes: {
    filter: React.PropTypes.object.isRequired
  },
  getDefaultProps: function () {
    return {
      variableTypes: []
    };
  },
  getInitialState: function() {
    return {
      filter: {},
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
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var response = JSON.parse(xhttp.responseText);
          that.setState({
            data: response.Data,
            headers: response.Headers,
            isLoaded: true,
            error: false
          });
        } else {
          that.setState({
            error: true,
            errorCode: xhttp.status,
            errorText: xhttp.statusText
          });
        }
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
  componentWillReceiveProps: function (nextProps) {
    if(nextProps.hasOwnProperty('filter')) {
      this.setState({filter: nextProps.filter});
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },
  formatColumn: function(column, value, dataRow, headers) {
    var cellContent = null;
    if (loris.hiddenHeaders.indexOf(column) === -1) {
      cellContent = <td>{value}</td>;
    }
    return cellContent;
  },
  setFilter: function () {},
  render: function() {
    var dataTable;
    var filterTable;
    if (this.state.isLoaded) {
 
      dataTable = <StaticDataTable
                    Headers={this.state.headers}
                    Data={this.state.data}
                    getFormattedCell={this.formatColumn}
                  />;


      var filterElements = Object.keys(this.state.filter).map(function (filter) {

        return <div className="row">
                 <div className="col-md-12">
                   <TextboxElement
                     name={filter}
                     label="Bob"
                     onUserInput={this.setFilter}
                     value={this.state.filter[filter]}
                     ref={filter}
                   />  
                 </div>
               </div>;
      }, this);
      filterTable = <FilterTable>
                      {filterElements}
                    </FilterTable>;
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
               <div className="col-sm-12">
                 {filterTable}
               </div>
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
