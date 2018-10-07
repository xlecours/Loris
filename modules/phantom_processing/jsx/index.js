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

    this.getData  = this.getData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  getData() {
    const that = this;
    var p1 = fetch(this.props.baseurl.concat('?format=json'), {headers: {'Accept': 'application/json'}})
      .then(res => res.json())
      .then(
        (result) => {
          return result;
        }
      );

    var p2 = fetch(this.props.baseurl.concat('/cbrain'), {headers: {'Accept': 'application/json'}}) 
      .then(res => res.json())
      .then(
         (result) => {
           return Object.keys(result).map(function(dpindex) {
             return {
               dataprovider: JSON.parse(result[dpindex].dp),
               files: Object.keys(result[dpindex].files).map(function(fileindex) {
                 return JSON.parse(result[dpindex].files[fileindex]);
               })
             };
           });
         }
      );

    Promise.all([p1,p2]).then(function(value) {
      that.setState({
        phantoms: value[0],
        cbrain: value[1],
        isLoaded: true
      });
      //that.forceUpdate();
    });
  }

  componentDidMount(){
    this.getData();
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <span>Loading...</span>
      );
    }

    if (this.state.error) {
      return (
        <span>{error}</span>
      );
    }

    const cbraindata = this.state.cbrain;
    const tableheaders = [
      'Visit Label',
      'Insert Date',
      'Status',
      'Bob',
      'Details'
    ];

    let tabledata = Object.values(this.state.phantoms.Data.reduce(function(carry, item) {
      carry[item.visit_label] = [
        item.visit_label,
        item.insert_date,
      ];
      return carry;
    }, {})).map(function (row) {
      return row.concat(['123','abc']);
    });

    return (
      <div>
        <PhantomsFilters updateFilter={this.updateFilter} form={this.state.phantoms.form} filter={this.state.filter}/>
        <PhantomsDataTable data={tabledata} headers={tableheaders} filter={this.state.filter}/>
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
