var VariableTab = React.createClass({
  displayName: "VariableTab",

  render: function() {
    return React.createElement(
      "div",
      null,
      this.props.variableType
    );
  }
});
