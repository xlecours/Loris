#!/bin/bash
#curl -X PUT admin:password@127.0.0.1:5984/test_epi
curl -X PUT admin:password@127.0.0.1:5984/test_epi/_design/datasets -H 'Content-Type: application/json' --data `modules/genomic_browser/couchdb/design_documents/datasets.js`
