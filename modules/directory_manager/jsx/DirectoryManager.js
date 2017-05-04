import Dataprovider from './Dataprovider';
import CBRAIN from './CBRAIN';
import Imaging from './Imaging';

 /**
  * DirectoryManager
  *
  * Main module component rendering the directory manager
  *
  * @author Xavier Lecours Boucher
  * @version 1.0.0
  *
  * */
class DirectoryManager extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
  }

  render() {
    const tabList = [
      {id: "dataprovider", label: "Dataprovider"},
      {id: "cbrain", label: "CBRAIN"},
      {id: "imaging", label: "Imaging"}
    ];

    const tabPanes = tabList.map(function(tab, index) {
      const url = this.props.dataURL.concat('&tabName=', tab.id);

      let  tabContent;
      switch (tab.id) {
        case 'dataprovider':
          tabContent = (
            <Dataprovider dataURL={url} />
          );
          break;
        case 'imaging':
          tabContent = (
            <Imaging dataURL={url} />
          );
          break;
        case 'cbrain':
          tabContent = (
            <CBRAIN dataURL={url} />
          );
          break;

      }      
      return (
        <TabPane key={tab.id} TabId={tab.id}>
          {tabContent}
        </TabPane>
      );
    }, this);

    const url = this.props.dataURL;
    return (
      <Tabs tabs={tabList} defaultTab="dataprovider" updateURL={false}>
        <TabPane TabId="dataprovider">
          <Dataprovider dataURL={url.concat('&tabName=dataprovider')} />
        </TabPane>
        <TabPane TabId="cbrain">
          <CBRAIN dataURL={url.concat('&tabName=cbrain')} />
        </TabPane>
        <TabPane TabId="imaging">
          <Imaging dataURL={url.concat('&tabName=imaging')} />
        </TabPane>
      </Tabs>
    );
  }
}

DirectoryManager.propTypes = {
  dataURL: React.PropTypes.string.isRequired
};

export default DirectoryManager;
