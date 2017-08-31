class PCEVPipelineIndex extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      form: {}
    };

    this.getToolForm = this.getToolForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onloadstartHandler = this.onloadstartHandler.bind(this);
  }

  componentDidMount() {
    this.getToolForm();
  }

  getToolForm() {
    $.ajax(this.props.DataURL.concat('?format=json'), {
      method: "GET",
      accepts : {
        json: "application/json"
      },
      dataType: 'json',
      success: function(data) {
        this.setState({
          form: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    const form = document.getElementById('pcev_pipeline_form');
    const formData = new FormData(form);

    const self = this;

    xhr.upload.addEventListener('loadstart', this.onloadstartHandler, false);
    xhr.upload.addEventListener('progress', onprogressHandler, false);
//    xhr.upload.addEventListener('load', onloadHandler, false);
//    xhr.addEventListener('readystatechange', onreadystatechangeHandler, false)

    xhr.open('POST', this.props.DataURL, true);
    xhr.send(formData);
  }

  onloadstartHandler(evt) {
    console.log('started');
  }

  render() {
    let elements = Object.keys(this.state.form).map(function(key, index) {
      const item =  this.state.form[key];
      return <div key={'e_'.concat(index)}><label htmlFor={item.name}>{item.label}</label><div dangerouslySetInnerHTML={{__html: item.html}} /></div>;
    }, this);

    elements.push(<input type='submit' key='submit'/>);
    elements.push(<input type='text' name='bob' key='bob'/>);

    return (
      <div>
        <h2>PCEV Pipeline</h2>
        <h3>Inputs</h3>
        <FormElement
          id="pcev_pipeline_form"
          name="PCEV_Pipeline"
          onSubmit={this.handleSubmit}
          ref="form"
        >
          {elements}
        </FormElement>
      </div>
    );
  }
}

$(function() {
  const app = (
    <PCEVPipelineIndex DataURL={`${loris.BaseURL}/tools/PCEV_Pipeline/`} />
  );

  ReactDOM.render(app, document.getElementById("lorisworkspace"));
});

