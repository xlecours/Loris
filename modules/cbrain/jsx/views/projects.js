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

    const rows = this.state.data.map(function(p,i) {
      const project = (
        <Project setActivePage={this.props.setActivePage} data={p} key={i}/>
      );
      return project;
    }, this);

console.log(rows);

    return (
      <table><tbody>
        {rows}
      </tbody></table>
    );
  }
}

ProjectsPage.propTypes = {
  client: React.PropTypes.object.isRequired,
  setActivePage: React.PropTypes.func.isRequired
};

export default ProjectsPage;

