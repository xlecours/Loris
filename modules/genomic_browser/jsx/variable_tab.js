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
    console.log(nextProps);
// variableTyep to check
    if (nextProps.hasOwnProperty('')) {
consoe.log('YEAH!')
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
    var filters = this.state.filters.map(function (f) {return <li>{f}</li>},this);
    return <div>
             <FilterTable>
               <ul>
                 {filters}
               </ul>
             </FilterTable>
             <StaticDataTable />
           </div>;
  }
});
