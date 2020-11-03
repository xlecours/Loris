import {Component} from 'react';

/**
 * FieldItem Component
 *
 * The following component is used for displaying individual fields
 */
class FieldListItem extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let classList = 'list-group-item row';
    let downloadIcon = '';

    if (this.props.selected != undefined) {
      // If field is selected, add active class and visits
      classList += ' active';
    }

    if (this.props.downloadable != undefined) {
      // Add download icon if field is downloadable
      downloadIcon = (
        <span className='glyphicon glyphicon-download-alt pull-right'
              title='Downloadable File'/>
      );
    }
    // Don't display the category in the field selector
    let fieldName = this.props.FieldName;

    return (
      <div className={classList} onClick={() => this.props.onClick(fieldName)}>
        <div className='col-xs-8'>
          <h4 className='list-group-item-heading col-xs-12'>
            {fieldName}{downloadIcon}
          </h4>
          <span className='col-xs-12'>{this.props.Description}</span>
        </div>
      </div>
    );
  }
}

export default FieldListItem;
