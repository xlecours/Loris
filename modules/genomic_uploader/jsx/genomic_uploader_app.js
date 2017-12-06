import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

class GenomicUploaderApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
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
    this.refs.mediaFilter.clearFilter();
  }


  /**
   * Modify behaviour of specified column cells in the Data Table component
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {arrray} rowData - array of cell contents for a specific row
   * @param {arrray} rowHeaders - array of table headers (column names)
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    return <td>{cell}</td>;
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

    let tabList = [
      {id: "browse", label: "Browse"}
    ];

    let uploadTab;
    if (loris.userHasPermission('genomic_write')) {
      tabList.push({id: "upload", label: "Upload"});
      uploadTab = (
        <TabPane TabId="upload">
          <MediaUploadForm
            DataURL={`${loris.BaseURL}/media/ajax/FileUpload.php?action=getData`}
            action={`${loris.BaseURL}/media/ajax/FileUpload.php?action=upload`}
            maxUploadSize={this.state.Data.maxUploadSize}
          />
        </TabPane>
      );
    }

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="genomic_uploader"
            name="genomic-file-filter-form"
            id="genomic-file-filter-form"
            ref="genomic-file-filter"
            columns={3}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters}/>
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        {uploadTab}
      </Tabs>
    );
}
