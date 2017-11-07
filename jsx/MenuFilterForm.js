import FilterForm from 'FilterForm';

class MenuFilterForm extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = [];

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }    

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  fetchData() {
    const url = loris.BaseURL.concat("/",this.props.moduleName, "/?format=json");
    $.ajax(url, {
      method: "GET",
      dataType: 'json',
      success: function(data) {
        this.setState({
          Data: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      }
    });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    const refName = this.props.moduleName.concat("_filter_form");
    this.refs[refName].clearFilter();
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }
    
    const moduleName = this.props.moduleName;
    const filterFormName = moduleName.concat("_filter_form");

    return (
      <div id={this.props.name}>
        <FilterForm
          Module={moduleName}
          name={filterFormName}
          id={filterFormName}
          ref={filterFormName}
          columns={3}
          formElements={this.state.Data.form}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <ButtonElement ref="" label="Clear Filters" type="reset" onUserInput={this.resetFilters}/>
        </FilterForm>
        <StaticDataTable
          Data={this.state.Data.Data}
          Headers={this.state.Data.Headers}
          Filter={this.state.filter}
          getFormattedCell={this.props.formatColumn}
        />
      </div>
    );
  }
}

MenuFilterForm.propTypes = {
  moduleName: React.PropTypes.string.isRequired
};

export default MenuFilterForm;

