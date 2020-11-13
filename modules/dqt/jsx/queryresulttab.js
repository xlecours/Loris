/*
 *  The following component is for saved queries dropdown
 *  which appears in the tab bar of the base component.
 */
import React, {Component} from 'react';
import StaticDataTable from 'StaticDataTable';

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
    const headers = this.props.fields.map((f) => {
      return f.category.concat(',', f.field);
    });

    const rows = this.props.data.map((r) => {
        return Object.values(r.data);
    });

    const identifiers = Object.keys(this.props.data.reduce((carry, item) => {
      const pscid = item.key[1];
      const visit = item.key[2];
      const key = pscid.concat(',', visit);
      carry[key] = true;
      return carry;
    }, {}));

    return (
      <div>
        <h3>Query Result Tab</h3>
        <button onClick={this.props.sendQuery}/>
        <StaticDataTable
          Headers={headers}
          RowNumLabel='Identifiers'
          Data={rows}
          RowNameMap={identifiers}
        />
      </div>
    );
  }
}

QueryResultTab.defaultProps = {
  fields: [],
  data: [],
};
export default QueryResultTab;
