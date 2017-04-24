/**
  * File Item
  *
  * Component use by the DirectoryTree to render a file node in its tree.
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class FileItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      additionnalElements: []
    };

    // Bind component instance to custom methods
    this.addElements = this.addElements.bind(this);
  }

  componentDidMount() {
    if (this.props.getAdditionalElements) {
      this.props.getAdditionalElements(this.props.name, this.addElements);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  addElements(elements) {
    this.setState({
      additionnalElements: elements
    });
  }

  render() {
    return (
      <div className="item file-item">
        <div className="mandatory-elements">
          <span className="glyphicon glyphicon-file"></span>
          <text>{this.props.name}</text>
        </div>
        <div className="additionnal-elements">
          {this.state.additionnalElements}
        </div>
      </div>
    );
  }
}

FileItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  getAdditionalElements: React.PropTypes.func
};

export default FileItem;
