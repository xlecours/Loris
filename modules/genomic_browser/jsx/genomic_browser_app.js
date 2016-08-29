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
      activeTab: 'Profile',
      tabsNav: ['Profile', 'Dataset'],
      filter: {}
    };
  },
  componentDidMount: function() {
    var that = this;
    var xhttp = new XMLHttpRequest();

    // Get variable_type to create tab labels
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var newState = {};

          var response = JSON.parse(xhttp.responseText);
          if (Array.isArray(response)) {
            var variableTypes = response.map(function(row) {
              return row.key[0];
            });
            newState['tabsNav'] = that.state.tabsNav.concat(variableTypes);
            newState['variableTypes'] = variableTypes;
          }

          newState['filter'] = new QueryString().get();

        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(
            xhttp.statusText
          );
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
  changeTab: function(event) {
    this.setState({activeTab: event.target.innerText});
  },
  setFilter: function(field, value) {
    console.log('GB.setFilter');
    console.log(this.state.filter);
    var newFilter = this.state.filter;
    newFilter[field] = value;
    this.setState({filter: newFilter});
  },
  render: function() {
    console.log('GB.render');
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
      default:
        activeTab = <VariableTab variableType={this.state.activeTab}/>;
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

