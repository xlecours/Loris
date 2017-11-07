import MenuFilterForm from 'MenuFilterForm';
import {Tabs, TabPane} from 'Tabs';

import VariableBrowser from './variableBrowser';

class GenomicsApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'profiles',
      loaded: false,
      data: {
        variableTypes: ["gwas", "snp", "cnv", "cpg"]
      }
    };

    this.formatColumn = this.formatColumn.bind(this);
  }

  formatColumn(c, a) {
    return (
      <td>{a}</td>
    );
  }

  render() {
    const variableTypes = this.state.data.variableTypes;

    const tabs = variableTypes.map(function (item, index) {
      return (
        <TabPane TabId={item} key={index}>
          <VariableBrowser variableType={item} />
        </TabPane>
      );
    });

    let tabList = variableTypes.map(function (item) {
      const tab = {id: item, label: item};
      return tab;
    });

    tabList = [{id: "profiles", label: "Profiles"}].concat(tabList);    

    return (
      <Tabs tabs={tabList} defaultTab="profiles" updateURL={true}>
        <TabPane TabId="profiles">
          <MenuFilterForm
            moduleName="genomic_browser/profiles"
            formatColumn={this.formatColumn}
          />
        </TabPane>
        {tabs}
      </Tabs>
    );
  }
}

$(function() {
  const app = (
    <div>
      <GenomicsApp />
    </div>
  );

  ReactDOM.render(app, document.getElementById("lorisworkspace"));
});
