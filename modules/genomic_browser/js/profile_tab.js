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