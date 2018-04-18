import BoutiqueToHtml from './BoutiqueToHtml';

/**
 * Entry point of the module.
 * Renders directory_manager on page load
 */
$(function() {
  const dataURL = loris.BaseURL.concat("/boutiquehtml/?format=json");
  const app = (
    <div>
    <BoutiqueToHtml
      url={dataURL}
    />
    </div>
  );
  ReactDOM.render(app, document.getElementById("lorisworkspace"));
});
