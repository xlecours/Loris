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
      isLoaded: false
    };

    this.getTree = this.getTree.bind(this);
    this.getAdditionalElements = this.getAdditionalElements.bind(this);

  }

  componentDidMount() {
    this.getTree();
  }

  /**
   * Retrive data from the provided URL and save it in state
   */
  getTree() {
    $.getJSON(this.props.dataURL, data => {
      this.setState({
        data: data,
        isLoaded: true
      });
    }).error(function(error) {
      console.error(error);
    });
  }

  getAdditionalElements(fullpath, callback) {
    const postData = {
      className: this.state.data.className,
      fullpath: fullpath,
      action: 'getAdditionnalElements'
    };
   console.log(callback); 
    return $.ajax({
      type: 'POST',
      url: this.props.dataURL,
      data: JSON.stringify(postData),
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        
        const obj = JSON.parse(data);
        const elements = Object.keys(obj['cbrain_file_item']).map(function(key) {
          const text = key.concat(': ', obj['cbrain_file_item'][key]);
          return (
              <text>{text}</text>
          );
        });
        callback(elements);
      }.bind(this),
      error: function(err) {
        console.error(err);
        swal({
          title: "Error!",
          type: "error",
          content: err.statusText
        });
      }
    });
  }

  render() {
    let tree = null;
    if (this.state.isLoaded) {
      tree = (
        <DirectoryTree 
          tree={this.state.data}
          getAdditionalElements={this.getAdditionalElements}
        />
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
