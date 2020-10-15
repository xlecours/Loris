/*
 *  The following component is for saved queries dropdown
 *  which appears in the tab bar of the base component.
 */
import React, {Component} from 'react';

/**
 * DQT component
 *
 * The following component is the data queries base element.
 */
class SavedQueries extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const queries = this.props.queries.map((x, i) => {
        return <p key={i}>{x}</p>;
    });
    return (
      <div>
        <h3>Saved Queries</h3>
        {queries}
      </div>
    );
  }
}

export default SavedQueries;
