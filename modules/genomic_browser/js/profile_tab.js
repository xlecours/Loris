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
  shouldComponentUpdate: function (nextState, nextProps) {
    console.log('PT.shouldComponentUpdate');
    return nextProps.hasOwnProperty('filter');
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
            variableTypes: response.VariableType,
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
    console.log('PT.componentWillReceiveProps');
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
    return header.replace(/ /g, '_').toLowerCase();
  },
  getDistinctValues: function (header) {
    var values = [];
    var index = this.state.headers.indexOf(header);
    if (index !== -1) {
      Array.prototype.unique = function () {
        var array = [];
        for (var i = 0, l = this.length; i < l; i++) {
          if (array.indexOf(this[i]) === -1) {
            array.push(this[i]);
          }
        }
        return array;
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
  },
  getFilterValue: function (filter) {
    return this.state.filter.hasOwnProperty(filter) ? this.state.filter[filter] : null;
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

      var separator = React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-md-12' },
          React.createElement('hr', null),
          React.createElement(
            'h4',
            null,
            'Dataset counts'
          )
        )
      );

      datasetCounts = [];
      if (this.state.hasOwnProperty('variableTypes')) {
        datasetCounts = this.state.variableTypes.map(function (varType) {
          var filter = this.headerToFilter(varType);
          return React.createElement(
            'div',
            { className: 'col-md-4' },
            React.createElement(SelectElement, {
              name: filter,
              label: varType,
              options: this.getDistinctValues(varType),
              value: this.getFilterValue(filter),
              onUserInput: this.setFilter,
              ref: filter
            })
          );
        }, this);
      }

      filterTable = React.createElement(
        FilterTable,
        { Module: 'Genomic Browser' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-md-2' },
            React.createElement(
              'h4',
              null,
              'Participant filters'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-md-2' },
            React.createElement(SelectElement, {
              name: 'site',
              label: 'Site',
              options: this.getDistinctValues('Site'),
              value: this.getFilterValue('site'),
              onUserInput: this.setFilter,
              ref: 'site'
            })
          ),
          React.createElement(
            'div',
            { className: 'col-md-2' },
            React.createElement(TextboxElement, {
              name: 'pscid',
              label: 'PSCID',
              value: this.getFilterValue('pscid'),
              onUserInput: this.setFilter,
              ref: 'pscid'
            })
          ),
          React.createElement(
            'div',
            { className: 'col-md-2' },
            React.createElement(SelectElement, {
              name: 'sex',
              label: 'Sex',
              options: this.getDistinctValues('Sex'),
              value: this.getFilterValue('sex'),
              onUserInput: this.setFilter,
              ref: 'sex'
            })
          ),
          React.createElement(
            'div',
            { className: 'col-md-2' },
            React.createElement(NumericElement, {
              name: 'file_count',
              label: 'File Count',
              min: '0',
              max: null,
              value: this.getFilterValue('file_count'),
              onUserInput: this.setFilter,
              ref: 'file_count'
            })
          ),
          React.createElement(
            'div',
            { className: 'col-md-4' },
            React.createElement(TextboxElement, {
              name: 'sample_labels',
              label: 'Sample Labels',
              value: this.getFilterValue('sample_labels'),
              onUserInput: this.setFilter,
              ref: 'sample_labels'
            })
          )
        ),
        separator,
        React.createElement(
          'div',
          { className: 'row' },
          datasetCounts
        )
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