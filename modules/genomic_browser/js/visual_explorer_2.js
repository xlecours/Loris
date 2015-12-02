/*
 * Visual explorer
 *
 *
 */


// TODO : switch function from object to their prototypes
// TODO : comparison of web workers, direct access and php (load and parse)
// TODO : Adapt to singletons


// Object literal
var myModule = (function () {

    var genomicData = {
        organism: "Human",
        build: "GRCh37/hg19",
        chromosomes: {},
        addChromosome: function (chromosomeLabel) {
            this.chromosomes[chromosomeLabel] = new Chromosome(chromosomeLabel);;
        },
        addGene: function (chromosomeLabel, gene) {
            if( typeof chromosomeLabel == "string" &&
                typeof gene == "object" &&
                typeof gene.name == "string" ) {
                this.chromosomes[chromosomeLabel].addGene(gene);
            } else {
                console.error("genomicData.addGenes arguments types error");
            }
        },
        getGeneCoordinates: function (chromosomeLabel, geneName) {
            return this.chromosomes[chromosomeLabel].getGeneCoordinates(geneName);
        },
        getGenesLabels: function (chromosomeLabel) {
            if( typeof chromosomeLabel == "string") {
                return this.chromosomes[chromosomeLabel].getGenesNames();
            } else {
                 console.error("genomicData.getGenesLabels arguments types error");
            }
            
        },
        whatIsBetween: function( chr, start, end) {
            var obj = {};
            obj["genes"] = this.chromosomes[chr].genesSet.whatIsBetween(start, end);
            obj["cpgs"] = [];
            for( cpgLabel in genomicData.chromosomes[chr].cpgs) {
                var cpgObj = genomicData.chromosomes[chr].cpgs[cpgLabel];
                if( cpgObj.position >= start && cpgObj.position <= end ) {
                    obj["cpgs"].push( $.extend( { cpgLabel: cpgLabel} , cpgObj));
                }
            }
            // TODO SNP, exons, cpgIsland
            return obj;
        }
    };

    // This object contains all the necesary data to display the chart.
    var displayedData = {
        genomicRange: {
            chromosome: "",
            startLoc: 0,
            endLoc: 0
        },
        genomicFeatures: [],
        sampleLabels: [],
        betaValues: {},
        getFeatures: function() {
            // TODO : Find a way to show all the transcripts
            return this.genomicFeatures[0];
        },
        createChart: function() {
            return {
                bindto: '#chart-placeholder',
                onrendered: setTimeout(featuresStyling, 500),
                size: {height: 480},
                data: {
                    json: this.betaValues,
                    keys: {
                        x: 'position',
                        value: samplesData.labels
                    },
                    type: 'bar'
                },
                axis: {
                    x: {
                        tick: {
                            fit: false,
                        },
                        min: this.genomicRange.startLoc,
                        max: this.genomicRange.endLoc
                    },
                    y: {
                        max: 1,
                        min: 0,
                        padding: {top:0, bottom:0}
                    }
                },
                bar: {
                    zerobased: false,
                    width: {ratio: 0.01}
                },
                subchart: { show: true },
                regions: this.getFeatures(),
                grid: {
                    y: {
                        lines: [
                            {value: 0.6, class: 'treshhold', text: 'hypermethylated'},
                            {value: 0.2, class: 'treshhold', text: 'hypomethylated'},
                        ]
                    }
                }
            };
        }
    };

    var samplesData = {
        labels: [],
        betaValues: {},
        getBetaValuesByCpg: function(cpgArray) {
            bv = [];
            cpgArray.forEach( function (cpg) {
                bv.push($.extend(cpg, samplesData.betaValues[cpg.cpgLabel]));
            });
            return bv;
        }
    };

    // Four required inputs
    var chromosomeInput = {};
    var geneInput = {};
    var coordinatesInput = {startLoc: {}, endLoc: {}}
    var updateButton = {};
    var fileInput = {};

    function createCpg( label, position ) {
        var cpg = {};
        cpg[label] = {
            position: Number(position)
        };
        return cpg;
    }

    function Chromosome(label) {
        if( typeof label == "string" ) {
            this.label = label;
            this.genesSet = new GenesSet();
            this.getGeneCoordinates = function(geneName) {
                return this.genesSet.getGeneCoordinates(geneName);
            };
            this.getGenesNames = function(){ 
                return Object.keys(this.genesSet);
            };
            this.addGene = function (gene) {
                this.genesSet.addGene(gene);
            };
        } else {
            console.error("Chromosome constructor arguments types error");
        }
    }

    function GenesSet() {
        this.addGene = function(gene) {
            if( this[gene.name] == undefined) {
                this[gene.name] = gene; 
            } else {
                gene.transcripts.forEach(function(t) {
                    this[gene.name].addTranscript(t);
                }, this);
            }

        };
        this.getGeneCoordinates = function(geneName) {
            return this[geneName].getGenomicRange();
        };
        this.whatIsBetween = function(start, end) {
            var genes = [];
            for(var geneLabel in this) {
                // TODO put the function property in the prototype Object; this validation won't be necessary anymore 
                if( typeof this[geneLabel].strand == "string" ) {
                    if(this[geneLabel].appearsBetween(start, end)) {
                        genes.push(this[geneLabel]);
                    }
                }
            }
            return genes;
        };
    }

    function Gene(name, chrom, strand) {
        if( typeof name == "string" &&
            typeof chrom == "string" &&
            typeof strand == "string" ) {

            this.name = name;
            this.chrom = chrom;
            this.strand = strand;
            this.transcripts = [];
            
            /*
            This function return the widest range of the transcription sequences
            of all the transcripts of this gene.
            return ex: {chromosome: 'chrY', startLoc: 123456, endLoc: 234567}
            */
            this.getGenomicRange = function() {
                var startLoc = Number.MAX_VALUE, endLoc = 0;
                return this.transcripts.reduce( function(o,v,i) {
                   o.startLoc = Math.min(v.txStart, o.startLoc);
                   o.endLoc   = Math.max(v.txEnd, o.endLoc);
                   return o;
                }, {chromosome: this.chrom, startLoc: startLoc, endLoc: endLoc})
            };
            this.addTranscript = function(transcript) {
                this.transcripts.push(transcript);
            };
            this.appearsBetween = function(start, end) {
                var genomicRange = this.getGenomicRange(); 
                return ((genomicRange.startLoc >= start && genomicRange.startLoc <= end) ||
                        (genomicRange.endLoc >= start && genomicRange.endLoc <= end));
            };
            this.toChartRegions = function() {
                return this.transcripts.reduce(function(o,v,i) {
                    o.push(v.toChartRegions());
                    return o;
                },[]);
            };

        } else {
          console.error("Gene constructor arguments types error");
        }
    }

    function Transcript(name, txStart, txEnd, cdsStart, cdsEnd, exonStarts, exonEnds) {
        if( typeof name == "string" &&
            typeof txStart == "number" &&
            typeof txEnd == "number" &&
            typeof cdsStart == "number" &&
            typeof cdsEnd == "number" &&
            typeof exonStarts == "object" &&
            typeof exonEnds == "object") {

            this.name = name;
            this.txStart = txStart;
            this.txEnd = txEnd;
            this.cdsStart = cdsStart;
            this.cdsEnd = cdsEnd;
            this.exons = [];

            if( exonStarts.length === exonEnds.length) {
                for( var i in exonStarts ) {
                    if( exonStarts[i] !== 0 && exonEnds[i] !== 0 ) {
                        this.exons.push({start: exonStarts[i], end: exonEnds[i]});
                    }
                }
            } else {
                console.error("Transcript : The number of starts and ends of exons differs");
            }

            this.toChartRegions = function() {
                return this.exons.reduce( function(o,v,i) {
                    o.push({
                        start: v.start,
                        end: v.end,
                        class: 'exon'
                    });
                    return o;
                }, [{start: this.txStart, end:this.txEnd, class: 'transcript'}]);
            };
        } else {
          console.error("Transcript: Constructor arguments types error");
        }
    }

    // Utility functions
    function emptySelect(selectInput) {
        var selectParentNode = selectInput.parentNode;
        var newSelectInput = selectInput.cloneNode(false); 

        selectParentNode.replaceChild(newSelectInput, selectInput);
    }

    function loadChromosomes() {
        // Different organisms have different set of chromosomes
        switch(genomicData.organism) {
            case "Human":
                var chrom =['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','X','Y'];
                for( i in chrom ) {
                    genomicData.addChromosome(chrom[i]);
                } 
            break;
            default:
                console.error("Undefined organism");
                return false;
        }
    }

    function getChromosomesLabels() {
        return Object.keys(genomicData.chromosomes);
    }

    function updateGenesSelect() {
        // First, clear the existing options by creating a new select. 
        if( geneInput.childElementCount > 0) {
            var parentNode = geneInput.parentNode;
            var newInput = geneInput.cloneNode(false);
            parentNode.replaceChild(newInput,geneInput);
            geneInput = newInput;
            geneInput.onclick= setCoordinatesByGene;
            coordinatesInput.startLoc.value = "";
            coordinatesInput.endLoc.value = "";
        }

        loadGenes(chromosomeInput.value);
        loadCpgs(chromosomeInput.value);
    }

    /*
     * This function assume that the genes list are contained in 
     * a diffent file for each chromosomes. The file should be tab separeted
     * with the following headers :gene_id name name chrom strand txStart txEnd cdsStart cdsEnd exonCount exonStarts exonEnds
     *
     * After the file parsing, each gene is add to the select input
     * and to its chromosome in the genomicData.
     */
    function TIMED_loadGenes(chromosomeLabel) {
        var start = 0;
        var stop = 0;
        var worker = new Worker('getJS.php?Module=genomic_browser&file=webWorkerGetReferenceFile.js');
        worker.onmessage = function(event) {
            stop = new Date().getTime();
            console.log("Time to send message to worker: "+ (event.data.messageReceived - start));
            console.log("Time to send Ajax request by the worker: "+ (event.data.requestSent - event.data.messageReceived));
            console.log("Time to receive response from the server: "+ (event.data.responseReceived - event.data.requestSent));
            console.log("Time to receive message from the worker: "+ (stop - event.data.responseReceived));
            console.log("Time total: "+ (stop - start));
            worker.terminate();
            worker = undefined;
        };
        
        start = new Date().getTime();
        worker.postMessage("testBetaValues_2.tsv");
// testBetaValues_200.tsv
// [Error] Failed to load resource: the server responded with a status of 500 (Internal Server Error) (AjaxHelper.php, line 0)
// PHP Fatal error:  Allowed memory size of 134217728 bytes exhausted (tried to allocate 881422336 bytes)
//
// php.ini
// output_buffering = 4096
// zlib.output_compression = Off
// max_execution_time = 30
// memory_limit = 128M --> changed to 1024M


        //worker.postMessage("genes_" + chromosomeLabel + ".tsv");
    }

    function loadGenes(chromosomeLabel) {
        $.ajax({
            url: "AjaxHelper.php?Module=genomic_browser&script=getReference.php&fileName=genes_chr" + chromosomeLabel + ".tsv",
            data: {fileName: "genes_chr" + chromosomeLabel + ".tsv"},
            type: 'post',
            //url: "AjaxHelper.php?Module=genomic_browser&script=GetReference.php&fileName=genes_" + chromosomeLabel + ".tsv",
            success: function(data) {
                // TODO Add validation on the headers. transcripts are optionnal.
                // split the whole text per line and remove the first line (headers)
                var lineArray = data.split('\n').splice(1);

                // Create and return a genesSet by transforming each line into a transcript of a gene.
                lineArray.forEach( function( line ) {
                    var fields = line.split('\t');
                    if( typeof fields[1] === "string" ) {
                        // Gene(name, chrom, strand, transcripts)
                        var gene = new Gene(fields[1],fields[3],fields[4],[]);
                        // Transcript(name, txStart, txEnd, cdsStart, cdsEnd, exonStarts, exonEnds)
                        var transcript = new Transcript(fields[2],Number(fields[5]),Number(fields[6]),Number(fields[7]),Number(fields[8]),fields[10].split(',').map(Number),fields[11].split(',').map(Number))
                        gene.transcripts.push(transcript);
                        genomicData.addGene(chromosomeLabel, gene)
                    }
                });
            },
            error: function(xhr, desc, err) {
                console.log(xhr);
                console.error("Details: " + desc + "\nError:" + err);
            }
        }).done( function() {
            geneInput = document.getElementsByName("Gene")[0];
            genomicData.getGenesLabels(chromosomeLabel).sort().forEach( function (label, index){
                var opt = document.createElement("option");
                opt.value = label;
                opt.text = label;
                geneInput.add(opt)
            });
        });
    }
/*
    function getGenesLabels(chromosomeLabel) {
        return Object.keys(genomicData.chromosomes[chromosomeLabel].genes);
    }
*/    
    function setCoordinatesByGene() {
        var coordinates = genomicData.getGeneCoordinates(chromosomeInput.value, this.value);
        coordinatesInput.startLoc.value = coordinates.startLoc;
        coordinatesInput.endLoc.value = coordinates.endLoc;
    }

    /* 
     * This function fetch the cpg list of the selected chromosome  from 
     * a reference file and fill the "genomicData.Chromosome" with it. 
     */
    // Tab separated expected header : CpG, Chr, Position
    function loadCpgs(chromosomeLabel) {
        $.ajax({
            url: "AjaxHelper.php?Module=genomic_browser&script=getReference.php&fileName=/cpg450k_chr" + chromosomeLabel + "_pos.tsv",
            success: function(data) {
                // TODO Add validation on the headers. transcripts are optionnal.
                // split the whole text per line and remove the first line (headers)
                var lineArray = data.split('\n').splice(1);

                // Create and return a cpgsSet by transforming each line into a cpg.
                var cpgsSet = lineArray.reduce( function( o, v, i) {
                    var fields = v.split('\t');
                    if( typeof fields[2] === "string" ) {
                        var cpg = createCpg(fields[0],fields[2]);
                        $.extend(o, cpg);
                    }
                    return o;
                }, {});
                genomicData.chromosomes[chromosomeLabel].cpgs = cpgsSet;
            }
        });
    }

    function inputsAreValid() {
        // TODO
        return true;
    }

    function drawMethylationChart() {
        if( inputsAreValid() ) {
            //chart.update();
            c3.generate(displayedData.createChart()); 
            //c3.generate(chart);
        }
    }

    function getInputValues() {
        return {
            chromosome: chromosomeInput.value,
            startLoc: coordinatesInput.startLoc.value,
            endLoc: coordinatesInput.endLoc.value,
            gene: geneInput.value
        };
    }

    function updateBetaValues(evt) {
         var files = evt.target.files; // FileList object

         // files is a FileList of File objects. List some properties.
         var output = [];
         for (var i = 0, f; f = files[i]; i++) {
             output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                       f.size, ' bytes, last modified: ',
                       f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                       '</li>');
             // Filter on file type.
             //if (!f.type.match('image.*')) {
             //    continue;
             //}

             var reader = new FileReader();

             reader.onloadstart = (function(theFile) {
                 console.log("onloadstart");
                 // TODO Progress bar
             });
             reader.onprogress = (function(theFile) {
                 console.log("onprogress");
                 // TODO Progress bar
             });
             reader.onabort = (function(theFile) {
                 console.log("onabort");
             });
             reader.onerror = (function(theFile) {
                 console.log("onerror");
                 // TODO Add error catching
             });
             reader.onloadend = (function(theFile) {
                 console.log("onloadend");
                 // TODO Progress bar
             });

             // When the load finishes, the reader's onload event is fired
             // Its result attribute can be used to access the file data.
             reader.onload = (function(theFile) {
                 console.log("onload");
                 return function(e) {
                     d3.select("#list ul")
                         .append("li")
                         .text( theFile.name + " loaded!" );

                     samplesData["betaValues"] = parseInputedBetaValues(e.target);
                 };
             })(f);



             // Read in the image file as a text string.
             reader.readAsText(f);
             // Other reading methode could be used : readAsDataURL, readAsArrayBuffer or readAsBinaryString.
             // If zipped for instance...

             // TODO Further steps :
             // - Use workers
         }
         document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    }

    function parseInputedBetaValues(fileReader, delim ) {
        // TODO delim ...
        delim = ",";
        var bv = {};
        var rows = fileReader.result.split("\n");
        var columns = (rows[0].split(delim));
        samplesData["labels"] = columns.slice(1);
        var nbSamples = columns.length -1;
        console.log("The ID column label is : '" + columns[0] + "'");
        console.log("There is " + nbSamples + " sample(s)");

        var nbProbes = rows.length - 1 ;
        console.log("There is " + nbProbes + " probe(s)");
        console.log("The last line is : " + rows[nbProbes -1]);

        var line = [];
        for (var i=1; i<nbProbes; i++) {
            var cpg_text = '';;
            var cpg = Object();
            line =  rows[i].trim().split(delim) ;
            cpg_text += '{"' + line[0].trim() + '": {';
            for (var j=1 ; j<=nbSamples; j++) {
                cpg_text += '"' + columns[j] + '": "' + line[j].trim() + '",';
            }
            cpg_text += '"mean": ' + '1';
            cpg_text += '}}';
            cpg = JSON.parse(cpg_text);
            $.extend(bv,cpg);
        }
        return bv;
    }

    function setDisplayedData(inputs) {
        objToShow = genomicData.whatIsBetween(inputs.chromosome, inputs.startLoc, inputs.endLoc);
        displayedData.sampleLabels = samplesData.labels;
        displayedData.genomicRange = {
            chromosome: inputs.chromosome,
            startLoc: Number(inputs.startLoc),
            endLoc: Number(inputs.endLoc)
        };
        if(objToShow.cpgs.length > 0) {
            displayedData.betaValues = samplesData.getBetaValuesByCpg( objToShow.cpgs )
        }
        if(objToShow.genes.length > 0) {
            displayedData.genomicFeatures = [];
            objToShow.genes.forEach( function(gene) {
                displayedData.genomicFeatures = displayedData.genomicFeatures.concat(gene.toChartRegions());
            });
        }
    }

    function featuresStyling() {
        // Adjust transcripts heigth
        var exons = document.getElementsByClassName('exon');
        var exonsCount = exons.length;
        for( var i=0; i<exonsCount; i++) {
            exons[i].firstChild.setAttribute("height", "25px");
        }
        var transcripts = document.getElementsByClassName('transcript');
        var transcriptsCount = transcripts.length;
        for( var i=0; i<transcriptsCount; i++) {
            transcripts[i].firstChild.setAttribute("height", "25px");
        }
    }

    function showData() {

        console.log('showData');
        var inputValues = getInputValues();
        

        $.ajax({
          url: "AjaxHelper.php?Module=genomic_browser&script=getOldFormat.php",
          type: 'post',
          data: inputValues,
          success: function(data) {
              console.log(JSON.stringify(data));
              c3.generate({
                  bindto: '#chart-placeholder',
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

        //setDisplayedData(getInputValues());
        //setTimeout(drawMethylationChart(), 250);
        //featuresStyling();
    }

    // The returned value are all the public variables and function available.
    return {
        init: function() {
            // Keep a reference ont he required inputs
            chromosomeInput = document.getElementsByName("Chromosome")[0];
            coordinatesInput.startLoc = document.getElementsByName("Start_loc")[0];
            coordinatesInput.endLoc = document.getElementsByName("End_loc")[0];
            updateButton = document.getElementById("update");
            geneInput = document.getElementsByName("Gene")[0];
            // TODO :: Add validation on the presence of those inputs

            // Add event listener to the inputs
            chromosomeInput.onclick = updateGenesSelect;
            geneInput.onclick = setCoordinatesByGene;
            fileInput.onchange = updateBetaValues;
            updateButton.onclick = showData;

            loadChromosomes();
            
        },
        getStatus: function() {
            return {
                genomicData: genomicData,
                displayedData: displayedData,
                samplesData: samplesData,
            };
        } 
    }; 
})();

/*
 * Data fetching functions
 *
 * The data fetching functions use files in a specific directory to
 * acces references data for the assay and fill the "awesome.cpgs" with it.
 * 
 * Chromosomes : The list depends of the assembly number.
 *     ex : GRCh37 : homo-sapiens build 37
 *          GRCm38 : mus musculus build 38
 * 
 * Genes : 
 * 
 * 
 * 
 */

document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
  console.log('Ready!');
  myModule.init();
});

/*
* handleFileSelect receive a envent from an input file and display some properties.
* -- http://www.html5rocks.com/en/tutorials/file/filesystem-sync/
*/
function WORKER_updateBetaValues(evt) {
    var files = evt.target.files; // FileList object
    for (var i = 0, f; f = files[i]; i++) {
        var w = new Worker("../modules/genomic_browser/js/ww_bata_values_parser.js");
        w.onmessage = function(event) {
            document.getElementById("list").innerHTML = event.data;
        };
        w.postMessage(f);
    }
}


/**
if( unitTests ) {
    //Chromosome unitTests
    var t1 = new Transcript('NM_012227',171416,180887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    var t2 = new Transcript('NM_012228',161416,170887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    var g1 = new Gene('PLCXD1', 'chrY','+', [t1,t2])
    var t3 = new Transcript('NM_012229',171416,180887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    var t4 = new Transcript('NM_012230',161416,170887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    var g2 = new Gene('PLCXD2', 'chrY','+', [t3,t4]);
    chr = new Chromosome('chr1', [g1,g2]);
    console.log(chr);
    console.log(chr.getGenesNames());
}

if( unitTests ) {
    //Gene unitTests
    // requires transcipt unitest successful
    var t1 = new Transcript('NM_012227',171416,180887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,
180887]);
    var t2 = new Transcript('NM_012227',161416,170887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    var g1 = new Gene('PLCXD1', 'chrY','+', [t1,t2])
    console.log(g1);
    console.log(g1.getGenomicRange());
}

if( unitTests ) {
    //Transcript unitTests
    var t1 = new Transcript('NM_012227',171416,180887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    // Should work
    console.log(typeof t1 == "object");
    var t4 = Transcript('NM_012227',171416,180887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591,180887]);
    // Should work but exons should be an empty array
    console.log(t4);
    var t2 = Transcript('NM_012227',171416,180887,171740,180887,[171416,174026,174398,178085,179432,180816],[171864,174179,174547,178294,179591]);
    console.log(t2);
    var t3 = Transcript();
    console.log(t3);
}
*/
