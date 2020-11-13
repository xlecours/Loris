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
    const history = this.props.queries.history.map((x, i) => {
        return <p key={i}>{x.creationTimestamp}</p>;
    });
    const saved = this.props.queries.saved.map((x, i) => {
        return <p key={i}>{x.name}</p>;
    });
    const shared = this.props.queries.shared.map((x, i) => {
        return <p key={i}>{x.name}</p>;
    });
    return (
      <div>
        <h3>Queries</h3>
        <h5>History</h5>
        {history}
        <h5>Saved</h5>
        {saved}
        <h5>Shared</h5>
        {shared}
      </div>
    );
  }
}

SavedQueries.defaultProps = {
  queries: {
    history: [],
    saved: [],
    shared: [],
  },
};

export default SavedQueries;
