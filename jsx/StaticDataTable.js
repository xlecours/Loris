/* exported RStaticDataTable */

/**
 * This file contains React component for Static Data Table
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Static Data Table component
 * Displays a set of data that is receives via props.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PaginationLinks from 'jsx/PaginationLinks';

class StaticDataTable extends React.Component
{
  constructor() {
    super();

    this.state = {
      PageNumber: 1,
      SortColumn: -1,
      SortOrder: 'ASC',
      RowsPerPage: 20
    };

    this.hasFilterKeyword  = this.hasFilterKeyword.bind(this);
    this.changePage        = this.changePage.bind(this); 
    this.setSortColumn     = this.setSortColumn.bind(this);
    this.changeRowsPerPage = this.changeRowsPerPage.bind(this);
    this.downloadCSV       = this.downloadCSV.bind(this);
    this.countFilteredRows = this.countFilteredRows.bind(this);
    this.toCamelCase       = this.toCamelCase.bind(this);
    this.getSortedRows     = this.getSortedRows.bind(this);
    this.hasFilterKeyword  = this.hasFilterKeyword.bind(this);
  }

  componentDidMount() {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $("#dynamictable").DynamicTable({
          freezeColumn: this.props.freezeColumn
        });
      } else {
        $("#dynamictable").DynamicTable();
      }
    }

        // Retrieve module preferences
    var modulePrefs = JSON.parse(localStorage.getItem('modulePrefs'));

        // Init modulePrefs object
    if (modulePrefs === null) {
      modulePrefs = {};
    }

        // Init modulePrefs for current module
    if (modulePrefs[loris.TestName] === undefined) {
      modulePrefs[loris.TestName] = {};
      modulePrefs[loris.TestName].rowsPerPage = this.state.RowsPerPage;
    }

        // Set rows per page
    var rowsPerPage = modulePrefs[loris.TestName].rowsPerPage;
    this.setState({
      RowsPerPage: rowsPerPage
    });

        // Make prefs accesible within component
    this.modulePrefs = modulePrefs;
  }
 
  componentDidUpdate(prevProps, prevState) {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $("#dynamictable").DynamicTable({
          freezeColumn: this.props.freezeColumn
        });
      } else {
        $("#dynamictable").DynamicTable();
      }
    }
    if (this.props.onSort &&
      (this.state.SortColumn !== prevState.SortColumn ||
      this.state.SortOrder !== prevState.SortOrder)
    ) {
      var index = this.getSortedRows();
      this.props.onSort(index, this.props.Data, this.props.Headers);
    }
  }
 
  changePage(pageNo) {
    this.setState({
      PageNumber: pageNo
    });
  }

  setSortColumn(colNumber) {
    var that = this;
    return function(e) {
      if (that.state.SortColumn === colNumber) {
        that.setState({
          SortOrder: that.state.SortOrder === 'ASC' ? 'DESC' : 'ASC'
        });
      } else {
        that.setState({
          SortColumn: colNumber
        });
      }
    };
  }
 
  changeRowsPerPage(val) {
    var rowsPerPage = val.target.value;
    var modulePrefs = this.modulePrefs;

        // Save current selection
    modulePrefs[loris.TestName].rowsPerPage = rowsPerPage;

        // Update localstorage
    localStorage.setItem('modulePrefs', JSON.stringify(modulePrefs));

    this.setState({
      RowsPerPage: rowsPerPage,
      PageNumber: 1
    });
  }

  downloadCSV(csvData) {
    var csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');

    csvworker.addEventListener('message', function(e) {
      var dataURL;
      var dataDate;
      var link;
      if (e.data.cmd === 'SaveCSV') {
        dataDate = new Date().toISOString();
        dataURL = window.URL.createObjectURL(e.data.message);
        link = document.createElement("a");
        link.download = "data-" + dataDate + ".csv";
        link.type = "text/csv";
        link.href = dataURL;
        document.body.appendChild(link);
        $(link)[0].click();
        document.body.removeChild(link);
      }
    });
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvData,
      headers: this.props.Headers,
      identifiers: this.props.RowNameMap
    });
  }

  countFilteredRows() {
    var filterMatchCount = 0;
    var filterValuesCount = (this.props.Filter ?
        Object.keys(this.props.Filter).length :
        0
    );
    var tableData = this.props.Data;
    var headersData = this.props.Headers;

    for (var i = 0; i < tableData.length; i++) {
      var headerCount = 0;

      for (var j = 0; j < headersData.length; j++) {
        var data = tableData[i] ? tableData[i][j] : null;
        if (this.hasFilterKeyword(headersData[j], data)) {
          headerCount++;
        }
      }

      if (headerCount === filterValuesCount) {
        filterMatchCount++;
      }
    }

    var hasFilters = (filterValuesCount !== 0);
    if (filterMatchCount === 0 && hasFilters) {
      return 0;
    }

    return (filterMatchCount === 0) ? tableData.length : filterMatchCount;
  }

  toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (Number(match) === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  getSortedRows() {
    const index = [];

    for (let i = 0; i < this.props.Data.length; i += 1) {
      let val = this.props.Data[i][this.state.SortColumn] || undefined;
      // If SortColumn is equal to default No. column, set value to be
      // index + 1
      if (this.state.SortColumn === -1) {
        val = i + 1;
      }
      const isString = (typeof val === 'string' || val instanceof String);
      const isNumber = !isNaN(val) && typeof val !== 'object';

      if (val === ".") {
        // hack to handle non-existent items in DQT
        val = null;
      } else if (isNumber) {
        // perform type conversion (from string to int/float)
        val = Number(val);
      } else if (isString) {
        // if string with text convert to lowercase
        val = val.toLowerCase();
      } else {
        val = undefined;
      }

      if (this.props.RowNameMap) {
        index.push({RowIdx: i, Value: val, Content: this.props.RowNameMap[i]});
      } else {
        index.push({RowIdx: i, Value: val, Content: i + 1});
      }
    }

    index.sort(function(a, b) {
      if (this.state.SortOrder === 'ASC') {
        if (a.Value === b.Value) {
          // If all values are equal, sort by rownum
          if (a.RowIdx < b.RowIdx) return -1;
          if (a.RowIdx > b.RowIdx) return 1;
        }
        // Check if null values
        if (a.Value === null || typeof a.Value === 'undefined') return -1;
        if (b.Value === null || typeof b.Value === 'undefined') return 1;

        // Sort by value
        if (a.Value < b.Value) return -1;
        if (a.Value > b.Value) return 1;
      } else {
        if (a.Value === b.Value) {
          // If all values are equal, sort by rownum
          if (a.RowIdx < b.RowIdx) return 1;
          if (a.RowIdx > b.RowIdx) return -1;
        }
        // Check if null values
        if (a.Value === null || typeof a.Value === 'undefined') return 1;
        if (b.Value === null || typeof b.Value === 'undefined') return -1;

        // Sort by value
        if (a.Value < b.Value) return 1;
        if (a.Value > b.Value) return -1;
      }
      // They're equal..
      return 0;
    }.bind(this));
    return index;
  }

  /**
   * Searches for the filter keyword in the column cell
   *
   * Note: Search is case-insensitive.
   *
   * @param {string} headerData column name
   * @param {string} data search string
   * @return {boolean} true, if filter value is found to be a substring
   * of one of the column values, false otherwise.
   */
  hasFilterKeyword(headerData, data) {
    let header = this.toCamelCase(headerData);
    let filterData = null;
    let exactMatch = false;

    if (this.props.Filter[header]) {
      filterData = this.props.Filter[header].value;
      exactMatch = this.props.Filter[header].exactMatch;
    }

    // Handle null inputs
    if (filterData === null || data === null) {
      return false;
    }

    // Handle numeric inputs
    if (typeof filterData === 'number') {
      var intData = Number.parseInt(data, 10);
      return filterData === intData;
    }

    // Handle string inputs
    if (typeof filterData === 'string') {
      var searchKey = filterData.toLowerCase();
      var searchString = data.toLowerCase();

      if (exactMatch) {
        return searchString === searchKey;
      }

      return (searchString.indexOf(searchKey) > -1);
    }

    return false;
  }

  render() {
    if (this.props.Data === null || this.props.Data.length === 0) {
      return (
        <div className="alert alert-info no-result-found-panel">
          <strong>No result found.</strong>
        </div>
      );
    }
    var rowsPerPage = this.state.RowsPerPage;
    var headers = [
      <th key="th_col_0" onClick={this.setSortColumn(-1)}>
        {this.props.RowNumLabel}
      </th>
    ];
    for (let i = 0; i < this.props.Headers.length; i += 1) {
      if (typeof loris.hiddenHeaders === "undefined" ||
        loris.hiddenHeaders.indexOf(this.props.Headers[i]) === -1) {
        var colIndex = i + 1;
        if (this.props.Headers[i] === this.props.freezeColumn) {
          headers.push(
            <th key={"th_col_" + colIndex} id={this.props.freezeColumn}
                onClick={this.setSortColumn(i)}>
              {this.props.Headers[i]}
            </th>
          );
        } else {
          headers.push(
            <th key={"th_col_" + colIndex} onClick={this.setSortColumn(i)}>
              {this.props.Headers[i]}
            </th>
          );
        }
      }
    }
    var rows = [];
    var curRow = [];
    var index = this.getSortedRows();
    var matchesFound = 0; // Keeps track of how many rows where displayed so far across all pages
    var filteredRows = this.countFilteredRows();
    var currentPageRow = (rowsPerPage * (this.state.PageNumber - 1));
    var filteredData = [];

    // Push rows to data table
    for (let i = 0;
         (i < this.props.Data.length) && (rows.length < rowsPerPage);
         i++
    ) {
      curRow = [];

      // Counts filter matches
      var filterMatchCount = 0;

      // Itterates through headers to populate row columns
      // with corresponding data
      for (var j = 0; j < this.props.Headers.length; j += 1) {
        var data = "Unknown";

        // Set column data
        if (this.props.Data[index[i].RowIdx]) {
          data = this.props.Data[index[i].RowIdx][j];
        }

        if (this.hasFilterKeyword(this.props.Headers[j], data)) {
          filterMatchCount++;
          filteredData.push(this.props.Data[index[i].RowIdx]);
        }

        var key = 'td_col_' + j;

        // Get custom cell formatting if available
        if (this.props.getFormattedCell) {
          data = this.props.getFormattedCell(
            this.props.Headers[j],
            data,
            this.props.Data[index[i].RowIdx],
            this.props.Headers
          );
          if (data !== null) {
            // Note: Can't currently pass a key, need to update columnFormatter
            // to not return a <td> node. Using createFragment instead.
            curRow.push({data});
          }
        } else {
          curRow.push(<td key={key}>{data}</td>);
        }
      }

            // Only display a row if all filter values have been matched
      if (Object.keys(this.props.Filter).length === filterMatchCount) {
        matchesFound++;
        if (matchesFound > currentPageRow) {
          const rowIndex = index[i].Content;
          rows.push(
            <tr key={'tr_' + rowIndex} colSpan={headers.length}>
              <td>{rowIndex}</td>
{curRow.map((item,index) => (
        <React.Fragment key={index}>
          {item.data}
        </React.Fragment>
      ))}
            </tr>
          );
        }
      }
    }

    var RowsPerPageDropdown = (
      <select
        className="input-sm perPage"
        onChange={this.changeRowsPerPage}
        value={this.state.RowsPerPage}
      >
        <option>20</option>
        <option>50</option>
        <option>100</option>
        <option>1000</option>
        <option>5000</option>
        <option>10000</option>
      </select>
    );

    // Include only filtered data if filters were applied
    let csvData = this.props.Data;
    if (this.props.Filter && filteredData.length > 0) {
      csvData = filteredData;
    }

    return (
      <div className="panel panel-default">
        <div className="table-header panel-heading">
          <div className="row">
            <div className="col-xs-12">
              {rows.length} rows displayed of {filteredRows}.
              (Maximum rows per page: {RowsPerPageDropdown})
              <div className="pull-right">
                <PaginationLinks
                  Total={filteredRows}
                  onChangePage={this.changePage}
                  RowsPerPage={rowsPerPage}
                  Active={this.state.PageNumber}
                />
              </div>
            </div>
          </div>
        </div>

        <table className="table table-hover table-primary table-bordered"
               id="dynamictable"
        >
          <thead>
              <tr className="info">{headers}</tr>
          </thead>
          <tbody>
              {rows}
          </tbody>
        </table>

        <div className="panel-footer table-footer">
          <div className="row">
            <div className="col-xs-12">
              <div className="col-xs-12 footerText">
                  {rows.length} rows displayed of {filteredRows}.
                (Maximum rows per page: {RowsPerPageDropdown})
              </div>
              <div className="col-xs-6">
                  <button
                    className="btn btn-primary downloadCSV"
                    onClick={this.downloadCSV.bind(null, csvData)}
                  >
                    Download Table as CSV
                  </button>
              </div>
              <div className="pull-right">
                  <PaginationLinks
                    Total={filteredRows}
                    onChangePage={this.changePage}
                    RowsPerPage={rowsPerPage}
                    Active={this.state.PageNumber}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

StaticDataTable.propTypes = {
  Headers: PropTypes.array.isRequired,
  Data: PropTypes.array.isRequired,
  RowNumLabel: PropTypes.string,
    // Function of which returns a JSX element for a table cell, takes
    // parameters of the form: func(ColumnName, CellData, EntireRowData)
  getFormattedCell: PropTypes.func,
  onSort: PropTypes.func
};

StaticDataTable.defaultProps = {
  Headers: [],
  Data: {},
  RowNumLabel: 'No.',
  Filter: {}
}

export default StaticDataTable;
