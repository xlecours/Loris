var ProfileTab = React.createClass({
  propTypes: {
    filter: React.PropTypes.object.isRequired
  },
  getDefaultProps: function() {
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
    console.log('PT.shouldComponentUpdate');
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
  componentWillReceiveProps: function(nextProps) {
    console.log('PT.componentWillReceiveProps');
    if (nextProps.hasOwnProperty('filter')) {
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
  headerToFilter: function(header) {
    return header.replace(/ /g, '_').toLowerCase();
  },
  getDistinctValues: function(header) {
    var values = [];
    var index = this.state.headers.indexOf(header);
    if (index !== -1) {
      Array.prototype.unique = function() {
        var array = [];
        for (var i = 0, l = this.length; i < l; i++) {
          if (array.indexOf(this[i]) === -1) {
            array.push(this[i]);
          }
        }
        return array;
      };

      values = this.state.data.map(function(value) {
        return value[index];
      }, this).unique().sort();
    }
    return values;
  },
  setFilter: function(field, index) {
    var value = this.refs[field].props.options[index];
    this.props.setFilter(field, value);
  },
  getFilterValue: function (filter) {
      return this.state.filter.hasOwnProperty(filter) ? this.state.filter[filter] : null;
  },
  render: function() {
    var dataTable;
    var filterTable;

    if (this.state.isLoaded) {

      dataTable = <StaticDataTable
                    Headers={this.state.headers}
                    Data={this.state.data}
                    Filter={this.props.filter}
                    getFormattedCell={this.formatColumn}
                  />;

      var separator = <div className="row">
                        <div className="col-md-12">
                          <hr/>
                          <h4>Dataset counts</h4>
                        </div>
                      </div>;

      datasetCounts = [];
      if (this.state.hasOwnProperty('variableTypes')) {
        datasetCounts = this.state.variableTypes.map(function(varType) {
          var filter = this.headerToFilter(varType);
          return <div className="col-md-4">
                   <SelectElement
                     name={filter}
                     label={varType}
                     options={this.getDistinctValues(varType)}
                     value={this.getFilterValue(filter)}
                     onUserInput={this.setFilter}
                     ref={filter}
                   />
                 </div>
        }, this);
      }
 
      filterTable = <FilterTable Module="Genomic Browser">
                      <div className="row">
                        <div className="col-md-2">
                          <h4>Participant filters</h4>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <SelectElement
                            name='site'
                            label='Site'
                            options={this.getDistinctValues('Site')}
                            value={this.getFilterValue('site')}
                            onUserInput={this.setFilter}
                            ref='site'
                          />
                        </div>
                        <div className="col-md-2">
                          <TextboxElement
                            name='pscid'
                            label='PSCID'
                            value={this.getFilterValue('pscid')}
                            onUserInput={this.setFilter}
                            ref='pscid'
                          />
                        </div>
                        <div className="col-md-2">
                          <SelectElement
                            name='sex'
                            label='Sex'
                            options={this.getDistinctValues('Sex')}
                            value={this.getFilterValue('sex')}
                            onUserInput={this.setFilter}
                            ref='sex'
                          />
                        </div>
                        <div className="col-md-2">
                          <NumericElement
                            name='file_count'
                            label='File Count'
                            min="0"
                            max={null}
                            value={this.getFilterValue('file_count')}
                            onUserInput={this.setFilter}
                            ref='file_count'
                          />
                        </div>
                        <div className="col-md-4">
                          <TextboxElement
                            name='sample_labels'
                            label='Sample Labels'
                            value={this.getFilterValue('sample_labels')}
                            onUserInput={this.setFilter}
                            ref='sample_labels'
                          />
                        </div>
                      </div>
                      {separator}
                      <div className="row">
                        {datasetCounts}
                      </div>
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
