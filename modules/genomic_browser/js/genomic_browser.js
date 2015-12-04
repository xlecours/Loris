// Make dashboard panels collapsible
$('document').ready(function() {

    // Make the panels toggle on click.
    $('.panel-clickable').on("click", function () {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-body').slideDown();
            $(this).removeClass('panel-collapsed');
        } else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-body').slideUp();
            $(this).addClass('panel-collapsed');
        }
        $(this).find('.glyphicon-chevron-up').toggle();
        $(this).find('.glyphicon-chevron-down').toggle();
    });

});

function hideFilterCandidate() {
    "use strict";
    $("#panel-body-candidate").toggle();
    $("#down-candidate").toggle();
    $("#up-candidate").toggle();
}

function hideFilterGene() {
    "use strict";
    $("#panel-body-gene").toggle();
    $("#down-gene").toggle();
    $("#up-gene").toggle();
}

function hideFilterSNP() {
    "use strict";
    $("#panel-body-snp").toggle();
    $("#down-snp").toggle();
    $("#up-snp").toggle();
}

function hideFilterCNV() {
    "use strict";
    $("#panel-body-cnv").toggle();
    $("#down-cnv").toggle();
    $("#up-cnv").toggle();
}
