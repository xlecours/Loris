class DatasetsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const datasets = this.props.datasets.map(function (value, key) {
      return (
        <DatasetSummary key={key} dataset={value}/>
      );
    });
    return (
      <div className="dataset-container panel">
        {datasets}
      </div>
    );
  }
}

class DatasetSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expended: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(event) {
    this.setState({
      expended: !(this.state.expended)
    });
  }

  render() {
    const identifier = this.props.dataset.Identifier;
    const label = identifier.variable_type + ' ' + identifier.format;
    let  panelBody;

    if (this.state.expended) {
      panelBody = (
        <div className="panel-body">
          <div className="row">
            <div className="form-group col-sm-4">
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading" onClick={this.toggle}>
          {label}
          <span className="glyphicon arrow glyphicon-chevron-up pull-right"></span>
        </div>
        {panelBody}
      </div>
    );
  }
}

export default DatasetsTab;
