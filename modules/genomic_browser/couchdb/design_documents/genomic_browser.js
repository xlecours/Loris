{
   "_id": "_design/genomic_browser",
   "_rev": "96-9591fd7a65646cd34b186963d7add021",
   "language": "javascript",
   "views": {
       "sample_label_by_dataset": {
           "map": "function(doc) {\n    if (typeof doc.meta.doctype != \"undefined\" && doc.meta.doctype == 'dataset') {\n        var sample_labels = doc.headers.slice(doc.headers.length - doc.meta.sample_count);\n        emit( [doc.meta.variable_type,doc.loris_file_id], sample_labels);\n    }\n}",
           "reduce": "function(keys, values, rereduce) {\n    if (rereduce) {\n        return sum(values);\n    }\n    return values.length;\n}"
       },
       "variable_type_by_sample": {
           "map": "function(doc) {\n    if (typeof doc.meta.doctype != \"undefined\" && doc.meta.doctype == 'dataset') {\n        var sample_labels = doc.headers.slice(doc.headers.length - doc.meta.sample_count);\n        sample_labels.forEach(function (sample_label) {\n            var key = [sample_label, doc.meta.variable_type, doc.loris_file_id];\n            emit(key, doc._id);\n        });\n    }\n}",
           "reduce": "_count"
       },
       "variable_value_by_sample": {
           "map": "function(doc) {\n  if (doc.meta && doc.meta.doctype && doc.meta.doctype == 'variable') {\n    if (doc.values && Array.isArray(doc.values)) {\n      doc.values.forEach(function(v,i) {\n        emit([doc._id, i], v);\n      })\n    }\n  }\n}",
           "reduce": "_count"
       }
   },
   "lists": {
       "by_sample_index": "function (head, req) {    start({'headers' : {'Content-Type': 'application/json'}}); if(req.query.sample_indexes) { var sample_indexes = JSON.parse(req.query.sample_indexes); if (Array.isArray(sample_indexes)) { if (/variable_value_by_sample.*group_level=2/.test(req.raw_path)) { while(row = getRow()) { if( sample_indexes.indexOf(row.key[1]) !== -1) {send(JSON.stringify(row))};}} else {send(JSON.stringify({error: 'bad request'}))}} else {send(JSON.stringify({error: 'sample_indexes must be an array'}));} } else {send(JSON.stringify({error: 'missing parameter: sample_indexes'}));} }"
   }
}
