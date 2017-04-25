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
    this.registerFile = this.registerFile.bind(this);
    this.unregisterFile = this.unregisterFile.bind(this);
    this.checkSum = this.checkSum.bind(this);
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

            if (!obj[key]) {
              element = (
                <div key={index} className="action-item">
                  <button className="not-registered" onClick={this.registerFile} data-relative-path={postData.fullpath}><span>Not registered</span></button>
                </div>
              );
              className = 'glyphicon glyphicon-remove';
              text = 'Not registered';
            } else if (obj[key] == 'Not found...') {
              className = 'glyphicon glyphicon-question-sign';
              text = obj[key];
            } else if (typeof obj[key] === 'number') {
              element = (
                <div key={index} className="action-item">
                  <button className="task" onClick={this.checkSum} data-userfile-id={obj[key]}><span>Registered</span></button>
                  <button className="registered" onClick={this.unregisterFile} data-relative-path={postData.fullpath}><span>Registered</span></button>
                </div>
              );
            }

          break;
        }
        return element;
      }.bind(this));
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

  unregisterFile(event) {

    const self = this;
    const target = event.target;
    const postData = {
      className: this.state.data.className,
      action: 'unregisterFile',
      filenames: [
        target.dataset.relativePath
      ]
    };

    $.ajax({
      type: 'POST',
      url: this.props.dataURL,
      data: JSON.stringify(postData),
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
        self.getTree();
      },
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

  registerFile(event) {

    const self = this;
    const target = event.target;
    const postData = {
      className: this.state.data.className,
      action: 'registerFile',
      filenames: [
        target.dataset.relativePath
      ]
    };

    $.ajax({
      type: 'POST',
      url: this.props.dataURL,
      data: JSON.stringify(postData),
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
      },
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

  checkSum(event) {
    const target = event.target;

    const postData = {
      className: this.state.data.className,
      action: 'checkSum',
      userfiles: [
        target.dataset.userfileId
      ]
    };

    $.ajax({
      type: 'POST',
      url: this.props.dataURL,
      data: JSON.stringify(postData),
      cache: false,
      contentType: false,
      processData: false,
      success: function () {
      },
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
        <h1>Tool config 457 : myChecksum</h1>
        {tree}
      </div>
    );
  }
}

export default Dataprovider;
