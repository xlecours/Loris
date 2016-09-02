var VariableTab = React.createClass({
  propTypes: {
    filter: React.PropTypes.object.isRequired,
    variableType: React.PropTypes.string.isRequired
  },
  getDefaultProps: function () {
    return {setFilter: function() {return null}};
  },
  getInitialState: function () {
    return {
      filters: [],
      headers: null,
      data: null,
      isLoaded: false
    };
  },
  componentDidMount: function () {
    // get the filterTable field list
    console.log('VT.componentDidMount');
    this.getfiltersList();
  },
  componentWillReceiveProps: function (nextProps) {
    console.log('VT.componentWillReceiveProps');
    if (nextProps.hasOwnProperty('')) {
      consoe.log('todo... Change tab')
    }
  },
  getfiltersList: function() {
    var that = this;
    var xhttp = new XMLHttpRequest();

    // Get variable_type to create tab labels
    xhttp.onreadystatechange = function() {
      var newState = {};
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var response = JSON.parse(xhttp.responseText);
          newState['filters'] = response;
        } else {
          newState['error'] = true;
          newState['errorCode'] = xhttp.status;
          newState['errorText'] = 'Can\'t get variable types: '.concat(
            xhttp.statusText
          );
        }
      }
      that.setState(newState);
    };
    var url = loris.BaseURL.concat(
      '/genomic_browser/ajax/get_variable_properties.php?variable_type=',
      this.props.variableType
    );
    xhttp.open("GET", url, true);
    xhttp.send();
  },
  getFormatedCell: function(column, cell, row, headers) {
    return <td>{cell}</td>
  },
  setFilter: function(...params) {
    this.props.setFilter(params);
  },
  render: function() {
/*
      var filterElements = this.state.headers.map(function(header) {
        var filter = this.headerToFilter(header);
        var value;
        var options;

        options = this.getDistinctValues(header);
        if (this.state.filter.hasOwnProperty(filter)) {
          value = ''.concat(options.indexOf(this.state.filter[filter]));
        }

        return <div className="row">
                 <div className="col-md-12">
                   <SelectElement
                     name={filter}
                     options={options}
                     size="1"
                     label={header}
                     onUserInput={this.setFilter}
                     value={value}
                     ref={filter}
                   />
                 </div>
               </div>;
      }, this);

      filterTable = <FilterTable Module="Genomic Browser">
                      {filterElements}
                    </FilterTable>;
*/

    // Filter are only textbox for now.
    // 2 by row
    var filters = this.state.filters.map(function (filter) {
      var label = filter.charAt(0).toUpperCase() + filter.slice(1);
      label = label.replace(/_/g, ' ');
      var value = null;
      return <div className="col-md-6">
               <TextboxElement
                 name={filter}
                 label={label}
                 onUserInput={this.setFilter}
                 value={value}
                 ref={filter}
               />
             </div>
    },this);

    var url = loris.BaseURL + '/genomic_browser/ajax/get_variable_values.php?variable_type=' + this.props.variableType;

    return <div>
             <FilterTable>
               <ul>
                 {filters}
               </ul>
             </FilterTable>
             <DynamicDataTable 
               DataURL={url}
               getFormatedCell={this.formatCell}
             />
           </div>;
  }
});
