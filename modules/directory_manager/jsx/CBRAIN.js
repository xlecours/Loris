import DirectoryTree from './DirectoryTree';
 /**
  * CBRAIN
  *
  * Main module component rendering the directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class CBRAIN extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoaded: false
    };
    this.getTree = this.getTree.bind(this);
    this.addCustomElements = this.addCustomElements.bind(this);
    this.handleButton = this.handleButton.bind(this);
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

  addCustomElements(tree){
    return tree;
  }

  handleButton(event) {
    console.log(event.target);
  }

  render() {
    let tree;
    if (this.state.isLoaded) {
      tree = (
        <DirectoryTree
          tree={this.state.data}
        />
      );
    }
    return (
      <div className="panel panel-primary">
        <div className="action-panel">
          <button onClick={this.handleButton}>Show selection</button>
        </div>
        {tree}
      </div>
    );
  }
}

CBRAIN.propTypes = {
  dataURL: React.PropTypes.string.isRequired
};

export default CBRAIN;
