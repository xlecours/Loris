import LoginPage from './views/login.js';
/**
 * CBRAIN Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders CBRAIN main page 
 *
 * @author Xavier Lecours <xavier.lecoursboucher@mcgill.ca>
 * @version 0.0.1
 *
 * */
class CBRAIN extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
    };

    // Bind component instance to custom methods
    this.setApiToken = this.setApiToken.bind(this);
  }

  componentDidMount() {
  }

  setApiToken(token) {
    const defaultClient = this.props.client.ApiClient.instance;
    const BrainPortalSession = defaultClient.authentications['BrainPortalSession'];
    BrainPortalSession.apiKey = token;

    this.setState({
      authenticated: true,
    });
  }

  render() {
    if (!this.state.authenticated) {
      return (
        <div>
          <LoginPage client={this.props.client} setApiToken={this.setApiToken} />
        </div>
      );
    } else {
      return (
        <h1>Not Implemented</h1>
      ); 
    }
  }
}

CBRAIN.propTypes = {
  client: React.PropTypes.object.isRequired
};

/**
 * Render CBRAIN on page load
 */
window.onload = function() {
  const CbrainClient = require('cbrain_api');
  const cbrain  = (
    <CBRAIN client={CbrainClient}/>
  );

  ReactDOM.render(cbrain, document.getElementById("lorisworkspace"));
};
