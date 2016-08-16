/* exported RGenomicBrowserApp */

/**
 * Genomic browser page
 *
 * Renders the genomic browser profile and dataset tab plus a tab for each
 * variable_type of datasets in the variable_type_by_sample view in CouchDB.
 *
 **/
var GenomicBrowserApp = React.createClass({
  displayName: 'GenomicBrowserApp',

  getInitialState: function () {
    return {
      activeTab: 'profile',
      tabsNav: ['profile', 'dataset']
    };
  },
  componentDidMount: function () {
    // Get variable_type to create tab labels
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var response = JSON.parse(xhttp.responseText);
        if (Array.isArray(response)) {
          var tabNames = response.map(function (row) {
            return row.key[0];
          });
          var tabLabels = that.state.tabsNav.concat(tabNames);
          that.setState({ tabsNav: tabLabels });
        }
      } else {
        console.log('State:'.concat(xhttp.readyState, ', Status:', xhttp.status));
      }
    };
    var url = loris.BaseURL.concat('/genomic_browser/ajax/get_variable_type.php');
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  render: function () {
    var activeTab = {};
    var message = React.createElement('div', null);

    switch (this.state.activeTab) {
      case 'profile':
        activeTab = React.createElement(ProfileTab, null);
        break;
      default:
        activeTab = React.createElement(VariableTab, null);
    }
    console.log(this.state.tabsNav);
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

  getInitialState: function () {
    return {
      filters: null,
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
        console.log('ReadyState:'.concat(xhttp.readyState, ', Status:', xhttp.status));
      }
    };
    var url = loris.BaseURL.concat('/genomic_browser/?submenu=genomic_profile&format=json');
    xhttp.open("GET", url, true);
    xhttp.send();
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
  render: function () {
    var dataTable;
    if (this.state.isLoaded) {
      dataTable = React.createElement(StaticDataTable, {
        Headers: this.state.headers,
        Data: this.state.data,
        getFormattedCell: this.formatColumn
      });
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