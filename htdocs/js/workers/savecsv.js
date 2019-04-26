/* global self: false, Blob: false */
self.addEventListener('message', function(e) {
  'use strict';
  let i = 0;
  let data = e.data.data; // $("#data").dataTable().fnGetData()
  let headers = e.data.headers; // $("#data thead th")
  let headersToRemove = ['HSID', 'SessionID', 'New Data', 'Links'];
  let indices = [];
  for (i = 0; i < headersToRemove.length; i += 1) {
      let index = headers.indexOf(headersToRemove[i]);
      if (index > -1) {
          indices.push(index);
      }
  }

  for (i = 0; i < indices.length; i += 1) {
      headers[indices[i]] = undefined;
  }
  headers = headers.filter(function (element) {
      return element !== undefined
  });
  
  let identifiers = e.data.identifiers;
  let content = ''; // new Blob(),
  let escapeQuote = function(val) {
    if (val && typeof val === 'string') {
      return val.replace(/"/g, '""');
    } else if (val && typeof val === 'object' && val.type === 'a') {
      return val.props.children;
    }
    return val;
  };
  // var fs;
  let contentBlob;

  let row = (identifiers) ? ['Identifiers'] : [];
  row = row.concat(headers);
  row = row.map(function(val) {
    if (val) {
      return val.replace('"', '""');
    }
    return val;
  });
  content += '"' + row.join('","') + '"\r\n';
  for (i = 0; i < data.length; i += 1) {
    row = (identifiers) ? [identifiers[i]] : [];
    row = row.concat(
      data[i].map(escapeQuote)
    );
    for (let j = 0; j < indices.length; j +=1) {
        row[indices[j]] = undefined;
    }
    row = row.filter(function (element) {
        return element !== undefined
    });
    content += '"' + row.join('","') + '"\r\n';
  }
  contentBlob = new Blob([content], {type: 'text/csv'});
  // fs = saveAs(contentBlob, "data.csv");
  // fs = new FileSaverSync(contentBlob, "data.csv");
  self.postMessage({cmd: 'SaveCSV', message: contentBlob});
});
