import FilterForm from 'FilterForm';
import {TextAreaInput} from 'Form';

/**
 * Filters for phantom processing
 *
 * Provide the FilterForm for phantom processing menu filtering
 *
 * @author Xavier Lecours Boucher
 * @version 1.0.0
 *
 * */
class PhantomsFilters extends React.Component {
  constructor(props) {
    super(props);

    this.resetFilter = this.resetFilter.bind(this);
  }

  resetFilter() {
    this.refs.phantomsFilters.clearFilter();
  }

  render() {
    return (
      <FilterForm
        Module="phantom_processing"
        name="phantomsFilters"
        id="phantomsFilters"
        ref="phantomsFilters"
        columns={3}
        formElements={this.props.form}
        onUpdate={this.props.updateFilter}
        filter={this.props.filter}
      >
        <ButtonElement
          label="Clear Filters"
          type="reset"
          onUserInput={this.resetFilter}
        />
      </FilterForm>
    );
  }
}

export default PhantomsFilters;

