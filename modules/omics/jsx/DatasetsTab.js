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
    return element;
  }

  getFormElements() {
    return this.props.headers.filter(function(h) {
      return ['Actions','Couch Doc'].indexOf(h) < 0;
    }).reduce(function(carry, current) {
      const name = current.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (Number(match) === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  
      carry[name] = {
        "label":current,
        "name": name,
        "class":"form-control input-sm",
        "type":"text"
      };
      return carry;
    },{});
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
          Filter={this.state.filter}
          getFormattedCell={this.formatCell}
        />
      </div>
    );
  }
}

export default DatasetsTab;
