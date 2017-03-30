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
  mixin: [React.addons.PureRenderMixin],
  getInitialState: function() {
    return {
      activeTab: 'Dataset',
      tabsNav: ['Dataset','Profile'],
      filter: {}
    };
  },
  componentDidMount: function() {
    var newState = {};

    var that = this;
    var xhttp = new XMLHttpRequest();

    // Get variable_type to create tab labels
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {

          var response = JSON.parse(xhttp.responseText);
          if (Array.isArray(response)) {
            var variableTypes = response.map(function(row) {
              return row.key[0];
            });
            newState['tabsNav'] = that.state.tabsNav.concat(variableTypes);
            newState['variableTypes'] = variableTypes;
          }

          newState['filter'] = QueryString.get();

        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(
            xhttp.statusText
          );
        }
      }
      newState['queryString'] = QueryString;
      that.setState(newState);
    };
    var url = loris.BaseURL.concat(
      '/genomic_browser/ajax/get_variable_type.php'
    );
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  changeTab: function(event) {
    this.setState({activeTab: event.target.innerText});
  },
  setFilter: function(fieldName, fieldValue) {
    // Create deep copy of a current filter
    var Filter = JSON.parse(JSON.stringify(this.state.filter));
    var queryString = this.state.queryString;
    var formRefs = this.refs;

    // If fieldName is part of the form, add to querystring
    if (formRefs.hasOwnProperty(fieldName)) {
      queryString.set(Filter, fieldName, fieldValue);
    } else {
      queryString.clear(this.props.module);
    }   

    if (fieldValue === "") {
      delete Filter[fieldName];
    } else {
      Filter[fieldName] = fieldValue;
    }   
    this.setState({filter: Filter});
  },
  clearFilter: function() {
    var queryString = this.state.queryString;
    var formRefs = this.refs;

    // Clear query string
    queryString.clear(this.props.module);

    // Reset state of child components of FilterTable
    Object.keys(formRefs).map(function(ref) {
      if (formRefs[ref].state && formRefs[ref].state.value) {
        formRefs[ref].state.value = ""; 
      }   
    }); 

    // Clear filter
    this.setState({filter: {}});
  },
  render: function() {
    var activeTab = {};
    var message = {};
    if (this.state.error) {
      message = <div className="col-md-12">
                  <div className="alert alert-warning">
                    'Error: '.concat(this.state.errorText)
                  </div>
                </div>;
    }

    switch (this.state.activeTab) {
      case 'Profile':
        activeTab = <ProfileTab filter={this.state.filter} setFilter={this.setFilter}/>;
        break;
      case 'Dataset':
        activeTab = <DatasetTab filter={this.state.filter} setFilter={this.setFilter}/>;
        break;
      default:
        activeTab = <VariableTab module={this.props.module} filter={this.state.filter} setFilter={this.setFilter} variableType={this.state.activeTab}/>;
    }

    var tabs = this.state.tabsNav.map(function(tabName) {
      var className = tabName === this.state.activeTab ? 'active' : '';
      var tabLabel = tabName;
      return <li role="presentation" className={className} onClick={this.changeTab.bind(tabLabel)}>
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

