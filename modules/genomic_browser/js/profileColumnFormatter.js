function profileFormatColumn(column, cell, rowData, rowHeaders) {
    if (-1 == loris.hiddenHeaders.indexOf(column)) {
        // If this column is not a hidden one

        // Create the mapping between rowHeaders and rowData in a row object.
        var row = {};
        rowHeaders.forEach(function (header, index) {
            row[header] = rowData[index];
        }, this);

        if (column === 'Sample Labels') {
            return React.createElement(
                'td',
                null,
                'BOB'
            );
        }

        return React.createElement(
            'td',
            null,
            cell
        );
    }
    return null;
}