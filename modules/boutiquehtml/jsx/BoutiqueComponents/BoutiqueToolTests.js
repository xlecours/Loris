class BoutiqueToolTests extends React.Component {
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

BoutiqueToolTests.propTypes = {
  data: React.PropTypes.array
};

BoutiqueToolTests.defaultProps = {
  data: []
};

export default BoutiqueToolTests;
