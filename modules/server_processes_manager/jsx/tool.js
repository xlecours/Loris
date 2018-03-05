class Tool extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.descriptor.name}</div>
    );
  }
}

export default Tool;
