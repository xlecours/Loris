import {Component} from 'react';
import FieldListItem from './fieldlistitem';

/**
 * FieldList Component
 *
 * The following component is used for displaying the list of available fields for
 * the selected category
 */
class FieldList extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const fields = this.props.fields.map((x, i) => {
      return (
        <FieldListItem key={x.name}
          FieldName={x.name}
          Category={'category_name'}
          Description={x.desc}
          ValueType={x.type}
          onClick={this.props.onUserInput}
          selected={x.selected != undefined}
          downloadable={x.isFile != undefined}
          Visits={[]}
          selectedVisits={[]}
          fieldVisitSelect={[]}
        />
      );
    });

    return (
      <div className='list-group col-md-9 col-sm-12'>
        {fields}
      </div>
    );
  }
}

export default FieldList;
