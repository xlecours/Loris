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
    const url = loris.BaseURL.concat('/phantom_processing?sessionid=', this.props.sessionid);

    fetch(url)
      .then(res => res.json())
      .then(json => this.setState(json))
      .catch(error => console.log(error))
/*
    this.setState({
      isPhantom: true,
      pipelineRuns: [
        {taskid: 603756, server:'AceLab-VH-2', status: 'Failed', run: 1, startts: '2018-11-14 16:55:37 EST', lastts: '2018-11-14 20:14:32 EST'},
        {taskid: 603780, server:'AceLab-VH-2', status: 'Completed', run: 1, startts: '2018-11-14 20:53:06 EST', lastts: '2018-11-15 00:11:54 EST'}
      ]
    });
*/
  }

  gotoTaskDetails(taskid) {
    window.location.assign(loris.BaseURL.concat(
      '/phantom_processing?sessionid=',
      this.props.sessionid,
      '#',
      taskid
    ));
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

    return (
      <div className='col-xs-12'>
      <table className="table">
        <thead>
          <tr className='info'>
            <th>server</th>
            <th>status</th>
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
    this.gotoTaskDetail = this.gotoTaskDetail.bind(this);
  }

  gotoTaskDetail() {
    this.props.goto(this.props.data.taskid);
  }

  render() {
    return (
      <tr onClick={this.gotoTaskDetail} data={this.props.data.taskid}>
        <td>{this.props.data.taskid}</td>
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

