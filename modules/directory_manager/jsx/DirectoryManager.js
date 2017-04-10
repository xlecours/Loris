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
      data: null,
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
console.log('DirectoryManager::render');
console.log(this.state.data);
    return (
        <div>
          <DirectoryTree />
        </div>
    );
  }
}

export default DirectoryManager;
