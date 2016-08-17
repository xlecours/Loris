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
    console.log('change tab');
    console.log(event.target.innerText);
    this.setState({ activeTab: event.target.innerText });
  },
  setFilter: function (field, value) {
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
  headerToFilter: function (header) {
    return header.replace(' ', '_').toLowerCase();
  },
  getDistinctValues: function (header) {
    var values = [];
    var index = this.state.headers.indexOf(header);
    if (index !== -1) {

      Array.prototype.unique = function () {
        var a = [];
        for (var i = 0, l = this.length; i < l; i++) {
          if (a.indexOf(this[i]) === -1) {
            a.push(this[i]);
          }
        }
        return a;
      };

      values = this.state.data.map(function (value) {
        return value[index];
      }, this).unique().sort();
    }
    return values;
  },
  setFilter: function (field, index) {
    var value = this.refs[field].props.options[index];
    this.props.setFilter(field, value);
    this.forceUpdate();
  },
  render: function () {
    var dataTable;
    var filterTable;
    if (this.state.isLoaded) {
      dataTable = React.createElement(StaticDataTable, {
        Headers: this.state.headers,
        Data: this.state.data,
        Filter: this.props.filter,
        getFormattedCell: this.formatColumn
      });

      var filterElements = this.state.headers.map(function (header) {
        var filter = this.headerToFilter(header);
        var value;
        var options;

        options = this.getDistinctValues(header);
        if (this.state.filter.hasOwnProperty(filter)) {
          value = ''.concat(options.indexOf(this.state.filter[filter]));
        }

        return React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-md-12' },
            React.createElement(SelectElement, {
              name: filter,
              options: options,
              size: '1',
              label: header,
              onUserInput: this.setFilter,
              value: value,
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

var VariableTab = React.createClass({
  displayName: 'VariableTab',

  render: function () {
    return React.createElement(
      'div',
      null,
      this.props.variableType
    );
  }
});