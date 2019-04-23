/*global document: false, $: false*/
$(document).ready(function() {

var scanLineChart, recruitmentPieChart, recruitmentBarChart, recruitmentLineChart;

// Colours for all charts broken down by only by site
var siteColours = [
    '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
    '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
    '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
];

// Colours for the recruitment bar chart: breakdown by gender
var genderColours = ['#2FA4E7', '#1C70B6'];

$(document).ready(function () {
    "use strict";
    // Turn on the tooltip for the progress bar - shows total male and female registered candidates
    $('.progress-bar').tooltip();

    // Make dashboard panels collapsible
    $('.panel-heading span.clickable').on("click", function () {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-body').slideDown();
            $(this).removeClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        } else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-body').slideUp();
            $(this).addClass('panel-collapsed');
            $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });

    // Open the appropriate charts from the "views" dropdown menus
    $(".dropdown-menu a").click(function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
        $($(this).parent().siblings().children("a")).each(function () {
            $(document.getElementById(this.getAttribute('data-target'))).addClass("hidden");
        });
        $(document.getElementById(this.getAttribute('data-target'))).removeClass("hidden");

        /* Make sure the chart variables are defined before resizing
         * They may not be defined on initial page load because they are created through
         * an AJAX request.
         */
        if (typeof recruitmentPieChart !== 'undefined') {
            recruitmentPieChart.resize();
        }
        if (typeof recruitmentBarChart !== 'undefined') {
            recruitmentBarChart.resize();
        }
        if (typeof recruitmentLineChart !== 'undefined') {
            recruitmentLineChart.resize();
        }
        if (typeof scanLineChart !== 'undefined') {
            scanLineChart.resize();
        }
    });

    $(".new-scans").click(function(e) {
        e.preventDefault();
        applyFilter('imaging_browser', {"Pending" : "PN"});
    });

    $(".pending-accounts").click(function(e) {
        e.preventDefault();
        applyFilter('user_accounts', {"pending" : "Y"});
    });
});

function applyFilter(test_name, filters) {
    var form = $('<form />', {
        "action" : loris.BaseURL + "/" + test_name + "/",
        "method" : "post"
    });

    var values = {
        "reset" : "true",
        "filter" : "Show Data"
    }

    $.extend(values, filters);

    $.each(values, function(name, value) {
        $("<input />", {
            type: 'hidden',
            name: name,
            value: value
        }).appendTo(form);
    });

    form.appendTo('body').submit();
}

function formatPieData(data) {
    "use strict";
    var processedData = new Array();
    for (var i in data) {
        var siteData = [data[i].label, data[i].total];
        processedData.push(siteData);
    }
    return processedData;
}
function formatBarData(data) {
    "use strict";
    var processedData = new Array();
    var females = ['Female'];
    processedData.push(females.concat(data.datasets.female));
    var males = ['Male'];
    processedData.push(males.concat(data.datasets.male));
    return processedData;
}
function formatBarDataSecond(data) {
  "use strict";
  var processedData = new Array();
  var females = ['Female'];
  processedData.push('55 to 60', '60 to 65', '65 to 70', '70 to 75', '75 to 80', '80 to 90');
  return processedData;
}
function formatLineData(data) {
    "use strict";
    var processedData = new Array();
    var labels = new Array();
    labels.push('x');
    for (var i in data.labels) {
        labels.push(data.labels[i]);
    }
    processedData.push(labels);
    for (var i in data.datasets) {
        var dataset = new Array();
        dataset.push(data.datasets[i].name);
        processedData.push(dataset.concat(data.datasets[i].data));
    }
    return processedData;
}

// AJAX to get scan line chart data
$.ajax({
    url: loris.BaseURL + '/dashboard/ajax/get_scan_line_data.php',
    type: 'post',
    success: function(data) {
        var scanLineData = formatLineData(data);
        scanLineChart = c3.generate({
            bindto: '#scanChart',
            data: {
                x: 'x',
                xFormat: '%m-%Y',
                columns: scanLineData,
                type: 'area-spline'
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m-%Y'
                    }
                },
                y: {
                    label: 'Scans'
                }
            },
            zoom: {
                enabled: true
            },
            color: {
                pattern: siteColours
            }
        });
    },
    error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
    }
});

// AJAX to get pie chart data
$.ajax({
    url: loris.BaseURL + '/dashboard/ajax/get_handedness_pie_data.php',
    type: 'post',
        success: function(data) {
        var jsonData = $.parseJSON(data);
        var recruitmentPieData = formatPieData(jsonData);
        recruitmentPieChart = c3.generate({
            bindto: '#handednessPieChart',
            data: {
                columns: recruitmentPieData,
                type : 'pie',
              labels: true,
            },
            color: {
                pattern: siteColours
            },
          oninit: function () {
            this.meetsArcLabelThreshold = function () { return true; };
          }
        });
    },
    error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
    }
});

// AJAX to get pie chart data
  $.ajax({
    url: loris.BaseURL + '/dashboard/ajax/get_language_pie_data.php',
    type: 'post',
    success: function(data) {
      var jsonData = $.parseJSON(data);
      var recruitmentPieData = formatPieData(jsonData);
      recruitmentPieChart = c3.generate({
        bindto: '#languagePieChart',
        data: {
          columns: recruitmentPieData,
          type : 'pie'
        },
        color: {
          pattern: siteColours
        },
        labels: true,
      });
    },
    error: function(xhr, desc, err) {
      console.log(xhr);
      console.log("Details: " + desc + "\nError:" + err);
    }
  });

// AJAX to get pie chart data
  $.ajax({
    url: loris.BaseURL + '/dashboard/ajax/get_age_pie_data.php',
    type: 'post',
    success: function(data) {
      var jsonData = $.parseJSON(data);
      var recruitmentPieData = formatPieData(jsonData);
      recruitmentPieChart = c3.generate({
        bindto: '#agePieChart',
        data: {
          columns: recruitmentPieData,
          type : 'pie'
        },
        color: {
          pattern: siteColours
        }
      });
    },
    error: function(xhr, desc, err) {
      console.log(xhr);
      console.log("Details: " + desc + "\nError:" + err);
    }
  });

// AJAX to get bar chart data
$.ajax({
    url: loris.BaseURL + '/dashboard/ajax/get_cohort_progression_bar_data.php',
    type: 'post',
    success: function(data) {
      let keys = Object.keys(data.datasets);
      let subkeys = Object.keys(data.datasets[keys[0]]);
      let tmpvalues = {};
      for (var i=0; i<subkeys.length; i++) {
        tmpvalues[subkeys[i]] = [subkeys[i]];
        for (var j=0; j<Object.keys(data.datasets).length; j++) {
          let tmp = data.datasets[keys[j]];
          tmpvalues[subkeys[i]].push(tmp[subkeys[i]]);
        }
      }
      let yay = [];
      let yayyay = [];
      for (var i=0; i<Object.keys(tmpvalues).length; i++) {
        yay.push(
          tmpvalues[subkeys[i]]
        );
        yayyay.push(subkeys[i]);
      }
        recruitmentBarChart = c3.generate({
            bindto: '#cohortProgressionBarChart',
            data: {
                columns: yay,
                type: 'bar',
              labels: true,
              groups: [yayyay]
            },
            axis: {
                x: {
                    type : 'categorized',
                    categories: data.labels,
                },
                y: {
                    label: 'Number of MRI session per cohort'
                }
            },
            color: {
                pattern: genderColours
            },

        });
    },
    error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
    }
});

// AJAX to get bar chart data
$.ajax({
  url: loris.BaseURL + '/dashboard/ajax/get_age_bar_data.php',
  type: 'post',
  success: function(data) {
    var recruitmentBarLabels = data.labels;
    recruitmentBarChart = c3.generate({
      bindto: '#ageBarChart',
      data: {
        columns: [
          ['Age', '55-60', '60-65', '65-70', '70-75', '75-80', '80-90'],
          ['Total', data.datasets['55-60'], data.datasets['60-65'], data.datasets['65-70'], data.datasets['70-75'], data.datasets['75-80'], data.datasets['80-90']]
        ],
        type: 'bar'
      },
      axis: {
        x: {
          type : 'categorized',
          categories: recruitmentBarLabels
        },
        y: {
          label: 'Candidates registered'
        }
      },
      bar: {
        width: {
          ratio: 1 // this makes bar width 50% of length between ticks
        }
      },
      color: {
        pattern: ['#2FA4E7']
      },
      legend: {
        show: false,
        item: { onclick: function () {} }
      }
    });
  },
  error: function(xhr, desc, err) {
    console.log(xhr);
    console.log("Details: " + desc + "\nError:" + err);
  }
});

// AJAX to get recruitment line chart data
$.ajax({
    url: loris.BaseURL + '/dashboard/ajax/get_recruitment_line_data.php',
    type: 'post',
    success: function(data) {
        var recruitmentLineData = formatLineData(data);
        recruitmentLineChart = c3.generate({
            bindto: '#recruitmentChart',
            data: {
                x: 'x',
                xFormat: '%m-%Y',
                columns: recruitmentLineData,
                type: 'area-spline'
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m-%Y'
                    }
                },
                y: {
                    label: 'Candidates registered'
                }
            },
            zoom: {
                enabled: true
            },
            color: {
                pattern: siteColours
            }
        });
    },
    error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
    }
});
});
