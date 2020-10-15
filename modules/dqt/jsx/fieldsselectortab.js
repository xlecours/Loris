/*
 *  The following component is for saved queries dropdown
 *  which appears in the tab bar of the base component.
 */
import {Component} from 'react';
import SearchableDropdown from './components/searchabledropdown';
import FieldList from './components/fieldlist';

/**
 * DQT component
 *
 * The following component is the data queries base element.
 */
class FieldsSelectorTab extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null,
      selectedField: null,
    };

    this.handleCategorySelect = this.handleCategorySelect.bind(this);
    this.handleFieldSelect = this.handleFieldSelect.bind(this);
  }

  /**
   * Alter state
   * @param {object} e - An event
   */
  handleCategorySelect(e) {
    this.setState({
      selectedCategory: e.currentTarget.value,
    });
  }

  /**
   * Alter state
   * @param {string} fieldName - The selected field name
   */
  handleFieldSelect(fieldName) {
    this.setState({
      selectedField: fieldName,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const options = this.props.categories.reduce((carry, item) => {
      carry[item.name] = item.name;
      return carry;
    }, {});

    let fields = [];
    if (this.state.selectedCategory != null) {
        let cat = this.props.categories.filter(( category ) => {
          return category.name == this.state.selectedCategory;
        }).pop();
        if (cat != undefined) {
          fields = cat.fields.map(( field ) => {
            if (field.name == this.state.selectedField) {
              field.selected = true;
            }
            return field;
          });
        }
    }

    return (
      <div>
        <h3>Fields Selector Tab</h3>
        <div className='row' style={{marginTop: '20px'}}>
          <SearchableDropdown
            name='fieldsDropdown'
            options={options}
            onUserInput={this.handleCategorySelect}
            placeHolder='Select a Category or Instrument'
          />
          <FieldList
            fields={fields}
            onUserInput={this.handleFieldSelect}
          />
        </div>
      </div>
    );
  }
}

export default FieldsSelectorTab;
