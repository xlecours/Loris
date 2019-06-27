import React, {Component} from 'react';

/**
 * Open Profile Form
 *
 * Module component rendering the Open Profile Form
 *
 */
class OpenProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {
        message: '',
        className: 'alert alert-danger text-center',
      },
      PSCID: '',
      CandID: '',
    };

    this.updateFormElement = this.updateFormElement.bind(this);
    this.validateAndSubmit = this.validateAndSubmit.bind(this);
  }

  updateFormElement(formElement, value) {
    let state = this.state;
    state[formElement] = value;
    this.setState(state);
  }

  validateAndSubmit() {
    let state = this.state;
    if (this.state.CandID === '') {
      state.error = {
        message: 'You must enter a DCCID!',
        className: 'alert alert-danger text-center',
      };
      this.setState(state);
      return;
    }

    if (this.state.PSCID === '') {
      state.error = {
        message: 'You must enter a PSCID!',
        className: 'alert alert-danger text-center',
      };
      this.setState(state);
      return;
    }

    // Always include a validating message.. the callback for the ajax request will
    // update it after the ajax call returns.
    state.error = {
      message: 'Validating...',
      className: 'alert alert-info text-center',
    };
    this.setState(state);

    fetch(loris.BaseURL + '/api/v0.0.2/candidates/' + state.CandID)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.Meta.PSCID !== state.PSCID) {
          throw new Error();
        }
        window.location.href = loris.BaseURL + '/' + state.CandID;
      })
      .catch((error) => {
        this.setState({error: {
          message: 'DCCID or PSCID is not valid',
          className: 'alert alert-danger text-center',
        }});
      });
  }

  render() {
    let warning;

    if (this.state.error.message !== '') {
      warning = (
              <div className={this.state.error.className}>
                {this.state.error.message}
              </div>
      );
    }
    return (
      <FormElement name='openprofile' onSubmit={this.validateAndSubmit}>
        <TextboxElement
          name='CandID'
          label='DCCID'
          value={this.state.CandID}
          onUserInput={this.updateFormElement}
        />
        <TextboxElement
          name='PSCID'
          label='PSCID'
          value={this.state.PSCID}
          onUserInput={this.updateFormElement}
        />
        {warning}
        <ButtonElement
          name='Open Profile'
          label='Open Profile'
          type='submit'
        />
        </FormElement>
    );
  }
}

export default OpenProfileForm;
