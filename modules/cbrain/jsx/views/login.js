/**
 * CBRAIN Login Page.
 *
 * Renders CBRAIN login page
 *
 * @author Xavier Lecours <xavier.lecoursboucher@mcgill.ca>
 * @version 0.0.1
 *
 * */
class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.sendLogin = this.sendLogin.bind(this);
  }

  sendLogin() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const api = new this.props.client.SessionsApi();

    api.sessionPost(login, password, '', (function(error, data, response) {
      if (error) {
        console.error(error);
      } else {
        this.props.setApiToken(response.body.cbrain_api_token);
      }
    }).bind(this));
  }

  render() {
    return (
      <div id="login-content">
        <label htmlFor="login">Login</label>
        <input type="text" name="login" id="login" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="button" name="commit" onClick={this.sendLogin} >
          Sign in
        </button>
      </div>
    );
  }
}

LoginPage.propTypes = {
  client: React.PropTypes.object.isRequired,
  setApiToken: React.PropTypes.func.isRequired
};

export default LoginPage;

