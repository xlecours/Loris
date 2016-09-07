'use strict';

var _React$createClass;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ProfileTab = React.createClass((_React$createClass = {
  displayName: 'ProfileTab',

  propTypes: {
    filter: React.PropTypes.object.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      variableTypes: []
    };
  },
  getInitialState: function getInitialState() {
    return {
      filter: {},
      headers: null,
      data: null,
      isLoaded: false
    };
  },
  componentDidMount: function componentDidMount() {
    this.loadDatatableContent();
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextState, nextProps) {
    return nextProps.hasOwnProperty('filter');
  },
  loadDatatableContent: function loadDatatableContent() {
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
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    console.log('PT.componentWillReceiveProps');
    if (nextProps.hasOwnProperty('filter')) {
      this.setState({ filter: nextProps.filter });
    }
  }
}, _defineProperty(_React$createClass, 'shouldComponentUpdate', function shouldComponentUpdate(nextProps, nextState) {
  return true;
}), _defineProperty(_React$createClass, 'formatColumn', function formatColumn(column, value, dataRow, headers) {
  var cellContent = null;
  if (loris.hiddenHeaders.indexOf(column) === -1) {
    cellContent = React.createElement(
      'td',
      null,
      value
    );
  }
  return cellContent;
}), _defineProperty(_React$createClass, 'headerToFilter', function headerToFilter(header) {
  return header.replace(/ /g, '_').toLowerCase();
}), _defineProperty(_React$createClass, 'getDistinctValues', function getDistinctValues(header) {
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
}), _defineProperty(_React$createClass, 'setFilter', function setFilter(field, value) {
  if (this.refs[field].props.options) {
    var index = value;
    value = this.refs[field].props.options[index];
  }
  this.props.setFilter(field, value);
}), _defineProperty(_React$createClass, 'getFilterValue', function getFilterValue(filter) {
  return this.state.filter.hasOwnProperty(filter) ? this.state.filter[filter] : null;
}), _defineProperty(_React$createClass, 'render', function render() {
  var dataTable;
  var filterTable;

  if (this.state.isLoaded) {

    // Remove irrelevant filter keys
    var filter = {};
    Object.keys(this.props.filter).forEach(function (key) {
      if (this.state.filter[key]) {
        filter[key] = this.props.filter[key];
      }
    }, this);

    dataTable = React.createElement(StaticDataTable, {
      Headers: this.state.headers,
      Data: this.state.data,
      Filter: filter,
      getFormattedCell: this.formatColumn,
      ref: 'data_table'
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

    var datasetCounts = [];
    if (this.state.hasOwnProperty('variableTypes')) {
      datasetCounts = this.state.variableTypes.map(function (varType) {
        var variable_type = this.headerToFilter(varType);
        return React.createElement(
          'div',
          { className: 'col-md-4' },
          React.createElement(SelectElement, {
            name: filter,
            label: varType,
            options: this.getDistinctValues(varType),
            value: this.getFilterValue(variable_type),
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
            name: 'file_occurrence',
            label: 'File Occurrence',
            min: '0',
            max: null,
            value: this.getFilterValue('file_occurrence'),
            onUserInput: this.setFilter,
            ref: 'file_occurrence'
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
}), _React$createClass));