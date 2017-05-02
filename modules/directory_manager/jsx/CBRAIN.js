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
    };

  }

  componentDidMount() {
    
  }

  render() {

    return (
      <div>cbrain</div>
    );
  }
}

CBRAIN.propTypes = {
  dataURL: React.PropTypes.string.isRequired
};

export default CBRAIN;
