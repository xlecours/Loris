class BoutiqueToolContainerImage extends React.Component {
  render() {
    const content = Object.keys(this.props.data).map(function(k,i) {
      return (
        <span key={i}>{k} : {this.props.data[k]}</span>
      );
    }, this);

    return (
      <div>{content}</div>
    );
  }
}

BoutiqueToolContainerImage.propTypes = {
  data: React.PropTypes.object
};

BoutiqueToolContainerImage.defaultProps = {
  data: {}
};

export default BoutiqueToolContainerImage;
