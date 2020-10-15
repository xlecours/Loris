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
    let criteria;
    let multiselect;

    if (this.props.selected) {
      // If field is selected, add active class and visits
      classList += ' active';
      multiselect = Object.keys(this.props.Visits).map((visit) => {
        let checked = false;
        if (this.props.selectedVisits[visit]) {
          checked = true;
        }
        return (
          <div key={visit} className='checkbox'>
            <label>
              <input
                type='checkbox'
                value={visit}
                checked={checked}
                onChange={this.visitSelect}
              />
              {visit}
            </label>
          </div>
        );
      });
    }

    if (this.props.downloadable) {
      // Add download icon if field is downloadable
      downloadIcon = (
        <span className='glyphicon glyphicon-download-alt pull-right'
              title='Downloadable File'/>
      );
    }
    // Don't display the category in the field selector
    let displayName = this.props.FieldName;

    return (
      <div className={classList}
           onClick={() => this.props.onClick(this.props.FieldName)}
           style={{cursor: 'pointer'}}>
        <div className='col-xs-8'>
          <h4 className='list-group-item-heading col-xs-12'>
            {displayName}{criteria}{downloadIcon}
          </h4>
          <span className='col-xs-12'>{this.props.Description}</span>
        </div>
        <div className='col-xs-4 fieldVisitsRow'
             onClick={(e) => e.stopPropagation()}>
          {multiselect}
        </div>
      </div>
    );
  }
}

export default FieldListItem;
