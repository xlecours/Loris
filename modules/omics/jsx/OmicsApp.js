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

  fetchDatasets() {
    return;
  }

  render() {
    return (
      <h1>BOB</h1>
    );
  }
}

$(function() {
  const app = (
    <div className="omics-app">
      <OmicsApp DataURL={`${loris.BaseURL}/omics/`} />
    </div>
  );

  ReactDOM.render(app, document.getElementById("lorisworkspace"));
});
