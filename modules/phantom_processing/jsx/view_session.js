import PhantomSession from  './phantom_session.js';
import PhantomImages from  './phantom_images.js';
import PhantomProcessing from './phantom_processing.js';
/**
 * Renders the phantom session information, images and server processes
 *
 * @author Xavier Lecours Boucher
 * @version 1.0.0
 *
 *
 */
class ViewSession extends  React.Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.getSessionDetails= this.getSessionDetails.bind(this);
  }

  componentDidMount() {
    this.getSessionDetails();
  }

  getSessionDetails() {
    const sessionId = (new URL(window.location.href)).searchParams.get('session_id');
    this.setState({sessionId});
  }

  render() {
    return (
      <div>
      <PhantomSession />
      <PhantomImages />
      <PhantomProcessing />
      </div>
    );
  }
}

ViewSession.propTypes = {};

document.addEventListener('DOMContentLoaded', function(){
  ReactDOM.render(
    <ViewSession />,
    document.getElementById('lorisworkspace')
  );
});
