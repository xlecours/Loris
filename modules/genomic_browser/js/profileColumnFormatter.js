function formatColumn(column, cell, rowData, rowHeaders) {
    reactElement = null;
    if (-1 == loris.hiddenHeaders.indexOf(column)) {
        var row = {};
        rowHeaders.forEach(function (header, index) {
            row[header] = rowData[index];
        }, this);
        switch (column) {
            case 'PSC':
            case 'Gender':
            case 'DoB':
            case 'ExternalID':
                reactElement = React.createElement(
                    'td',
                    null,
                    cell
                );
                break;
            case 'PSCID':
            case 'DCCID':
                var url = loris.BaseURL + "/" + row.DCCID + "/";
                reactElement = React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'a',
                        { href: url },
                        cell
                    )
                );
                break;
            case 'Subproject':
                var cohort = loris.subprojectList[cell];
                reactElement = React.createElement(
                    'td',
                    null,
                    cohort
                );
                break;
            case 'Files':
                var url = loris.BaseURL + "/genomic_browser/?submenu=genomic_file_uploader&CandID=" + row.DCCID;
                reactElement = React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'a',
                        { href: url },
                        cell
                    )
                );
                break;
            default:
                // Everything else is a genomic variable and should have a matching tab name.
                var url = loris.BaseURL + "/genomic_browser/?submenu=" + column + "&CandID=" + row.DCCID;
                reactElement = React.createElement(
                    'td',
                    null,
                    React.createElement(
                        'a',
                        { href: url },
                        cell
                    )
                );
                break;
        }
    }
    return reactElement;
}