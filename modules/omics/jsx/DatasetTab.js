import FilterForm from 'FilterForm';

class DatasetTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="dataset-container panel">
        <div className="panel panel-primary">
          <div className="panel-heading" data-toggle="collapse" data-target="#dataset-fields" style={{cursor: "pointer"}}>
            Dataset 1
            <span className="glyphicon pull-right glyphicon-chevron-up"></span>
          </div> 
        </div>
        <div id="dataset-fields" className="panel-collapse collapse in" role="tabpanel">
          <h1>BOB</h1>
        </div>
      </div>
    );
  }
}

export default DatasetTab;
