/* exported formatColumn */

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

   // Create the mapping between rowHeaders and rowData in a row object.
  var row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  if (column === 'New Data') {
    if (cell === 'new') {
      return <td className="newdata">NEW</td>;
    }
    return <td></td>;
  }

  if (column === 'Handedness') {
      return <td><a href={loris.BaseURL +
          "/handedness/instruments/?commentID=" +
          row.CommentID +
          "&sessionID=" +
          row.SessionID +
          "&candID=" +
          row.DCCID}>
      {row.Handedness}
      </a></td>;
  }

  if (column === 'Links') {
    var cellTypes = cell.split(",");
    var cellLinks = [];
    cellLinks.push(<a key="all" href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID +
        "&backURL=/imaging_browser/"}>
          all types
        </a>);
    return (<td>{cellLinks}</td>);
  }

  return <td>{cell}</td>;
}

window.formatColumn = formatColumn;

export default formatColumn;
