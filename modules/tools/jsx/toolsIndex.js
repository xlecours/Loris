import {Tabs, TabPane} from 'Tabs';

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

    let toolTiles = Object.keys(this.state.tools).map(function (tool) {
      return <div>{tool}</div>
    });
    return (
      <Tabs tabs={tabList} defaultTab="tools" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          {toolTiles}
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const processingToolsIndex = (
    <div className="page-processing-tools">
      <ProcessingToolsIndex DataURL={`${loris.BaseURL}/tools/?format=json`} />
    </div>
  );

  ReactDOM.render(processingToolsIndex, document.getElementById("lorisworkspace"));
});
