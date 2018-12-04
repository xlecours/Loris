import Loader from 'Loader';

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
      credentials: 'same-origin',
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

    if (this.state.data.isPhantom) {
      return (
        <div className="alert alert-warning" role="alert">
          This is not a phantom timepoint
        </div>
      );
    }
    return (
      <div className='col-md-12'>
        <MetaPanel data={this.state.data}/>
        <LocalStatusPanel data={this.state.data}/>
        <RunsPanel data={this.state.data}/>
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
