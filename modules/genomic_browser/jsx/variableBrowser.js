import MenuFilterForm from 'MenuFilterForm';

class VariableBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    this.formatColumn = this.formatColumn.bind(this);
  }

  formatColumn(c, a) {
    return (
      <td>{a}</td>
    );
  }

  render() {
    return (
      <MenuFilterForm
        moduleName={"genomic_browser/".concat(this.props.variableType, "_browser")}
        formatColumn={this.formatColumn}
      />
    );
  }
}

VariableBrowser.propTypes = {
  variableType: React.PropTypes.string.isRequired
};

export default VariableBrowser;
