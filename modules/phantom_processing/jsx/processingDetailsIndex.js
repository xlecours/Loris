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
    const panels  = this.props.data.sort((a,b) => {
      // reverse chronological order
      return new Date(b.start_time) - new Date(a.start_time);
    }).map(function(run, index) {
      const cbraintask = JSON.parse(run.cbraintask);
      const title = run.exit_text
        .concat(' by ', run.userid, ' @ ', run.end_time);

      let color = null;
      let results = null;
      switch (cbraintask.status.trim()) {
        case 'Completed':
          results = (
            <ResultFileList cbraintaskid={cbraintask.id}/>
          );
          color = '#28a745'
          break;
        case 'Terminate':
          color = 'ffc107';
          break;
        default:
          color = '#6c757d';
      }

      const style = {
        backgroundColor: color,
        cursor: 'default'
      };

      let statusicon = (
        <button className='btn' style={style}>{cbraintask.status}</button>
      ); 

      return (
        <Panel id={cbraintask.id} title={title}>
          {statusicon}
          {results}
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
      .then((resp) => {
          if (resp.status == '204') {
            return {};
          }
          return resp.json();
      })
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
        <a className='list-group-item' href={url}><span className='glyphicon glyphicon-file'/> {f.filename}</a>
      );
    });

    const dirname = this.state.data.directory.concat('.tar.gz');
    return (
      <div className='col-md-12'>
      <div className='row'>
        <h4>Task results</h4>
        <p>{dirname}</p>
        <a href='#' className='btn btn-primary' onClick={this.fetchTargz}>Download all files</a>
      </div>
      <hr/>
      <div className='row'>
        <span className='text-muted border-top'>click indivual files to download</span>
        <div className='list-group list-group-flush'>
          {files}
        </div>
      </div>
      </div>
    );
  }
}
