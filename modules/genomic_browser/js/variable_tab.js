var VariableTab = React.createClass({
  displayName: "VariableTab",

  propTypes: {
    filter: React.PropTypes.object.isRequired,
    variableType: React.PropTypes.string.isRequired
  },
  getDefaultProps: function () {
    return { setFilter: function () {
        return null;
      } };
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
    // get the filterTable field list

  },
  render: function () {
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
    return React.createElement(
      "div",
      null,
      React.createElement(FilterTable, null),
      React.createElement(StaticDataTable, null)
    );
  }
});