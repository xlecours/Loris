import BoutiqueToolEnvironmentVariablesItem from './BoutiqueToolEnvironmentVariablesItem';

class BoutiqueToolEnvironmentVariables extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
console.log(this.props.data);
    const items = this.props.data.map(function(item, index) {
      return (
        <BoutiqueToolEnvironmentVariablesItem key={index} data={item} />
      );
    });

    return (
      <div><span>{items}</span></div>
    );
  }
}

BoutiqueToolEnvironmentVariables.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    description: React.PropTypes.string
  }))
};

BoutiqueToolEnvironmentVariables.defaultProps = {
  data: []
};

export default BoutiqueToolEnvironmentVariables;

