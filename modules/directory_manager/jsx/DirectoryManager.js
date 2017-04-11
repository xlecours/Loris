import DirectoryTree from './DirectoryTree';
 /**
  * Directory Manager
  *
  * Main module component rendering the directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class DirectoryManager extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoaded: false,
      formData: {}
    };

    // Bind component instance to custom methods
    this.folderClickHandler = this.folderClickHandler.bind(this);
    this.fileClickHandler = this.fileClickHandler.bind(this);
  }

  componentDidMount() {
    this.getNameTree();
  }

  /**
   * Retrive data from the provided URL and save it in state
   */
  getNameTree() {
    $.getJSON(this.props.dataURL, data => {
      this.setState({
        data: data,
        isLoaded: true
      });
    }).error(function(error) {
      console.error(error);
    });
  }

  fileClickHandler (file) {
    console.log(file)
    this.setState({ selectedFile: file.path })
  }
 
  folderClickHandler (folderName) {
    console.log(folderName)
  }

  render() {
    let tree = null;
    console.log(this.state.isLoaded);
    if (this.state.isLoaded) {
      tree = (
        <DirectoryTree tree={this.state.data} />
      );
    }
    return (
      <div className="panel panel-primary">
      {tree}
      </div>
    );
  }
}

export default DirectoryManager;
