//import StaticDataTable from 'StaticDataTable';
import FilterForm from 'FilterForm';

class DatasetsTab extends React.Component {
 
  constructor(props) {
    super(props);

    this.state = {
      filter: {}
    };

    this.formatCell      = this.formatCell.bind(this);
    this.getFormElements = this.getFormElements.bind(this);
    this.viewDetails     = this.viewDetails.bind(this);
    this.updateFilter    = this.updateFilter.bind(this);
    this.resetFilters    = this.resetFilters.bind(this);
  }

  formatCell(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    var row = {};
    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    }, this);

    let element;

    switch (column) {
      case 'Origin':
      case 'ShortDescription':
      case 'Timestamp Added':
        element = (
          <td>{cell}</td>
        );
        break;
      case 'Actions':
        element = (
          <td>
            <button onClick={this.viewDetails} data-fileset-id={row['Fileset Id']}>View</button>
          </td>
        );
        break;
    }
  }

  getFormElements() {
    return this.props.headers.filter(function(h) {
      return ['Actions','Couch Doc'].indexOf(h) < 0;
    }).map(function(h) {
      return {
        "label":h,
        "name":h,
        "class":"form-control input-sm",
        "type":"text"
      };
    });
  }

  viewDetails(event) {
    this.props.viewDetails(event);
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.refs.filterForm.clearFilter();
  }

  render() {
    let formElements = this.getFormElements();

    return (
      <div>
        <FilterForm
          Module="omics"
          ref="filterForm"
          columns={3}
          formElements={formElements}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        />
        <StaticDataTable 
          Headers={this.props.headers}
          Data={this.props.data}
          getFormattedCell={this.formatCell}
        />
      </div>
    );
  }
}

export default DatasetsTab;
