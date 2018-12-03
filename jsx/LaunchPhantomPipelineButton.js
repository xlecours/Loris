import Loader from 'Loader';

class LaunchPhantomPipelineButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      endpoint: loris.BaseURL.concat('/phantom_processing/processing_details/'),
    };
    this.launch = this.launch.bind(this);
  }

  launch(event) {
    this.setState({clicked: true});

    const endpoint = this.state.endpoint.concat(
      '?sessionid=',
      this.props.sessionid
    );
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
      credentials: 'same-origin',
      referrer: "no-referrer",
      redirect: "follow",
    })
    .then((data) => {
      window.location.assign(endpoint);
    });
  }

  render() {
    if (this.state.clicked) {
      return (
        <Loader/>
      );
    }

    return (
      <input type='button' className='btn btn-primary' onClick={this.launch} value='Launch Phantom Pipeline' />
    );
  }
}

LaunchPhantomPipelineButton.propTypes = {
  sessionId: React.PropTypes.number.isRequired
};

window.LaunchPhantomPipelineButton = LaunchPhantomPipelineButton;

export default LaunchPhantomPipelineButton;
