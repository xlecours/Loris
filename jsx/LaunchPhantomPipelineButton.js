class LaunchPhantomPipelineButton extends React.Component {
  constructor(props) {
    super(props);

    this.launch = this.launch.bind(this);
  }

  launch() {
    const url = loris.BaseURL.concat(
      '/phantom_processing/processing_details/?sessionid=',
      this.props.sessionid
    );
  
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
      }
    })
    .then((res) => {
      window.location.assign(url);
    });
  }

  render() {
    return (
      <button onClick={this.launch}>Launch Phantom Pipeline</button>
    );
  }
}

LaunchPhantomPipelineButton.propTypes = {
  sessionId: React.PropTypes.number.isRequired
};

window.LaunchPhantomPipelineButton = LaunchPhantomPipelineButton;

export default LaunchPhantomPipelineButton;
