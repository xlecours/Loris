import StaticDataTable from 'StaticDataTable';
/**
 * Filters for phantom processing
 *
 * Provide the FilterForm for phantom processing menu filtering
 *
 * @author Xavier Lecours Boucher
 * @version 1.0.0
 *
 * */
class PhantomsDataTable extends React.Component {

  constructor(props) {
    super(props);

    this.formatCell = this.formatCell.bind(this);
  }

  formatCell(header, value, row, headers) {
    return (
      <td>{value}</td>
    );
  }

  render() {
    const data = this.props.data.Data.reduce(function(carry, item) {
      carry[item.visit_label] = [
        item.visit_label,
        item.insert_date,
        item.status,
        item.link
      ];
      return carry;
    }, {});

    const headers = ['Visit Label','Insert Date','Status','SPM Link'];

    return (
      <div>
        <StaticDataTable
          Data={Object.values(data)}
          Headers={headers}
          Filter={this.props.filter}
          getFormattedCell={this.formatCell}
        />
      </div>
    );
  }
}

export default PhantomsDataTable;

