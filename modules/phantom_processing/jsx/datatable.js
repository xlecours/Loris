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
    this.bob = this.bob.bind(this);
  }

  formatCell(header, value, row, headers) {
    return (
      <td>{value}</td>
    );
  }

  bob(x) {
    console.log('bob');
  }

  render() {
    return (
      <div>
        <StaticDataTable
          Data={this.props.data}
          Headers={this.props.headers}
          Filter={this.props.filter}
          getFormattedCell={this.formatCell}
        />
      </div>
    );
  }
}

export default PhantomsDataTable;

