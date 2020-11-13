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
      query: {
        fields: [],
        filters: [],
      },
      data: [],
    };

    this.fetchData = this.fetchData.bind(this);
    this.fetchSavedQueries = this.fetchSavedQueries.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.sendQuery = this.sendQuery.bind(this);
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
          query: responses[0].history[0].query,
          categories: responses[1],
      });
      // TODO remove query: responses[0].query after DEV
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
      .then((data) => data.categories)
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Send the query to the backend
   */
  sendQuery() {
    fetch(
      '/dqt/search', {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(this.state.query),
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json.rows});
      })
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

    return (
      <div>
        <SavedQueries queries={this.state.savedQueries}/>
        <FieldsSelectorTab categories={categories}/>
        <AddFiltersTab categories={categories}/>
        <QueryResultTab
          sendQuery={this.sendQuery}
          fields={this.state.query.fields}
          data={this.state.data}
        />
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
