class BoutiqueToolEnvironmentVariablesItem extends React.Component {
  render() {
    return (
      <div><span>{this.props.data.name}: {this.props.data.value}</span></div>
    );
  }
}

export default BoutiqueToolEnvironmentVariablesItem;
