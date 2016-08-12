{
   "_id": "_design/genomic_browser",
   "_rev": "7-62d17d4a7e47b7e841475d5afca2eb53",
   "language": "javascript",
   "views": {
       "sample_label_by_dataset": {
           "map": "function(doc) {if (typeof doc.meta.doctype != \"undefined\" && doc.meta.doctype == 'dataset') {var sample_labels = doc.headers.slice(doc.headers.length - doc.meta.sample_count); emit( [doc.meta.variable_type,doc.loris_file_id], sample_labels);}}",
           "reduce": "function(keys, values, rereduce) {if (rereduce) { return sum(values);} return values.length;}"
       },
       "variable_type_by_sample": {
           "map": "function(doc) {if (typeof doc.meta.doctype != \"undefined\" && doc.meta.doctype == 'dataset') {var sample_labels = doc.headers.slice(doc.headers.length - doc.meta.sample_count); sample_labels.forEach(function (sample_label) { var key = [sample_label, doc.meta.variable_type, doc.loris_file_id]; emit(key, doc._id);});}}",
           "reduce": "_count"
       }
   }
}
