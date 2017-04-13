import Dataprovider from './Dataprovider';

/**
 * Entry point of the module.
 * Renders directory_manager on page load
 */
$(function() {
  const dataURL = loris.BaseURL + "/directory_manager/?format=json";
  const appContainer = (
    <div id="page-directory-manager">
      <Dataprovider
        dataURL={dataURL}
        module="directory_manager"
      />
    </div>
  );
  ReactDOM.render(appContainer, document.getElementById("lorisworkspace"));
});
