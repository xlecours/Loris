import PropTypes from 'prop-types';

/**
 * Search Component
 * React wrapper for a searchable dropdown
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
const SearchableDropdown = (props) => {
  const optionList = Object.keys(props.options).map(function(option) {
    return (
      <option value={props.options[option]} key={option}/>
    );
  });

  return (
    <>
      <div className='container-fluid'
           style={{margin: '0 auto', maxWidth: '900px'}}>
        <div className='form-group has-feedback'>
          <div className='input-group'>
            <span className='input-group-addon'
                  style={{
                    height: '50px',
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: '25px',
                    borderBottomLeftRadius: '25px',
                  }}
            >
              <span className='glyphicon glyphicon-hand-right'/>
            </span>
            <form>
              <input type='text'
                name={props.name + '_input'}
                id={props.id}
                list={props.name + '_list'}
                className='form-control'
                disabled={null}
                placeholder={props.placeHolder}
                onChange={props.onUserInput}
                onBlur={console.info}
                required={true}
                style={{
                  height: '50px',
                  borderLeft: '0',
                  fontSize: '16pt',
                  borderTopRightRadius: '25px',
                  borderBottomRightRadius: '25px',
                }}
              />
            </form>
          </div>
        </div>
        <datalist id={props.name + '_list'}>
          {optionList}
        </datalist>
      </div>
    </>
  );
};

SearchableDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  id: PropTypes.string,
  // strictSearch, if set to true, will require that only options
  // provided in the options prop can be submitted
  strictSearch: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  class: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeHolder: PropTypes.string,
  onUserInput: PropTypes.func,
};

SearchableDropdown.defaultProps = {
  name: '',
  options: {},
  strictSearch: true,
  label: '',
  value: undefined,
  id: null,
  class: '',
  disabled: false,
  required: false,
  sortByValue: true,
  errorMessage: '',
  placeHolder: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

export default SearchableDropdown;
