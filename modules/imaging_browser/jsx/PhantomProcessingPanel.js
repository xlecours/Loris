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
    const url = loris.BaseURL.concat('/phantom_processing/processing_details/?sessionid=', this.props.sessionid);

    fetch(url, {headers: {'Accept': 'application/json'}})
      .then(res => res.json())
      .then((json) => {
        if (json.runs) {
          this.setState(json);
        }
      })
      .catch(error => console.log(error));
  }

  gotoTaskDetails() {
    let url = loris.BaseURL.concat(
      '/phantom_processing/processing_details/?sessionid=',
      this.props.sessionid
    );

    window.location.assign(url);
  }

  render() {
    if (!this.state.isPhantom) {
      return null;
    }

    let rows = this.state.runs.map(function(t,i){
      return (
        <Run key={i} data={t} goto={this.gotoTaskDetails}/>
      );
    }, this);

    if (rows.length == 0) {
      rows = (
        <tr>
          <td colSpan='6'>
            Not executed
          </td>
        </tr>
      );
    }

    return (
      <div className='col-xs-12'>
        <table className="table">
          <thead>
            <tr className='info'>
              <th>Link</th>
              <th>Exit text</th>
              <th>Start time</th>
              <th>End time</th>
              <th>Userid</th>
              <th>CBRAIN status</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        <div className='col-xs-12'>
          <LaunchPhantomPipelineButton sessionid={this.props.sessionid}/>
        </div>
      </div>
    );
  }
}

PhantomProcessingPanel.propTypes = {
  sessionid: React.PropTypes.string.isRequired
};

export default PhantomProcessingPanel;

class Run extends React.Component {
  render() {
    const cbraintask = JSON.parse(this.props.data.cbraintask);
    const cbrainstatus = cbraintask.status || cbraintask.error;
    return (
      <tr>
        <td><input type='button' onClick={this.props.goto} value='See details' className='btn'/></td>
        <td>{this.props.data.exit_text}</td>
        <td>{this.props.data.start_time}</td>
        <td>{this.props.data.end_time}</td>
        <td>{this.props.data.userid}</td>
        <td>{cbrainstatus}</td>
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

