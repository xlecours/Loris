import Loader from 'Loader';
import Panel from 'Panel';

class ProcessingDetailsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    // TODO :: To test this with Safari on IOS

    const sessionid = (new URL(window.location)).searchParams.get('sessionid');
    const url = loris.BaseURL.concat(
      '/phantom_processing/processing_details?sessionid=',
      sessionid
    );

    const params = {
      headers: {
        'Accept': 'application/json',
      }
    };

    return fetch(url,params)
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    if (!this.state.data.isPhantom) {
      return (
        <div className="alert alert-warning" role="alert">
          This is not a phantom timepoint
        </div>
      );
    }
    return (
      <div className='col-md-12'>
        <MetaPanel timepoint={this.state.data.timepoint}/>
        <RunsPanel data={this.state.data.runs}/>
      </div>
    );
  }
}

export default ProcessingDetailsIndex;

window.addEventListener('load', function() {
  ReactDOM.render(
    <ProcessingDetailsIndex />,
    document.getElementById('lorisworkspace')
  );
});

class MetaPanel extends React.Component {
  render() {
    const timepoint = this.props.timepoint;
    return (
      <div className='row'>
      <div className='col-xs-12'>
        <table className="table table-bordered">
          <thead>
            <tr className='info'>
              <th>Project</th>
              <th>Site</th>
              <th>Scanner</th>
              <th>Visit Label</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>{timepoint.PSC}</td>
              <td></td>
              <td>{timepoint.Visit_label}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}
MetaPanel.propTypes = {
  timepoint: React.PropTypes.object.isRequired,
};

class RunsPanel extends React.Component {
  render() {
    const panels  = this.props.data.map(function(run, index) {
        const cbraintask = JSON.parse(run.cbraintask);
        const title = run.exit_text
          .concat(' by ', run.userid, ' @ ', run.end_time);
        return (
          <Panel id={cbraintask.id} title={title}>
            <ResultFileList cbraintaskid={cbraintask.id}/>
          </Panel>
        );
    });
// add an anchor for each run
    return (
      <div className='row'>
        {panels}
      </div>
    );
  }
}

class ResultFileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchTargz = this.fetchTargz.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    const url = loris.BaseURL.concat(
      '/phantom_processing/processing_results?cbraintaskid=',
      this.props.cbraintaskid
    );

    const params = {
      headers: {
        'Accept': 'application/json',
      }
    };

    return fetch(url,params)
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  fetchTargz() {
    const url = loris.BaseURL.concat(
      '/phantom_processing/processing_results?cbraintaskid=',
      this.props.cbraintaskid
    );

    const params = {
      headers: {
        'Accept': 'application/x-gtar',
      }
    }; 

    return fetch(url, params)
      .then(res =>res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = "filename.tar.gz";
        document.body.appendChild(a);
        a.click(); 
        a.remove();
      });
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    if (this.state.data.error) {
      return (
        <div className ="alert alert-warning text-center">
          {this.state.data.error}
        </div>
      );
    }

    const getfileurl = loris.BaseURL.concat(
      '/phantom_processing/processing_results?cbraintaskid=',
      this.props.cbraintaskid
    );

    const files = this.state.data.files.map(function(f) {
      const url = getfileurl.concat(
        '&filename=',
        f.filename
      );
      return (
        <a className='list-group-item' href={url}>{f.filename}</a>
      );
    });

    const dirname = this.state.data.directory;
    const icon = (
      <span 
        className="glyphicon glyphicon-download"
        data-toggle="tooltip"
        title="Download all files"
        style={{cursor: 'pointer', color: '#064785'}}
        onClick={this.fetchTargz}
      />
    );
    return (
      <div className='col-md-12'>
      <div className='row'>
        <h4>Task results</h4>
        {dirname} {icon}
      </div>
      <div className='row'>
        <p className='text-muted'>click indivual files to download</p>
        <div className='list-group'>
          {files}
        </div>
      </div>
      </div>
    );
  }
}
