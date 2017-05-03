import FileItem from './FileItem';
 /**
  * Directory Tree
  *
  * Main module component rendering the directory tree for directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.1
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
    this.contentSelectionHandler = this.contentSelectionHandler.bind(this);
  }

  componentDidMount() {
  }

  onClickHandler() {
    let newVal = (this.state.expended !== true);
    this.setState({
      expended: newVal
    });
  }

  contentSelectionHandler(event) {
    event.stopPropagation();
    let classList = event.target.classList;
    if (classList.contains('glyphicon-unchecked')) {
      classList.replace('glyphicon-unchecked', 'glyphicon-check');
    } else {
      classList.replace('glyphicon-check', 'glyphicon-unchecked');
    }
  }

  render() {
    let glyph = 'glyphicon glyphicon-folder-close';
    let content;

    if ( this.state.expended ) {
      content  = this.props.tree.content.map(function (item, index) {
console.log(item);
        let element;
        if (!item.isFile) {
         element = (
          <DirectoryTree
            key={'tree-' + index}
            tree={item}
          />
         );
        } else {
          element = (
            <FileItem 
              key={'file-' + index}
              name={item.name}
            />
          );
        }
        return element;
      });
      glyph = 'glyphicon glyphicon-folder-open';
    }

    const checkboxClasses = "selection-item glyphicon glyphicon-unchecked";
      
    return (
        <div className="directory-tree" >
          <div className="click-handler" onClick={this.onClickHandler}>
            <div className="item">
              <div className="mandatory-elements">
                <span className={checkboxClasses} onClick={this.contentSelectionHandler}/>
                <span className={glyph} />
                <text>{this.props.tree.name}</text>
              </div>
            </div>
          </div>
          <div className="directory-content">
            <div className="left-line" />
            <div className="nodes">
              {content}
            </div>
          </div>
        </div>
    );
  }
}

DirectoryTree.propTypes = {
  tree: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    isFile: React.PropTypes.bool,
    content: React.PropTypes.array.isRequired
  }),
}; 

export default DirectoryTree;
