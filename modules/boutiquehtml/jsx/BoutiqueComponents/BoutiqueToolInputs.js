import BoutiqueToolInputsItem from './BoutiqueToolInputsItem';

class BoutiqueToolInputs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const inputs = this.props.inputs.map(function(input, index) {
      return (
        <BoutiqueToolInputsItem key={index} data={input} />
      );
    }, this);

    return (
      <div>
        {inputs}
      </div>
    );
  }
}

BoutiqueToolInputs.propTypes = {
  inputs: React.PropTypes.arrayOf(React.PropTypes.shape({
    "id": function(props, propName, componentName) {
      if (!/^[0-9,_,a-z,A-Z]*$/.test(props[propName])) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    },
    "name": React.PropTypes.string.isRequired,
    "type": React.PropTypes.oneOf(["String", "File", "Flag", "Number"]).isRequired,
    "description": React.PropTypes.string,
    "value-key": React.PropTypes.string,
    "list": React.PropTypes.bool,
    "optional": React.PropTypes.bool,
    "command-line-flag": React.PropTypes.string,
    "requires-inputs": React.PropTypes.arrayOf(React.PropTypes.string),
    "disables-inputs": React.PropTypes.arrayOf(React.PropTypes.string),
    "command-line-flag-separator": React.PropTypes.string,
    "default-value": React.PropTypes.any,
    "value-choices": React.PropTypes.arrayOf(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])),
    "integer": React.PropTypes.bool,
    "minimum": React.PropTypes.number,
    "maximum": React.PropTypes.number,
    "exclusive-minimum": React.PropTypes.bool,
    "exclusive-maximum": React.PropTypes.bool,
    "min-list-entries": React.PropTypes.number,
    "max-list-entries": React.PropTypes.number,
    "uses-absolute-path": React.PropTypes.bool
  })).isRequired,
  groups: React.PropTypes.arrayOf(React.PropTypes.shape({
    "id": function(props, propName, componentName) {
      if (!/^[0-9,_,a-z,A-Z]*$/.test(props[propName])) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    },
    "name": React.PropTypes.string.isRequired,
    "description": React.PropTypes.string,
    "members": function(props, propName, componentName) {
      if (!/^[0-9,_,a-z,A-Z]*$/.test(props[propName])) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    },
    "mutually-exclusive": React.PropTypes.bool,
    "one-is-required": React.PropTypes.bool,
    "all-or-none": React.PropTypes.bool
  })).isRequired
};

BoutiqueToolInputs.defaultProps = {
  inputs: []
};

export default BoutiqueToolInputs;
