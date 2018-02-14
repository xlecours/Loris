import {Tabs, TabPane} from 'Tabs'; 
import DatasetsTab from './DatasetsTab.js'

class OmicsApp extends React.Component {
  constructor(props) {
    super(props);

    loris.hiddenHeaders = ['Fileset Id', 'Couch Doc'];
    this.state = {
      isLoaded: false,
      headers: [],
      datasets: []
    }

    this.fetchDatasets = this.fetchDatasets.bind(this);
    this.formatCell    = this.formatCell.bind(this);
    this.viewDetails   = this.viewDetails.bind(this);
    this.goToEditPage  = this.goToEditPage.bind(this);
  }

  componentDidMount() {
    this.fetchDatasets();
  }

  fetchDatasets() {
    const url = loris.BaseURL.concat('/omics/datasets?format=json');
    const xhr = new XMLHttpRequest();
    const that = this;

    xhr.onreadystatechange = function (e) {
      try {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const datasets = xhr.response.Data.map(function (d) {
              let obj = {};
              xhr.response.Headers.forEach(function(h,i) {
                obj[h] = d[i]; 
              }, this )
              return obj;
            },this)
            that.setState({
              isLoaded: true,
              headers: xhr.response.Headers.concat(['Actions']),
              datasets: datasets
            });
          } else {
            console.error('There was a problem with the request.');
          }
        }
      } catch( e ) {
        console.error(e);
      }
    }, this;
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
  }

  viewDetails(event) {
    const filesetId = event.target.getAttribute("data-fileset-id");
    this.refs.tabs.handleClick(filesetId, event);
  }

  goToEditPage(event) {
    console.log(event.target);
  }

  formatCell(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    var row = {};
    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    }, this);

    let element;

    switch (column) {
      case 'Origin':
      case 'ShortDescription':
      case 'Timestamp Added':
        element = (
          <td>{cell}</td>
        );
        break;
      case 'Actions':
        element = (
          <td>
            <button onClick={this.viewDetails} data-fileset-id={row['Fileset Id']}>View</button>
            &nbsp;
            <button onClick={this.goToEditPage} data-fileset-id={row['Fileset Id']}>Edit</button>
          </td>
        );
        break;
    }

    return element;
  }

  render() {
    const datasets = this.state.datasets;
    const tabList = [{id: 'default', label: 'Datasets'}].concat(datasets.map(function(d) {
      const label = (d['Couch Doc']) ? d['Couch Doc'].meta.variable_type : "Unknown";
      return ({
        id: d['Fileset Id'],
        label: label
      });
    }));

    const datasetsTabPane = (
      <TabPane key='datasets' TabId='default'>
        <StaticDataTable
          Headers={this.state.headers}
          Data={datasets.map(function(d) {return Object.values(d);})}
          getFormattedCell={this.formatCell}
        />
      </TabPane>
    );

    const tabs = [datasetsTabPane].concat(datasets.map(function(d, i) {
      return (
        <TabPane key={i} TabId={d['Fileset Id']} />
      );
    }));

    return (
      <Tabs tabs={tabList} updateURL={true} ref="tabs">
        {tabs}
      </Tabs>
    );
  }
}

$(function() {
  const app = (
    <div className="omics-app">
      <OmicsApp />
    </div>
  );

  ReactDOM.render(app, document.getElementById("lorisworkspace"));
});
