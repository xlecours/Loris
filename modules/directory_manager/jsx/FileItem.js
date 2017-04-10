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
    };

    // Bind component instance to custom methods
  }

  componentDidMount() {
  }

  render() {
    return (
      <li className="file-item">
        <span className="glyphicon glyphicon-file"></span>
        <text>{this.props.name}</text>
      </li>
    );
  }
}

export default FileItem;
