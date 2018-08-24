class Project extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const page = (
      <ProjectPage
        id={this.props.data.id}
        name={this.props.data.name}
      />
    );
    this.props.setActivePage(page);
  }

  render() {
    return (
      <span onClick={this.handleClick}>{this.props.projectId}</span>
    );
  }
}

Project.propTypes = {
  setActivePage: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
