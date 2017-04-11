import FileItem from './FileItem';
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
      expended: false
    };

    // Bind component instance to custom methods
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler() {
    let newVal = (this.state.expended !== true);
    this.setState({
      expended: newVal
    });
  }

  componentDidMount() {
  }

  render() {
    let glyph = 'glyphicon glyphicon-folder-close';
    let nodes;
    let leaves;

    if ( this.state.expended ) {
      nodes  = this.props.tree.directories.map(function (dir, index) {
        return (
          <DirectoryTree key={index} tree={dir} /> 
        );
      });
      leaves = this.props.tree.files.map(function (file, index) {
        return (
          <FileItem key={index} name={file} />
        );
      });
      glyph = 'glyphicon glyphicon-folder-open';
    }

    return (
        <div className="directory-tree" >
          <div className="click-handler flex-container-directory" onClick={this.onClickHandler}>
            <div className="flex-item-directory">
              <span className={glyph} />
              <text>{this.props.tree.name}</text>
            </div>
          </div>
          {nodes}
          {leaves}
        </div>
    );
  }
}

DirectoryTree.propTypes = {
  tree: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    files: React.PropTypes.array.isRequired,
    directories: React.PropTypes.array.isRequired
  })
}; 

export default DirectoryTree;
