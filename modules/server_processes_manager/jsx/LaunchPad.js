import {Tool} from './tool.js'

class LaunchPad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableTools: []
    };
  }

  componentDidMount() {
    console.log('HERE');
  }

  render() {
    const availableTools = this.state.availableTools.map(function(tool) {
      return <Tool descriptor={tool} />
    });  

    return (
      <div className="grid-container">
        {availableTools}
      </div>
    );
  }
}

$(function() {
  const app = (
    <LaunchPad />
  );

  ReactDOM.render(app, document.getElementById("lorisworkspace"));
});
