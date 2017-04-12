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

  addElements(elements) {
    this.setState({
      additionnalElements: elements
    });
  }

  render() {
    return (
      <div className="file-item">
        <span className="glyphicon glyphicon-file"></span>
        <text>{this.props.name}</text>
        {this.state.additionnalElements}
      </div>
    );
  }
}

FileItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  getAdditionalElements: React.PropTypes.func
};

export default FileItem;
