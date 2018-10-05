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
    const data = this.props.data.Data.map(function(e,i) {
      return Object.keys(e).map(function(k) {return e[k];})
    });

    let filter = this.props.filter;
    console.log(Object.keys(filter).reduce(
      function(carry, item) {
        carry[item] = filter[item]; 
        return carry;
      },
      {}
    ));

    return (
      <div>
        <StaticDataTable
          Data={data}
          Headers={this.props.data.Headers}
          Filter={this.props.filter}
          getFormattedCell={this.formatCell}
        />
      </div>
    );
  }
}

export default PhantomsDataTable;

