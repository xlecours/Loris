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
                var loadTab = function (event) {
                    event.preventDefault();
                    var url = loris.BaseURL + '/genomic_browser/';
                    var pscid_attribute = Object.keys(event.target).filter(function (key) {
                        return (/pscid/.test(key)
                        );
                    });
                    var form = document.createElement('form');
                    form.setAttribute('action', url);
                    form.setAttribute('method', "post");
                    form.setAttribute('target', "_self");

                    var values = {
                        'PSCID': row.PSCID,
                        'submenu': column,
                        'filter': 'Show data'
                    };

                    Object.keys(values).forEach(function (key) {
                        var i = document.createElement('input');
                        i.setAttribute('type', 'hidden');
                        i.setAttribute('name', key);
                        i.setAttribute('value', values[key]);
                        form.appendChild(i);
                    }, this);

                    document.getElementsByTagName('body')[0].appendChild(form);
                    form.submit();
                };
                reactElement = React.createElement(
                    'td',
                    { 'data-pscid': row.PSCID, onClick: loadTab },
                    cell
                );
                break;
        }
    }
    return reactElement;
}