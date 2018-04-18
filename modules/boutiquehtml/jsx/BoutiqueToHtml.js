import BoutiqueToolName from './BoutiqueComponents/BoutiqueToolName';
import BoutiqueToolDescription from './BoutiqueComponents/BoutiqueToolDescription';
import BoutiqueToolVersion from './BoutiqueComponents/BoutiqueToolVersion';

class BoutiqueToHtml extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      schema: {},
      loaded: false
    };

    this.getSchema = this.getSchema.bind(this);
  }

  componentDidMount() {
    this.getSchema();
  }

  /**
   * Retrive data from the provided URL and save it in state
   */
  getSchema() {
    const xhr = new XMLHttpRequest();
    const that = this;

    xhr.open("GET", this.props.url);
    xhr.onload = function () {
      that.setState({
        schema: JSON.parse(this.responseText),
        loaded: true
      });
    }
    xhr.send();
  }

  render() {
    if (!this.state.loaded) {
      return (
        <h3>Loading...</h3>
      );
    }

    const schema = this.state.schema;

    return (
      <div>
        <BoutiqueToolName data={schema.name} />
        <BoutiqueToolDescription data={schema.description} />
        <BoutiqueToolVersion data={schema.tool-version} />
      </div>
    );
  } 
}

export default BoutiqueToHtml;
