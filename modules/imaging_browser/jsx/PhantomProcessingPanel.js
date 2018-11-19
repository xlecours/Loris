/**
 * This add a table containing summary details about phantom processing
 * on cbrain. It gets its data from the /phantom_processing endpoint.
 */
class PhantomProcessingPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPhantom: false
    };

    this.fetchData = this.fetchData.bind(this);
    this.gotoTaskDetails = this.gotoTaskDetails.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const url = loris.BaseURL.concat('/phantom_processing?sessionid=', this.props.sessionid, '&format=json');

    fetch(url)
      .then(res => res.json())
      .then(json => this.setState(json))
      .catch(error => console.log(error));
  }

  gotoTaskDetails(taskid) {
    let url = loris.BaseURL.concat(
      '/phantom_processing?sessionid=',
      this.props.sessionid
    );

    if (typeof taskid == 'number') {
      url = url.concat('#', taskid);
    }

    window.location.assign(url);
  }

  render() {
    if (!this.state.isPhantom) {
      return null;
    }

    let rows = this.state.pipelineRuns.map(function(t,i){
      return (
        <Run key={i} data={t} goto={this.gotoTaskDetails}/>
      );
    }, this);

    if (rows.length == 0) {
      rows = (
        <tr onClick={this.gotoTaskDetails}>
          <td colSpan='5'>Start new process</td>
        </tr>
      );
    }

    return (
      <div className='col-xs-12'>
      <table className="table">
        <thead>
          <tr className='info'>
            <th>Phantom processing task details</th>
            <th>Server</th>
            <th>Status</th>
            <th>Start</th>
            <th>Last update</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      </div>
    );
  }
}

PhantomProcessingPanel.propTypes = {
  sessionid: React.PropTypes.string.isRequired
};

export default PhantomProcessingPanel;

class Run extends React.Component {
  constructor(props) {
    super(props);
    this.gotoTaskDetails = this.gotoTaskDetails.bind(this);
  }

  gotoTaskDetails() {
    this.props.goto(this.props.data.taskid);
  }

  render() {
    return (
      <tr onClick={this.gotoTaskDetails} data={this.props.data.taskid}>
        <td>{this.props.data.taskid}</td>
        <td>{this.props.data.server}</td>
        <td>{this.props.data.status}</td>
        <td>{this.props.data.startts}</td>
        <td>{this.props.data.lastts}</td>
      </tr>
    )
  }
}

document.addEventListener('DOMContentLoaded', function() {
  let table = (
    <PhantomProcessingPanel sessionid='15' />
  );
  ReactDOM.render(table, document.getElementById('phantomsessiontable'));
});

