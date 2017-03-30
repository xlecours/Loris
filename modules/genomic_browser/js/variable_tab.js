'use strict';

var VariableTab = React.createClass({
  displayName: 'VariableTab',

  propTypes: {
    filter: React.PropTypes.object.isRequired,
    variableType: React.PropTypes.string.isRequired,
    module: React.PropTypes.string.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      filters: [],
      headers: null,
      data: null,
      isLoaded: false,
      genomicRange: null
    };
  },
  componentDidMount: function componentDidMount() {
    // get the filterTable field list
    this.getfiltersList();
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevProps.variableType !== this.props.variableType) {
      this.getfiltersList();
    }
  },
  getfiltersList: function getfiltersList() {
    var queryString = QueryString;
    var queryStringObj = queryString.get();

    var that = this;
    var xhttp = new XMLHttpRequest();

    // Get variable_type to create tab labels
    xhttp.onreadystatechange = function () {
      var newState = {};

      var queryString = QueryString;

      newState['queryString'] = queryString;

      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var response = JSON.parse(xhttp.responseText);
          newState['filters'] = response;
        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(xhttp.statusText);
        }
      }
      that.setState(newState);
    };
    var url = loris.BaseURL.concat('/genomic_browser/ajax/get_variable_properties.php?variable_type=', this.props.variableType);
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  getFormatedCell: function getFormatedCell(column, cell, row, headers) {
    return React.createElement(
      'td',
      null,
      cell
    );
  },
  setFilter: function setFilter(formElement, value) {
    this.props.setFilter(formElement, value);
  },
  setGenomicRange: function setGenomicRange(formElement, value) {
    // To minimize the dataqueries, only call the function when a valid genomic range is typed
    // or if the field is blanked
    if (/^chr[0-9]{1,2}:[0-9]{1,10}[-][0-9]{1,10}$|^[0-9]{1,2}:[0-9]{1,10}[-][0-9]{1,10}$/.test(value)) {
      this.props.setFilter(formElement, value);
    }
    if (value.length === 0) {
      this.props.setFilter(formElement, null);
    }
  },
  render: function render() {
    var variable_name_value = null;
    var specialFilters = [];
    specialFilters.push(React.createElement(
      'div',
      { className: 'col-md-6' },
      React.createElement(TextboxElement, {
        name: 'variable_name',
        label: 'Variable name',
        onUserInput: this.setFilter,
        value: variable_name_value,
        ref: 'variable_name'
      })
    ));

    // Special case for Genomic Variable
    if (this.state.filters.indexOf('chromosome') >= 0 && this.state.filters.indexOf('start_loc') >= 0) {
      specialFilters.push(React.createElement(
        'div',
        { className: 'col-md-6' },
        React.createElement(TextboxElement, {
          name: 'genomic_range',
          label: 'Genomic range',
          onUserInput: this.setGenomicRange,
          value: this.state.genomicRange,
          ref: 'genomic_range'
        })
      ));
    }

    // Filter are only textbox for now.
    // 2 by row
    var filters = this.state.filters.map(function (filter) {
      if (filter !== 'variable_name') {
        var label = filter.charAt(0).toUpperCase() + filter.slice(1);
        label = label.replace(/_/g, ' ');
        var value = null;
        return React.createElement(
          'div',
          { className: 'col-md-6' },
          React.createElement(TextboxElement, {
            name: filter,
            label: label,
            onUserInput: this.setFilter,
            value: value,
            ref: filter
          })
        );
      }
    }, this);

    // Remove irrelevant filter keys
    var filter = {};
    Object.keys(this.props.filter).forEach(function (key) {
      if (this.state.filters.indexOf(key) >= 0) {
        filter[key] = this.props.filter[key];
      }
    }, this);
    var url = loris.BaseURL.concat('/genomic_browser/ajax/get_variable_values.php?variable_type=', this.props.variableType, '&genomic_range=', this.props.filter.genomic_range || '');

    return React.createElement(
      'div',
      null,
      React.createElement(
        FilterTable,
        { Module: this.props.module },
        React.createElement(
          'div',
          { className: 'row' },
          specialFilters
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'row' },
          filters
        )
      ),
      React.createElement(DynamicDataTable, {
        DataURL: url,
        Filter: filter,
        getFormatedCell: this.formatCell
      })
    );
  }
});
