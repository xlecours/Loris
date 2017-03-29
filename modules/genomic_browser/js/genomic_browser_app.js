'use strict';

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

  mixin: [React.addons.PureRenderMixin],
  getInitialState: function getInitialState() {
    return {
      activeTab: 'Dataset',
      tabsNav: ['Dataset', 'Profile'],
      filter: {}
    };
  },
  componentDidMount: function componentDidMount() {
    var newState = {};

    var that = this;
    var xhttp = new XMLHttpRequest();

    // Get variable_type to create tab labels
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {

          var response = JSON.parse(xhttp.responseText);
          if (Array.isArray(response)) {
            var variableTypes = response.map(function (row) {
              return row.key[0];
            });
            newState['tabsNav'] = that.state.tabsNav.concat(variableTypes);
            newState['variableTypes'] = variableTypes;
          }

          newState['filter'] = QueryString.get();
        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(xhttp.statusText);
        }
      }
      newState['queryString'] = QueryString;
      that.setState(newState);
    };
    var url = loris.BaseURL.concat('/genomic_browser/ajax/get_variable_type.php');
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  changeTab: function changeTab(event) {
    this.setState({ activeTab: event.target.innerText });
  },
  setFilter: function setFilter(fieldName, fieldValue) {
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
    this.setState({ filter: Filter });
  },
  clearFilter: function clearFilter() {
    var queryString = this.state.queryString;
    var formRefs = this.refs;

    // Clear query string
    queryString.clear(this.props.module);

    // Reset state of child components of FilterTable
    Object.keys(formRefs).map(function (ref) {
      if (formRefs[ref].state && formRefs[ref].state.value) {
        formRefs[ref].state.value = "";
      }
    });

    // Clear filter
    this.setState({ filter: {} });
  },
  render: function render() {
    var activeTab = {};
    var message;
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
      case 'Dataset':
        activeTab = React.createElement(DatasetTab, { filter: this.state.filter, setFilter: this.setFilter });
        break;
      default:
        activeTab = React.createElement(VariableTab, { module: this.props.module, filter: this.state.filter, setFilter: this.setFilter, variableType: this.state.activeTab });
    }

    var tabs = this.state.tabsNav.map(function (tabName) {
      var className = tabName === this.state.activeTab ? 'active' : '';
      var tabLabel = tabName;
      return React.createElement(
        'li',
        { role: 'presentation', className: className, onClick: this.changeTab },
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
