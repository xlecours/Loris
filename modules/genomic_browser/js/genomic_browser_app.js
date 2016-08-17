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
      activeTab: 'profile',
      tabsNav: ['profile', 'dataset'],
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
  render: function () {
    var activeTab = {};
    var message = {};
    console.log(this.state);
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
      case 'profile':
        activeTab = React.createElement(ProfileTab, { filter: this.state.filter });
        break;
      default:
        activeTab = React.createElement(VariableTab, null);
    }

    var tabs = this.state.tabsNav.map(function (tabName) {
      var className = tabName === this.state.activeTab ? 'active' : '';
      var tabLabel = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      return React.createElement(
        'li',
        { role: 'presentation', className: className },
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

var ProfileTab = React.createClass({
  displayName: 'ProfileTab',

  propTypes: {
    filter: React.PropTypes.object.isRequired
  },
  getDefaultProps: function () {
    return {
      variableTypes: []
    };
  },
  getInitialState: function () {
    return {
      filter: {},
      headers: null,
      data: null,
      isLoaded: false
    };
  },
  componentDidMount: function () {
    this.loadCurrentTabContent();
  },
  loadCurrentTabContent: function () {
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
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
        console.log('ReadyState:'.concat(xhttp.readyState, ', Status:', xhttp.status));
      }
    };
    var url = loris.BaseURL.concat('/genomic_browser/?submenu=genomic_profile&format=json');
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.hasOwnProperty('filter')) {
      this.setState({ filter: nextProps.filter });
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return true;
  },
  formatColumn: function (column, value, dataRow, headers) {
    var cellContent = null;
    if (loris.hiddenHeaders.indexOf(column) === -1) {
      cellContent = React.createElement(
        'td',
        null,
        value
      );
    }
    return cellContent;
  },
  setFilter: function () {},
  render: function () {
    var dataTable;
    var filterTable;
    if (this.state.isLoaded) {

      dataTable = React.createElement(StaticDataTable, {
        Headers: this.state.headers,
        Data: this.state.data,
        getFormattedCell: this.formatColumn
      });

      var filterElements = Object.keys(this.state.filter).map(function (filter) {
        console.log(this.state.filter[filter]);

        return React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-md-12' },
            React.createElement(TextboxElement, {
              name: filter,
              label: 'Bob',
              onUserInput: this.setFilter,
              value: this.state.filter[filter],
              ref: filter
            })
          )
        );
      }, this);
      filterTable = React.createElement(
        FilterTable,
        null,
        filterElements
      );
    } else if (this.state.error) {
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
      var style = "glyphicon glyphicon-refresh glyphicon-refresh-animate";
      dataTable = React.createElement(
        'button',
        { className: 'btn-info has-spinner' },
        'Loading',
        React.createElement('span', { className: style })
      );
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-sm-12' },
          filterTable
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

var ActiveFilter = React.createClass({
  displayName: 'ActiveFilter',

  getInitialState: function () {
    return {
      filterTree: []
    };
  },
  render: function () {
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
          this.state.filterTree
        )
      )
    );
  }
});