'use strict';

var DatasetTab = React.createClass({
  displayName: 'DatasetTab',

  getDefaultProps: function getDefaultProps() {
    return {
      variableType: null,
      candidateList: []
    };
  },
  getInitialState: function getInitialState() {
    return {
      datasets: []
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
          newState['datasets'] = response;
        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(xhttp.statusText);
        }
      }
      newState['queryString'] = QueryString;
      that.setState(newState);
    };
    var url = loris.BaseURL.concat('/genomic_browser/ajax/get_datasets.php');
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  render: function render() {
    var datasets = this.state.datasets.map(function (d) {
      var name = ''.concat(d.value.loris_file_id, " : ", d.value.file_name.substr(d.value.file_name.lastIndexOf('/') + 1));
      return React.createElement(Dataset, { data: d.value });
    }, this);

    return React.createElement(
      'div',
      null,
      datasets
    );
  }
});

var Dataset = React.createClass({
  displayName: 'Dataset',

  getInitialState: function getInitialState() {
    return { 'collapsed': true };
  },
  toggleCollapsed: function toggleCollapsed() {
    this.setState({ 'collapsed': !this.state.collapsed });
  },
  render: function render() {
    var name = this.props.data.file_name;
    var targetName = '#'.concat(this.props.data._id);

    // Change arrow direction when closed
    var glyphClass = this.state.collapsed ? "glyphicon pull-right glyphicon-chevron-down" : "glyphicon pull-right glyphicon-chevron-up";

    var sample_list = [];
    console.log(this.props.data);
    var annotation_list = [];
    var infos = [];

    return React.createElement(
      'div',
      { className: 'panel panel-primary' },
      React.createElement(
        'div',
        { className: 'panel-heading',
          onClick: this.toggleCollapsed,
          'data-toggle': 'collapse',
          'data-target': targetName
        },
        name,
        React.createElement('span', { className: glyphClass })
      ),
      React.createElement(
        'div',
        { id: this.props.data._id, className: 'panel-collapse collapse', role: 'tabpanel' },
        React.createElement(
          'div',
          { className: 'panel-body' },
          React.createElement(
            'div',
            { className: 'col-md-12' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'panel panel-primary' },
                React.createElement(
                  'div',
                  { className: 'panel-heading',
                    onClick: this.toggleCollapsed,
                    'data-toggle': 'collapse',
                    'data-target': targetName + '_infos'
                  },
                  'Samples',
                  React.createElement('span', { className: 'glyphClass' })
                ),
                React.createElement(
                  'div',
                  { id: this.props.data._id + '_infos', className: 'panel-collapse collapse', role: 'tabpanel' },
                  React.createElement(
                    'div',
                    { className: 'panel-body' },
                    React.createElement(
                      'div',
                      { className: 'row' },
                      React.createElement(
                        'div',
                        { className: 'col-md-12' },
                        infos
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'panel panel-primary' },
                React.createElement(
                  'div',
                  { className: 'panel-heading',
                    onClick: this.toggleCollapsed,
                    'data-toggle': 'collapse',
                    'data-target': targetName + '_samples'
                  },
                  'Samples',
                  React.createElement('span', { className: 'glyphClass' })
                ),
                React.createElement(
                  'div',
                  { id: this.props.data._id + '_samples', className: 'panel-collapse collapse', role: 'tabpanel' },
                  React.createElement(
                    'div',
                    { className: 'panel-body' },
                    React.createElement(
                      'div',
                      { className: 'row' },
                      React.createElement(
                        'div',
                        { className: 'col-md-12' },
                        sample_list
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'panel panel-primary' },
                React.createElement(
                  'div',
                  { className: 'panel-heading',
                    onClick: this.toggleCollapsed,
                    'data-toggle': 'collapse',
                    'data-target': targetName + '_annotations'
                  },
                  'Annotations',
                  React.createElement('span', { className: 'glyphClass' })
                ),
                React.createElement(
                  'div',
                  { id: this.props.data._id + '_annotations', className: 'panel-collapse collapse', role: 'tabpanel' },
                  React.createElement(
                    'div',
                    { className: 'panel-body' },
                    React.createElement(
                      'div',
                      { className: 'row' },
                      React.createElement(
                        'div',
                        { className: 'col-md-12' },
                        annotation_list
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});
