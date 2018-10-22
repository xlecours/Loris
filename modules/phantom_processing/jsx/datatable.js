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
    switch(header) {
      case 'Details':
        return (
          <td>
            <LaunchPhantomPipelineButton
              userfileId={value}
              sessionId={row[headers.indexOf('Session Id')]}
            />
          </td>
        );
        break;
      default:
        return (
          <td>{value}</td>
        );
    }
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

