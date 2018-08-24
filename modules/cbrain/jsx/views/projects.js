import Project from '../models/project.js';
/**
 * CBRAIN Projects Page.
 *
 * Renders CBRAIN projects page
 *
 * @author Xavier Lecours <xavier.lecoursboucher@mcgill.ca>
 * @version 0.0.1
 *
 * */
class ProjectsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const api = new this.props.client.GroupsApi();
    api.groupsGet((function(error, data, response) {
      if (error) {
        console.error(error);
      } else {
        this.setState({
          loaded: true,
          data: data
        });
      }
    }).bind(this));
  }

  render() {
    if (!this.state.loaded) {
      return (
        <h3>Loading...</h3>
      );
    }
    
    const rows = this.state.data.map(p => (
      <tr>
        <td>{JSON.stringify(p)}</td>
        <td>
          <Project
            setActivePage={this.props.setActivePage}
            data={p} 
          />
        </td>
      </tr>
    ));

    return (
      <table>
        {rows}
      </table>
    );
  }
}

ProjectsPage.propTypes = {
  client: React.PropTypes.object.isRequired,
  setActivePage: React.PropTypes.func.isRequired
};

export default ProjectsPage;

