import {Tabs, TabPane} from 'Tabs'; 

class OmicsApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      datasets: []
    }

    this.fetchDatasets = this.fetchDatasets.bind(this);
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
            },this);
            that.setState({
              isLoaded: true,
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

  render() {
    const datasets = this.state.datasets;
    const tabList = [{id: 'default', label: 'Datasets'}].concat(datasets.map(function(d) {
      return ({
        id: d.Id,
        label: d.Identifier.variable_type
      });
    }));
    const tabs = [<TabPane key='d' TabId='default' />].concat(datasets.map(function(d, i) {
      return (
        <TabPane key={i} TabId={d.Id} />
      );
    }));
    return (
      <Tabs tabs={tabList}>
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
