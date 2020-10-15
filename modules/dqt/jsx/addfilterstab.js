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
class AddFiltersTab extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const categories = this.props.categories.map((x, i) => {
        return <p key={i}>{x.name}</p>;
    });
    return (
      <div>
        <h3>AddFiltersTab</h3>
        {categories}
      </div>
    );
  }
}

export default AddFiltersTab;
