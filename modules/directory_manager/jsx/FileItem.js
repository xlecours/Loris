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
    this.select = this.select.bind(this);
  }

  componentDidMount() {
  }

  select(event) {
    event.stopPropagation();
    const classList = event.target.classList;

    classList.toggle('glyphicon-unchecked');
    classList.toggle('glyphicon-check');
  }

  render() {
    return (
      <div className="item file-item">
        <div className="mandatory-elements">
          <span className="glyphicon glyphicon-file"></span>
          <text>{this.props.name}</text>
          <span className="selection-item glyphicon glyphicon-unchecked" onClick={this.select}/>
        </div>
        <div className="additionnal-elements">
          {this.props.children}
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
