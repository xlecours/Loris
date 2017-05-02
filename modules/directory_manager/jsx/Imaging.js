import DirectoryTree from './DirectoryTree';
 /**
  * Imaging
  *
  * Main module component rendering the directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class Imaging extends React.Component {

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

  getAdditionalElements(fullpath, callback) {
    console.log('Imaging::getAdditionalElements');
    const postData = {
      className: this.state.data.className,
      fullpath: fullpath,
      action: 'getAdditionnalElements'
    };

    const success = function(data) {
      console.log(data);
    };

    return $.ajax({
      type: 'POST',
      url: this.props.dataURL,
      data: JSON.stringify(postData),
      cache: false,
      contentType: false,
      processData: false,
      success: success,
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

  showResponse(content, ...rest) {
    console.log(content);
    console.log(rest);
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
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon
            glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }
    return (
      <div className="panel panel-primary">
        {tree}
      </div>
    );
  }
}

Imaging.propTypes = {
  dataURL: React.PropTypes.string.isRequired
};

export default Imaging;
