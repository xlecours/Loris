class DatasetsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    }
  }

  render() {
    const datasets = this.props.datasets.map(function (key, value) {
      return (
        <h1 key={key}>BOB</h1>
      );
    });
    return (
      <div className="dataset-container">
        {datasets}
      </div>
    );
  }
}

export default DatasetsTab;
