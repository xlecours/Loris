class BoutiqueToolOutputFiles extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const items = this.props.data.map(function(item, index) {
      return (
        <span key={index}>{item.name}</span>
      );
    });

    return (
      <div>{items}</div>
    );
  }
}

BoutiqueToolOutputFiles.propTypes = {
  data: React.PropTypes.array
};

BoutiqueToolOutputFiles.defaultProps = {
  data: []
};

export default BoutiqueToolOutputFiles;
