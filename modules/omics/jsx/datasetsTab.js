class DatasetsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    }
  }

  render() {
    console.log(this.props.datasets);
    return (
      <pre>"Hello"</pre>
    );
  }
}

export default DatasetsTab;
