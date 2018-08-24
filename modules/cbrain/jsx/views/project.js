class ProjectPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <h1>{this.props.id}</h1>
      <h3>{this.props.name}</h3>
      </div>
    );
  }
}
