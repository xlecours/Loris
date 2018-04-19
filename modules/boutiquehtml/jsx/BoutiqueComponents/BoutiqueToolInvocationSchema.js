class BoutiqueToolInvocationSchema extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.data;

    const items = Object.keys(data).map(function(key, index) {
      return (
        <span key={index}>{JSON.stringify(data['key'])}</span>
      );
    });

    return (
      <div>{items}</div>
    );
  }
}

BoutiqueToolInvocationSchema.propTypes = {
  data: React.PropTypes.object
};

BoutiqueToolInvocationSchema.defaultProps = {
  data: {}
};

export default BoutiqueToolInvocationSchema;
