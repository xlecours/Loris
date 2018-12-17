import React, {Component} from 'react';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class GenomicBrowserIndex extends Component {
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


  fetchData() {
    const url = loris.BaseURL.concat('/genomic_browser?format=json');
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    return result;
  }

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

   /**
    * XXX: Currently, the order of these fields MUST match the order of the
    * queried columns in _setupVariables() in media.class.inc
    */
    const options = {
      sites: {1: 'AAA', 2: 'BBB'},
      gender: {1: 'Female', 2: 'Male'},
      subprojects: {1: 'Control', 2: 'Exp'},
      anynone: {'Y': 'Any', 'N': 'None'},
    };

    const fields = [
      {label: 'Site', show: true, filter: {
        name: 'centerID',
        type: 'select',
        options: options.sites,
      }},
      {label: 'DCCID', show: true, filter: {
        name: 'dccid',
        type: 'text',
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: 'Gender', show: true, filter: {
        name: 'gender',
        type: 'select',
        options: options.gender,
      }},
      {label: 'Subproject', show: true, filter: {
        name: 'SubprojectID',
        type: 'select',
        options: options.subprojects,
      }},
      {label: 'Date of Birth', show: true, filter: {
        name: 'DoB',
        type: 'text',
      }},
      {label: 'External ID', show: true, filter: {
        name: 'instrument',
        type: 'text',
      }},
      {label: 'Files', show: true, filter: {
        name: 'Files',
        type: 'select',
        options: options.anynone,
      }},
      {label: 'CPG', show: true, filter: {
        name: 'CPGs',
        type: 'select',
        options: options.anynone,
      }},
      {label: 'SNP', show: true, filter: {
        name: 'SNPs',
        type: 'select',
        options: options.anynone,
      }},
      {label: 'CNV', show: true, filter: {
        name: 'CNVs',
        type: 'select',
        options: options.anynone,
      }},
    ];

    return (
      <FilterableDataTable
        name="profile"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
      />
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <GenomicBrowserIndex />,
    document.getElementById('lorisworkspace')
  );
});
