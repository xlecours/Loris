import BoutiqueToolName from './BoutiqueComponents/BoutiqueToolName';
import BoutiqueToolDescription from './BoutiqueComponents/BoutiqueToolDescription';
import BoutiqueToolVersion from './BoutiqueComponents/BoutiqueToolVersion';
import BoutiqueToolCommandLine from './BoutiqueComponents/BoutiqueToolCommandLine';
import BoutiqueToolContainerImage from './BoutiqueComponents/BoutiqueToolContainerImage';
import BoutiqueToolEnvironmentVariables from './BoutiqueComponents/BoutiqueToolEnvironmentVariables';
import BoutiqueToolInputs from './BoutiqueComponents/BoutiqueToolInputs';
import BoutiqueToolTests from './BoutiqueComponents/BoutiqueToolTests';
import BoutiqueToolOutputFiles from './BoutiqueComponents/BoutiqueToolOutputFiles';
import BoutiqueToolInvocationSchema from './BoutiqueComponents/BoutiqueToolInvocationSchema';
import BoutiqueToolSuggestedRessources from './BoutiqueComponents/BoutiqueToolSuggestedRessources';

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

    let messages = [];

    if (Number(schema['schema-version']) != 0.5) {
      messages.push(
        <span>This Boutique schema version might not be supported</span>
      );
    }

    return (
      <div>
        {messages}
        <BoutiqueToolName data={schema['name']} />
        <BoutiqueToolDescription data={schema['description']} />
        <BoutiqueToolVersion data={schema['tool-version']} />
        <BoutiqueToolCommandLine data={schema['command-line']} />
        <BoutiqueToolContainerImage data={schema['container-image']} />
        <BoutiqueToolEnvironmentVariables data={schema['environment-variables']} />
        <BoutiqueToolInputs inputs={schema['inputs']} groups={schema['groups']} />
        <BoutiqueToolTests data={schema['tests']} />
        <BoutiqueToolOutputFiles data={schema['output-files']} />
        <BoutiqueToolInvocationSchema data={schema['invocation-schema']} />
        <BoutiqueToolSuggestedRessources data={schema['suggested-resources']} />
        <BoutiqueToolTags data={schema['tags']} />
        <BoutiqueToolErrorCodes data={schema['error-codes']} />
        <BoutiqueToolcustom data={schema['custom']} />
      </div>
    );
  } 
}

export default BoutiqueToHtml;
