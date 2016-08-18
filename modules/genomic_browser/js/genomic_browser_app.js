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
  displayName: 'GenomicBrowserApp',

  mixins: [React.addons.PureRenderMixin],
  getInitialState: function () {
    return {
      activeTab: 'Profile',
      tabsNav: ['Profile', 'Dataset'],
      filter: {}
    };
  },
  componentDidMount: function () {
    var newState = {};
    var queryString = new QueryString();
    var queryStringObj = queryString.get();
    newState['filter'] = JSON.parse(JSON.stringify(queryStringObj));
    // Get variable_type to create tab labels
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var response = JSON.parse(xhttp.responseText);
          if (Array.isArray(response)) {
            var tabNames = response.map(function (row) {
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
    var url = loris.BaseURL.concat('/genomic_browser/ajax/get_variable_type.php');
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  changeTab: function (event) {
    this.setState({ activeTab: event.target.innerText });
  },
  setFilter: function (field, value) {
    console.log('GB.setFilter');
    var newFilter = this.state.filter;
    newFilter[field] = value;
    this.setState({ filter: newFilter });
  },
  render: function () {
    console.log('GB.render');
    var activeTab = {};
    var message = {};
    if (this.state.error) {
      message = React.createElement(
        'div',
        { className: 'col-md-12' },
        React.createElement(
          'div',
          { className: 'alert alert-warning' },
          '\'Error: \'.concat(this.state.errorText)'
        )
      );
    }

    switch (this.state.activeTab) {
      case 'Profile':
        activeTab = React.createElement(ProfileTab, { filter: this.state.filter, setFilter: this.setFilter });
        break;
      default:
        activeTab = React.createElement(VariableTab, { variableType: this.state.activeTab });
    }

    var tabs = this.state.tabsNav.map(function (tabName) {
      var className = tabName === this.state.activeTab ? 'active' : '';
      var tabLabel = tabName;
      return React.createElement(
        'li',
        { role: 'presentation', className: className, onClick: this.changeTab.bind(tabLabel) },
        React.createElement(
          'a',
          { href: '#'.concat(tabName), 'data-toggle': 'tab' },
          tabLabel
        )
      );
    }, this);
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
            tabs
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
var RGenomicBrowserApp = React.createFactory(GenomicBrowserApp);