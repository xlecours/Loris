import DirectoryTree from './DirectoryTree';
 /**
  * Dataprovider
  *
  * Main module component rendering the directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class Dataprovider extends React.Component {

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

    const success = function(data) {
      const obj = JSON.parse(data);
      const elements = Object.keys(obj).map(function(key, index) {
        let element;
        switch(key) {
          case 'registration_status':
            let text;
            let className; 
            let userfile_id;

            if (!obj[key]) {
              className = 'glyphicon glyphicon-remove';
              text = 'Not registered';
            } else if (obj[key] == 'Not found...') {
              className = 'glyphicon glyphicon-question-sign';
              text = obj[key];
            } else if (typeof obj[key] === 'number') {
              className = 'glyphicon glyphicon-ok';
              text = 'Registered';
            }

            element = (
              <span className={className} userfile={userfile_id} data-toggle="tooltip" title={text} />
            );
          break;
        }
        return element;
      });
      callback(elements);
    }.bind(this);

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

  addToSelection($path) {

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

export default Dataprovider;
