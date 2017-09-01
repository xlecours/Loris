import {Tabs, TabPane} from 'Tabs';
import {Tool} from './tool';

class ProcessingToolsIndex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      tools: {}
    };

    // Bind component instance to custom methods
    this.getTools = this.getTools.bind(this);
  }

  componentDidMount() {
    this.getTools();
  }

  getTools() {
    $.ajax(this.props.DataURL, {
      method: "GET",
      accepts : {
        json: "application/json"
      },
      dataType: 'json',
      success: function(data) {
        this.setState({
          tools: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      }
    });
  }

  render() {
    let tabList = [
      {id: "tools", label: "Tool List"}
    ];

    let toolTiles = Object.keys(this.state.tools).map(function (tool, index) {
      //const tool_name = tool.slice(tool.lastIndexOf('\\') + 1);
      //const link = loris.BaseURL.concat('/tools/',tool_name); 
      //return <div key={'tool_'.concat(index)} className="tool-tile"><a href={link}>{tool_name}</a></div>
      return <Tool key={'tool_'.concat(index)}/>
    });
    return (
      <Tabs tabs={tabList} defaultTab="tools" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <div className='tools-container'>
          {toolTiles}
          </div>
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const processingToolsIndex = (
    <ProcessingToolsIndex DataURL={`${loris.BaseURL}/tools/?format=json`} />
  );

  ReactDOM.render(processingToolsIndex, document.getElementById("lorisworkspace"));
});
