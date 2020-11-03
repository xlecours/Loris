/**
 *  The following file contains the base component for the data query react app.
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
import React, {Component} from 'react';
import SavedQueries from './savedqueries';
import FieldsSelectorTab from './fieldsselectortab';
import AddFiltersTab from './addfilterstab';
import QueryResultTab from './queryresulttab';

/**
 * DQT component
 *
 * The following component is the data queries base element.
 */
class DQT extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      savedQueries: [],
      categories: [],
      data: [],
    };

    this.fetchData = this.fetchData.bind(this);
    this.fetchSavedQueries = this.fetchSavedQueries.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data and save it in state
   */
  fetchData() {
    const promises = [
        this.fetchSavedQueries(),
        this.fetchCategories(),
    ];

    Promise.all(promises).then((responses) => {
      this.setState({
          loaded: true,
          savedQueries: responses[0],
          categories: responses[1],
      });
    });
  }

  /**
   * Get saved queries
   *
   * @return {object}
   */
  fetchSavedQueries() {
    return fetch('/dqt/queries', {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => data.queries)
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   *  Get categories
   *
   * @return {object}
   */
  fetchCategories() {
    return fetch(
      '/dqt/categories', {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (!this.state.loaded) {
      return <h1>Loading...</h1>;
    }

    let categories = this.state.categories;
/*
    categories = [
      {name: 'aosi'},
      {name: 'bmi', selected: true, fields: [
        {name: 'A', desc: 'Un A majuscule', type: 'text'},
      ]},
      {name: 'demographics', numFields: 28},
      {name: 'FinalRadiologicalReview', numFields: 17},
      {name: 'medical_history', numFields: 29},
      {name: 'mri_data', numFields: 361},
      {name: 'mri_parameter_form', numFields: 45},
      {name: 'radiology_review', numFields: 18},
      {name: 'test_minimal', numFields: 5},
    ];
*/
    return (
      <div>
        <SavedQueries queries={this.state.savedQueries}/>
        <FieldsSelectorTab categories={categories}/>
        <AddFiltersTab categories={categories}/>
        <QueryResultTab data={this.state.data}/>
      </div>
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <DQT/>,
    document.getElementById('lorisworkspace')
  );
});
