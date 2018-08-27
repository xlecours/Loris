class ProjectPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      project: {},
      tasks: [],
      tools: [],
      userfiles: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const that = this;
    const projectIdGet = new Promise(function(resolve, reject) {
      const api = new that.props.client.GroupsApi();
      api.groupsIdGet(that.props.id, function (error, data, response) {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });

    const tasksGet = new Promise(function(resolve, reject) {
      const api = new that.props.client.TasksApi();
      api.tasksGet(function (error, data, response) {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });

    Promise.all([projectIdGet, tasksGet]).then(values => { 
      this.setState({
        project: values[0],
        tasks: values[1]
      });
    });
  }

  render() {
    return (
      <div>
        <h3<Project</h3>
        <span>{JSON.stringify(this.state.project)}</span>
        <h3>Tasks</h3>
        <span>{JSON.stringify(this.state.tasks)}</span>
      </div>
    );
  }
}

export default ProjectPage;
