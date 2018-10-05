import PhantomsFilters from  './filters.js';
import PhantomsDataTable from  './datatable.js';

class PhantomProcessingApp extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
        phantoms: {},
        cbrain: {},
        isLoaded: false,
        filter: {}
    };

    this.getPhantoms  = this.getPhantoms.bind(this);
    this.getCBRAIN = this.getCBRAIN.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  getPhantoms() {
    fetch(this.props.baseurl.concat('?format=json'), {headers: {'Accept': 'application/json'}})
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            phantoms: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  getCBRAIN() {
    fetch(this.props.baseurl.concat('/cbrain'), {headers: {'Accept': 'application/json'}}) 
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            cbrain: Object.keys(result).map(function(dpindex) {
              return {
                dataprovider: JSON.parse(result[dpindex].dp),
                files: Object.keys(result[dpindex].files).map(function(fileindex) {
                  return JSON.parse(result[dpindex].files[fileindex]);
                })
              };
            })
          });
      });
  }

  componentDidMount(){
    this.getPhantoms();
    this.getCBRAIN();
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <h3>Loading</h3>
      );
    }

    return (
      <div>
        <PhantomsFilters filter={this.state.filter} updateFilter={this.updateFilter} form={this.state.phantoms.form}/>
        <PhantomsDataTable data={this.state.phantoms} filter={this.state.filter}/>
      </div>
    );
  }
}

PhantomProcessingApp.propTypes = {
  baseurl: React.PropTypes.string.isRequired
};

document.addEventListener('DOMContentLoaded', function(){ 
  ReactDOM.render(
    <PhantomProcessingApp baseurl={loris.BaseURL.concat('/phantom_processing')} />,
    document.getElementById('lorisworkspace')
  );
});
