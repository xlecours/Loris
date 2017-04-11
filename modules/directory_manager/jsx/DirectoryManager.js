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

  render() {
    let tree = null;
    if (this.state.isLoaded) {
      tree = (
        <DirectoryTree tree={this.state.data} />
      );
    } else {
      tree = (
        <text>Loading...</text>
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
