import React, {Component} from 'react';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import FixConflict from './fix_conflict';

class ConflictsFilterableDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    switch (column) {
      case 'Correct Answer':
        const values = [
          {name: '1', value: rowData['Value 1']},
          {name: '2', value: rowData['Value 2']},
        ];
        return (
          <FixConflict conflictid={rowData['Conflict ID']} values={values} />
        );
    }
    return (
      <td>{cell}</td>
    );
  }
  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(loris.BaseURL.concat('/conflict_resolver?format=json'), {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  render() {
    // If error occurs, return a message.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.data.fieldOptions;

    const fields = [
      {label: 'Conflict ID', show: false, filter: {
        name: 'ConflictID',
        type: 'text',
      }},
      {label: 'Project', show: true, filter: {
        name: 'Project',
        type: 'select',
        options: options.project,
      }},
      {label: 'Site', show: true, filter: {
        name: 'Site',
        type: 'select',
        options: options.site,
      }},
      {label: 'CandID', show: true, filter: {
        name: 'CandID',
        type: 'text',
        value: '300001',
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'PSCID',
        type: 'text',
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'VisitLabel',
        type: 'select',
        options: options.visitLabel,
      }},
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instrument,
      }},
      {label: 'Question', show: true, filter: {
        name: 'Question',
        type: 'text',
      }},
      {label: 'Value 1', show: true, filter: {
        name: 'Value1',
        type: 'text',
      }},
      {label: 'Value 2', show: true, filter: {
        name: 'Value2',
        type: 'text',
      }},
      {label: 'Correct Answer', show: true},
    ];

    return (
      <FilterableDataTable
        name="unresolved"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

export default ConflictsFilterableDataTable;
