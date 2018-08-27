import LoginPage from './views/login.js';
import ProjectPage from './views/project.js';
import ProjectsPage from './views/projects.js';

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
      activePage: 'login',
      activePageProps: {}
    };

    // Bind component instance to custom methods
    this.setApiToken = this.setApiToken.bind(this);
    this.setActivePage = this.setActivePage.bind(this);
  }

  setApiToken(token) {
    this.props.client.ApiClient
      .instance
      .authentications
      .BrainPortalSession
      .apiKey = token;

    this.setState({
      authenticated: true,
      activePage: 'projects'
    });
  }

  setActivePage(page, props) {
    this.setState({
      activePage: page,
      activePageProps: props
    });
  }

  render() {
    let page;
    switch(this.state.activePage) {
      case 'login':
        page = (
          <LoginPage
            client={this.props.client}
            setApiToken={this.setApiToken}
          />
        );
        break;
      case 'projects':
        page = (
          <ProjectsPage
            client={this.props.client}
            setActivePage={this.setActivePage}
          />
        );
        break;
      case 'project':
        page = (
          <ProjectPage
            client={this.props.client}
            setActivePage={this.setActivePage}
            {...this.state.activePageProps}
          />
        )
    }

    return (
      <div>
        {page}
      </div>
    );
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
  const cbrain = (
    <CBRAIN client={CbrainClient}/>
  );

  ReactDOM.render(cbrain, document.getElementById("lorisworkspace"));
};
