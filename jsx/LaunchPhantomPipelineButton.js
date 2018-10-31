class LaunchPhantomPipelineButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      launched: false
    };

    this.launch = this.launch.bind(this);
  }

  launch() {
    const xhr = new XMLHttpRequest();
    const url = loris.BaseURL.concat('/server_processes_manager/ajax/LaunchPhantomPipeline.php');
    const that = this;

    xhr.open('POST', url);

    xhr.onload = function() {
      if (xhr.status === 201) {
        that.setState({
          launched: true
        });
      } else {
        console.error('Something went wrong');
      }
    }; 

    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(
      {
        userfileId : Number(this.props.userfileId),
        sessionId : Number(this.props.sessionId)
      }
    ));
  }

  render() {
    const buttonid = ''.concat(this.props.userfileId);
    return (
      <button {...this.props} disabled={this.state.launched} onClick={this.launch}>Launch</button>
    );
  }
}

LaunchPhantomPipelineButton.propTypes = {
  userfileId: React.PropTypes.number.isRequired,
  sessionId: React.PropTypes.number.isRequired
};

window.RLaunchPhantomPipelineButton = React.createFactory(LaunchPhantomPipelineButton);
window.LaunchPhantomPipelineButton = LaunchPhantomPipelineButton;

export default LaunchPhantomPipelineButton;

