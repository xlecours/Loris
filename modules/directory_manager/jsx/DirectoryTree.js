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
      expended: false,
      additionnalElements: []
    };

    // Bind component instance to custom methods
    this.onClickHandler = this.onClickHandler.bind(this);
    this.getAdditionalElements = this.getAdditionalElements.bind(this);
    this.addElements = this.addElements.bind(this);
  }

  onClickHandler() {
    let newVal = (this.state.expended !== true);
    this.setState({
      expended: newVal
    });
  }

  addElements(elements) {
    this.setState({
      additionnalElements: elements
    });
  }

  // Concatenate the name of this directory with the calling child name
  // to build the relative path.
  getAdditionalElements(name, callback) {
    if (this.props.getAdditionalElements) {
      const fullname = this.props.tree.name.concat('/', name);
      return this.props.getAdditionalElements(fullname, callback);
    }
  }

  componentDidMount() {
    if (this.props.getAdditionalElements) {
      this.props.getAdditionalElements(this.props.tree.name, this.addElements);
    }
  }

  render() {
    let glyph = 'glyphicon glyphicon-folder-close';
    let nodes;
    let leaves;
    let warnings;

    if (!this.props.tree.isReadable) {
      warnings = (
        <div className="module-warnings">Permission denied...</div>
      );

    } else if ( this.state.expended ) {
      const getAdditionalElements = this.getAdditionalElements;

      nodes  = this.props.tree.directories.map(function (dir, index) {
        return (
          <DirectoryTree 
            key={index}
            tree={dir}
            getAdditionalElements={getAdditionalElements}
          /> 
        );
      });
      leaves = this.props.tree.files.map(function (file, index) {
        return (
          <FileItem key={index} name={file} getAdditionalElements={getAdditionalElements} />
        );
      });
      glyph = 'glyphicon glyphicon-folder-open';

    }

    return (
        <div className="directory-tree" >
          <div className="click-handler" onClick={this.onClickHandler}>
            <div className="item">
              <div className="mandatory-elements">
                <span className={glyph} />
                <text>{this.props.tree.name}</text>
                {warnings}
              </div>
              <div className="additionnal-elements">
                {this.state.additionnalElements}
              </div>
            </div>
          </div>
          <div className="directory-content">
            <div className="left-line" />
            <div className="nodes">
              {nodes}
              {leaves}
            </div>
          </div>
        </div>
    );
  }
}

DirectoryTree.propTypes = {
  tree: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    isReadable: React.PropTypes.bool,
    files: React.PropTypes.array.isRequired,
    directories: React.PropTypes.array.isRequired
  }),
  getAdditionalElements: React.PropTypes.func
}; 

export default DirectoryTree;
