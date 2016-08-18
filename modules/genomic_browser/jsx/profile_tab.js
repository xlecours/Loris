var ProfileTab = React.createClass({
  propTypes: {
    filter: React.PropTypes.object.isRequired
  },  
  getDefaultProps: function () {
    return {
      variableTypes: []
    };  
  },  
  getInitialState: function() {
    return {
      filter: {}, 
      headers: null,
      data: null,
      isLoaded: false
    };  
  },  
  componentDidMount: function() {
    this.loadCurrentTabContent();
  },  
  shouldComponentUpdate: function(nextState, nextProps) {
console.log('PT.should');
    console.log(nextState);
    console.log(nextProps);
    return nextProps.hasOwnProperty('filter');
  },
  loadCurrentTabContent: function() {
    var that = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
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
        console.log(
          'ReadyState:'.concat(xhttp.readyState, ', Status:', xhttp.status)
        );  
      }   
    };  
    var url = loris.BaseURL.concat(
      '/genomic_browser/?submenu=genomic_profile&format=json'
    );  
    xhttp.open("GET", url, true);
    xhttp.send();
  },  
  componentWillReceiveProps: function (nextProps) {
    if(nextProps.hasOwnProperty('filter')) {
      this.setState({filter: nextProps.filter});
    }   
  },  
  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },  
  formatColumn: function(column, value, dataRow, headers) {
    var cellContent = null;
    if (loris.hiddenHeaders.indexOf(column) === -1) {
      cellContent = <td>{value}</td>;
    }
    return cellContent;
  },
  headerToFilter: function (header) {
    return header.replace(' ', '_' ).toLowerCase();
  },
  getDistinctValues: function (header) {
    var values = [];
    var index = this.state.headers.indexOf(header);
    if (index !== -1) {

      Array.prototype.unique = function() {
        var a = [];
        for (var i=0, l=this.length; i<l; i++) {
          if (a.indexOf(this[i]) === -1) {
            a.push(this[i]);
          }
        }
        return a;
      }

      values = this.state.data.map(function(value) {
        return value[index];
      },this).unique().sort();
    }
    return values;
  },
  setFilter: function (field, index) {
    var value = this.refs[field].props.options[index];
    this.props.setFilter(field, value);
    this.forceUpdate();
  },
  render: function() {
console.log('PT.render');
console.log(this.props.filter);
    var dataTable;
    var filterTable;
    if (this.state.isLoaded) {
      dataTable = <StaticDataTable
                    Headers={this.state.headers}
                    Data={this.state.data}
                    Filter={this.props.filter}
                    getFormattedCell={this.formatColumn}
                  />

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
                     size='1'
                     label={header}
                     onUserInput={this.setFilter}
                     value={value}
                     ref={filter}
                   />
                 </div>
               </div>;
      }, this);

      filterTable = <FilterTable Module='Genomic Browser'>
                      {filterElements}
                    </FilterTable>;
    } else if (this.state.error) {
      dataTable = <div className="alert alert-danger">
                    <strong>
                      Error
                    </strong>
                  </div>;
    } else {
      var style = "glyphicon glyphicon-refresh glyphicon-refresh-animate";
      dataTable = <button className="btn-info has-spinner">
                    Loading
                    <span className={style}></span>
                  </button>;
    }

    return <div>
             <div className="row">
               <div className="col-sm-12">
                 {filterTable}
               </div>
             </div>
             <div className="row">
               <div className="col-sm-12">
                 {dataTable}
               </div>
             </div>
           </div>;
  }
});
