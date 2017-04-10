 /**
  * Directory Tree
  *
  * Main module component rendering the directory tree for directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class DirectoryTree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };

    // Bind component instance to custom methods
  }

  componentDidMount() {
  }

  render() {
    console.log('DirectoryTree::render');
    return (
        <ul>
          <li>Dir1</li>
          <li>Dir3</li>
        </ul>
    );
  }
}

export default DirectoryTree;
