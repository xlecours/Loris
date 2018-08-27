class Project extends React.Component {

  constructor(props) {
    super(props);
console.log('Project');
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setActivePage('project', {id: this.props.data.id});
  }

  render() {
    console.log('models/project.js');
    console.log(this.props);
    return (
      <tr>
        <td>project</td>
        <td>
          <span onClick={this.handleClick}>{this.props.data.id}</span>
        </td>
      </tr>
    );
  }
}

Project.propTypes = {
  setActivePage: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};

export default Project;

