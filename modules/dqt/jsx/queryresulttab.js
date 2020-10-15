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
class QueryResultTab extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const rows = this.props.data.map((x, i) => {
        return <p key={i}>{x}</p>;
    });
    return (
      <div>
        <h3>Query Result Tab</h3>
        {rows}
      </div>
    );
  }
}

export default QueryResultTab;
