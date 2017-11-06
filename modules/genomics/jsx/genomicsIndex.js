import MenuFilterForm from 'MenuFilterForm';

import formatColumn from './columnFormatter';

class GenomicsApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  render() {
    return (
      <div>
        <MenuFilterForm
          moduleName="genomics/dataset_browser"
          formatColumn={formatColumn}
        />
      </div>
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
