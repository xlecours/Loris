/**
 * CBRAIN Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders CBRAIN main page 
 *
 * @author Xavier Lecours <xavier.lecoursboucher@mcgill.ca>
 * @version 0.0.1
 *
 * */
class CBRAIN extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({isLoaded: true});
  }

  render() {
    return (
      <h1>YEAH!</h1>
    );
  }
}

CBRAIN.propTypes = {
};

/**
 * Render CBRAIN on page load
 */
window.onload = function() {
  const cbrain  = (
    <CBRAIN />
  );

  ReactDOM.render(cbrain, document.getElementById("lorisworkspace"));
};
