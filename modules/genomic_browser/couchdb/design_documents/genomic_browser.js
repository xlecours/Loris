{
   "_id": "_design/genomic_browser",
   "_rev": "126-66da0faf6f8a05558a1e1d624cdf1b99",
   "language": "javascript",
   "views": {
       "sample_label_by_dataset": {
           "map": "function(doc) {\n    if (typeof doc.meta.doctype != \"undefined\" && doc.meta.doctype == 'dataset') {\n        var sample_labels = doc.headers.slice(doc.headers.length - doc.meta.sample_count);\n        emit( [doc.meta.variable_type,doc.loris_file_id], sample_labels);\n    }\n}",
           "reduce": "function(keys, values, rereduce) {\n    if (rereduce) {\n        return sum(values);\n    }\n    return values.length;\n}"
       },
       "variable_type_by_sample": {
           "map": "function(doc) {\n    if (typeof doc.meta.doctype != \"undefined\" && doc.meta.doctype == 'dataset') {\n        var sample_labels = doc.headers.slice(doc.headers.length - doc.meta.sample_count);\n        sample_labels.forEach(function (sample_label) {\n            var key = [sample_label, doc.meta.variable_type, doc.loris_file_id];\n            emit(key, null);\n        });\n    }\n}",
           "reduce": "_count"
       },
       "variable_value_by_identifier": {
           "map": "function(doc) {\n  if (doc.meta && doc.meta.doctype && doc.meta.doctype == 'variable') {\n    if (doc.values && Array.isArray(doc.values)) {\n      doc.values.forEach(function(v,i) {\n        emit([doc.meta.identifier.genomic_file_id, doc.meta.identifier.variable_name, i], v);\n      })\n    }\n  }\n}",
           "reduce": "_count"
       },
       "variable_property_by_identifier": {
           "map": "function(doc) {\n  if (doc.meta && doc.meta.doctype && doc.meta.doctype === 'variable') {\n    var key = [doc.meta.identifier.variable_type, doc.meta.identifier.genomic_file_id, doc.meta.identifier.variable_name];    \n    var value = {};\n    for (var p in doc.meta.identifier) {\n      if (['variable_type','genomic_file_id'].indexOf(p) === -1) {\n        value[p] = doc.meta.identifier[p];\n      }\n    }\n    for (var p in doc.properties) {\n       value[p] = doc.properties[p];\n    } \n    emit(key, value);\n  }\n}",
           "reduce": "_count"
       },
       "variable_property": {
           "map": "function(doc) {\n  if (doc.meta && doc.meta.doctype && doc.meta.doctype === 'variable') {\n    Object.keys(doc.meta.identifier).forEach(function(k) {\n      if (k !== 'variable_type' && k !== 'genomic_file_id') {\n        var key = [doc.meta.identifier.variable_type, doc.meta.identifier.genomic_file_id, k];\n        emit(key, doc.meta.identifier[k]);\n      }\n    },this);\n    Object.keys(doc.properties).forEach(function(k) {\n      var key = [doc.meta.identifier.variable_type, doc.meta.identifier.genomic_file_id, k];\n      emit(key, doc.properties[k]);\n    },this);\n  }\n}",
           "reduce": "_count"
       }
   },
   "lists": {
       "by_sample_index": "function (head, req) {    start({'headers' : {'Content-Type': 'application/json'}}); if(req.query.sample_indexes) { var sample_indexes = JSON.parse(req.query.sample_indexes); if (Array.isArray(sample_indexes)) { if (/variable_value_by_identifier.*group_level=3/.test(req.raw_path)) { while(row = getRow()) { if( sample_indexes.indexOf(row.key[2]) !== -1) {send(JSON.stringify(row))};}} else {send(JSON.stringify({error: 'bad request'}))}} else {send(JSON.stringify({error: 'sample_indexes must be an array'}));} } else {send(JSON.stringify({error: 'missing parameter: sample_indexes'}));} }",
       "distinct_value": "function (head, req) {start({'headers' : {'Content-Type': 'application/json'}}); var values = {}; while(row = getRow()) {values[row.value] = true;} send(JSON.stringify(Object.keys(values)));}"
   }
}
