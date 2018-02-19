class DatasetMetadata extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const headers = Object.keys(this.props.dataset).map(function(v, i) {
      if ( v = 'Couch Doc') {
        return null;
      }
      return (
        <th key={i}>{v}</th>
      );
    });

    const metadata = Object.values(this.props.dataset).map(function(v, i) {
      if ( v = 'Couch Doc') {
        return null;
      }
      return (
        <td key={i}>{v}</td>
      ); 
    });
    return (
      <div>
      <table>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          <tr>
            {metadata}
          </tr>
        </tbody>
      </table>
      </div>
    );
  }
}

export default DatasetMetadata;
