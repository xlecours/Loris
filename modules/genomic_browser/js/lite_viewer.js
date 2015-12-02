    document.getElementById("update").onclick = showData;
    

    function showData() {

        console.log('showData');
        var inputValues = {
            chromosome: "1",
            startLoc: 1,
            endLoc: 100000000
        };
        $.ajax({
          url: "AjaxHelper.php?Module=genomic_browser&script=getOldFormat.php",
          type: 'post',
          data: inputValues,
          success: function(data) {
              console.log(JSON.stringify(data));
              c3.generate({
                  bindto: '#chart-placeholder-1',
                  size: {height: 480},
                  data: {
                      json: data,
                      keys: {
                          x: 'CpG',
                          value: ['Male','Female']
                      },
                      type: 'bar'
                  },  
                  axis: {
                      x: {
                          tick: {
                              fit: false 
                          },
                          min: inputValues.Start_loc,
                          max: inputValues.End_loc
                      },  
                      y: {
                          max: 1,
                          min: 0
                      }   
                  },  
                  bar: {
                      zerobased: false,
                      width: {ratio: 0.5}
                  },
                  subchart: { show: true },
                  grid: {
                      y: {
                          lines: [
                              {value: 0.6, class: 'treshhold', text: 'hypermethylated'},
                              {value: 0.2, class: 'treshhold', text: 'hypomethylated'},
                          ]   
                      }   
                  }
              });              
          }   
        });

        React.render(React.createElement(GenomicViewer, { DataURL: 'AjaxHelper.php?Module=genomic_browser&script=getBetaValues.php' }), document.getElementById('chart-placeholder-2'));
    }
