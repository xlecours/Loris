# LORIS API - v0.0.3-dev

## 1.0 Overview

This document specifies the LORIS REST API and current recommendations on its use.

Any request sent to `$LorisRoot/api/$APIVERSION/$API_CALL` will return either a JSON object
or no data. The LORIS API uses standard HTTP error codes and the body of any response will
either be empty or contain only a JSON object for any request.

For brevity, the `$LorisRoot/api/$APIVERSION` is omitted from the definitions in this
document. This document specifies $APIVERSION v0.0.3-dev and it
MUST be included before the request in all requests.

HTTP GET requests NEVER modify data. PUT, POST or PATCH requested are not supported
in this instance of LORIS except for login. Any methods not supported
will receive a 405 Method Not Allowed response and an appropriate Allow header set (as
per HTTP documentation.)

All GET requests include an ETag header.

DELETE is not supported on any resource defined in this API.

### 1.1 Authentication

If a user is logged in to LORIS and can be authenticated using the standard session mechanism,
no further authentication is required.

If a user is not logged in to LORIS (for instance, in a third party app or a CORS application),
they can be authenticated using [JSON Web Tokens](https://jwt.io).

The client should POST a request to /login with a payload of the form:

```js
{
    "username" : username,
    "password" : password
}
```

If the username and password are valid, the API will respond with a 200 OK and payload
of the form:

```js
{
    "token" : /* JWT token */
}
```

Otherwise, it will return a 401 Unauthorized response.

If the token is returned, it should be included in an "Authorization: Bearer token" header
for any future requests to authenticate the request.

## 2.0 Project API

The Project API lives under the /projects portion of the API URL hierarchy. It is used to get
project specific settings or data. PUT and PATCH are not supported for the part of
the API living under /projects.

```
GET /projects
```

Will return a list of projects in this LORIS instance. There is no corresponding PUT or PATCH
request. The JSON returned is of the form:

```js
{
    "Projects" : {
        "ProjectName1" : {
            "PSCID" : PSCIDSettings
        },
        "ProjectName2" : {
            "PSCID" : PSCIDSettings
        },
        ...
}
```

If the LORIS instance does not use projects, the API will return a single project called "loris"
with the appropriate settings for the LORIS instance.

PSCID represents a JSON object with the configuration settings for PSCIDs in this
project (those settings are not relevant for users wanting to download and access data).


### 2.1 Single project

```
GET /projects/$ProjectName
```

Returns a 200 OK response if the project exists, and 404 Not Found if it does not (the same is
true of any portion of the API under /projects/$ProjectName.)

The body of the request to /projects/$ProjectName will be an entity of the form:

```js
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Visits" : ["PREEN00", "PREBL00", ... ],
    "Instruments" : ["InstrumentName", "InstrumentName2", ...],
    "Candidates" : ["1235413", "5231234", ...]
}
```

#### 2.1.1 Single project images
```
GET /projects/$ProjectName/images/
```

Will return a JSON object of the form:

```js
{
  "Images" : [
    {
      "Candidate": "1234567",
      "PSCID": "CONP0000001",
      "Visit": "PREBL00",
      "Visit_date": "2016-08-09", /* The date of the session. */
      "Site": "Montreal",
      "ScanType": "t2w", /* Acquisition protocol */
      "QC_status": "Pass|Fail|null",
      "Selected": "true|false|null",
      "Link": "\/candidates\/1234567\/PREBL00\/images\/loris-MRI_1234567_PREBL00_t2w_001.mnc", /* URL relative to this API */
      "InsertTime": "2016-08-09T14:15:30-05:00" /* The inserted date ISO 8601 */
    },
    ...
  ]
}
```
It is possible to provide a GET parameter named `since` where the value need to be a date or datetime.
```
ex: 2016-08-09 or 2016-08-09 10:00:00 or 2016-08-09T10:00:00-05:00
```
We recommend using a format that includes timezone.

#### 2.1.2 Single project instruments  
```
GET /projects/$ProjectName/instruments/
```

Will return a JSON object of the form:

```js
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Instruments": {
        "InstrumentName" : {
            "FullName" :  "Long Name",
            "Subgroup" : "Subgroup Name",
            "DoubleDataEntryEnabled" : boolean
        },
        "Instrument2" : {
            "FullName" :  "Long Name",
            "Subgroup" : "Subgroup Name",
            "DoubleDataEntryEnabled" : boolean
        },
        ...
    }
}
```

Where the InstrumentNames are the "Short Name" of all the instruments used/installed in this project.

#### 2.1.3 Single project visits  
```
GET /projects/$ProjectName/visits/
```

Will return a JSON object of the form:

```js
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Visits" : ["PREEN00", "PREBL00", ... ],
}
```

Where PREEN00, PREBL00, ... are the visits that may exist for this project

#### 2.1.4 Single project candidates  
```
GET /projects/$ProjectName/candidates/
```

will return a JSON object of the form:

```js
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Candidates" : ["1234567", "3423323", ... ],
}
```

where 123456, 342332, etc are the candidates that exist for this project.

### 2.2 Instrument Forms

```
GET /projects/$ProjectName/instruments/$InstrumentName
```

Will return a 200 response on success and 404 Not Found if $InstrumentName is not a
valid instrument for this instance of LORIS.

This will return a JSON representation of the instrument form. If available, rules and form will
be combined into a single JSON object. The format for the JSON returned is specified in the
accompanying InstrumentFormat.md and RulesFormat.md documents. The JSON document can be used
to render the form by a client.

PUT and PATCH are not supported for instrument forms.

Methods for getting data from specific candidates are specified in section 3.

## 3.0 Candidate API

The /candidate portion of the API is used for retrieving candidate data and
data attached to a specific candidate or visit such as visits or instrument data. Portions
of this reference a CandidateObject. A CandidateObject is a JSON object of the form:

```js
{
        "CandID"  : CandID,
        "Project" : ProjectName,
        "PSCID"   : PSCID,
        "Site"    : Site,
        "DoB"     : "YYYY-MM-DD",
        "Gender"  : "Male|Female",
        "Language": "French|English"
}
```

representing a candidate in LORIS.

```
GET /candidates/
```

will return a JSON object of the form:

```js
{
    "Candidates" : [CandidateObject1, CandidateObject2, CandidateObject3, ...]
}
```

containing ALL candidates present in this LORIS instance.

POST / PUT / PATCH methods are not supported on /candidate.

### 3.1 Specific Candidate

If a GET request for a candidate is issued such as

```
GET /candidates/$CandID
```

A JSON object representing that candidate will be returned.

The JSON object is of the form:

```js
{
    "Meta" : CandidateObject,
    "Visits" : ["PREEN00", "PREBL00", ...]
}
```

where V1, V2, etc are the visit labels that are registered for this candidate.

PUT / PATCH / POST are not supported for candidates.

It will return a 200 OK on success, a 404 if the candidate does not exist, and
a 400 Bad Request if the CandID is invalid (not a 6 digit integer). The same is
true of all of the API hierarchy under /candidates/$CandID.

### 3.2 Getting Candidate visit data

A GET request of the form:

```
GET /candidates/$CandID/$VisitLabel
```

Will return a JSON object of the metadata for that candidate's visit.

The JSON object is of the form:

```js
{
    "Meta" : {
        "CandID"    : CandID,
        "Visit"     : VisitLabel,
        "Site"      : SiteName,
        "Battery"   : "NameOfSubproject",
        "Age_at_MRI": "Candidate_age_at_MRI_scan"
    },
    "Stages" : {
        "Screening" :  {
            "Date" : "YYYY-MM-DD",
            "Status" : "Pass|Failure|Withdrawal|In Progress"
        },
        "Visit" : {
            "Date" : "YYYY-MM-DD",
            "Status" : "Pass|Failure|Withdrawal|In Progress"
        },
        "Approval" : {
            "Date" : "YYYY-MM-DD",
            "Status" : "Pass|Failure|Withdrawal|In Progress"
        }
    }
}
```


It will return a 404 Not Found if the visit label does not exist for this candidate
(as well as anything under the /candidates/$CandID/$VisitLabel hierarchy)

POST / PUT / PATCH are not supported for Visit Labels.


### 3.3 Candidate Instruments
```
GET /candidates/$CandID/$VisitLabel/instruments
```

Will return a JSON object of the form:

```js
{
    "Meta" : {
        "CandID" : CandID,
        "Visit"  : VisitLabel
    },
    "Instruments" : [ "InstrumentName", "AnotherInstrument", ...]
}
```

Where the instruments array represents the instruments that were administered for that
candidate at that visit. InstrumentNames are the short names and the forms for them
SHOULD all be retrievable through the `project` portion of the API.

PUT / PATCH / POST are not supported for candidate instruments.

#### 3.3.1 The Candidate Instrument Data

```
GET /candidates/$CandID/$VisitLabel/instruments/$InstrumentName
```

The format returned by a GET request is a JSON document of the form:

```js
{
    "Meta" : {
        "Instrument" : $InstrumentName,
        "Visit" : $VisitLabel,
        "Candidate" : $CandID,
        "DDE" : boolean
    },
    "$InstrumentName" : {
        "FieldName1" : "Value1",
        "FieldName2" : "Value2",
        ...
    }
}
```

Including the values of ALL fields for this instrument, including score field values.

PUT / PATCH / POST are not supported for instrument data.

A 200 OK will be returned on success, and a 404 Not Found if $InstrumentName is not a valid instrument installed in this LORIS instance.

#### 3.3.2 Instrument Flags
```
GET /candidates/$CandID/$VisitLabel/instruments/$InstrumentName/flags
```

This URL is used to GET flags for an instrument. The standard GET rules apply.

The format of the JSON object for these URLS is:

```js
{
    "Meta" : {
        "Candidate"  : CandID,
        "Visit"      : VisitLabel,
        "Instrument" : InstrumentName,
    },
    "Flags" : {
        "Data_entry" : "In Progress|Complete",
        "Administration" : "None|Partial|All",
    }
}
```

## 4.0 Imaging Data

The imaging data mostly lives in the `/candidates/$CandID/$Visit` portion of the REST API
namespace, but is defined in a separate section of this document for clarity purposes.

### 4.1 Candidate Images
```
GET /candidates/$CandID/$Visit/images
```

A GET request to `/candidates/$CandID/$Visit/images` will return a JSON object of
all the images which have been acquired for that visit. It will return an object of
the form:

```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel,
    },
    "Files" : [{
        "OutputType" : "native",
        "Filename" : "abc.mnc",
        "AcquisitionType" : "t1w/t2w/etc",
    }, /* More files */]
}
```

### 4.2 Session Imaging QC
```
GET /candidates/$CandID/$Visit/qc/imaging
PUT /candidates/$CandID/$Visit/qc/imaging
```

To retrieve the session level imaging QC data for a visit, a request can
be made `/candidates/$CandID/$Visit/qc/imaging`. It will return a JSON object
of the form:

```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel
    },
   "SessionQC" : "Pass|Fail"
   "Pending" : boolean
}
```

PUT is not supported for the session level imaging QC.

### 4.3 Image Level Data
```
GET /candidates/$CandID/$VisitLabel/images/$Filename
```

Returns raw file with the appropriate MimeType headers for each Filename retrieved from
`/candidates/$CandID/$Visit/images`.

Only `GET` is currently supported, but future versions of this API may include `PUT`
support to insert new (or processed) data into LORIS.

#### 4.3.1 Image Level QC Data
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/qc
PUT /candidates/$CandID/$VisitLabel/images/$Filename/qc
```

Returns file level QC information. It will return a JSON object of the form:

```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel,
        "File" : $Filename
    },
    "QC" : "Pass|Fail",
    "Selected" : boolean
}
```

PUT is not supported for image QC.

### 4.4 Alternate formats

There are occasions where you may want to retrieve a file in a different format
than it is stored in LORIS. This can be achieved by adding `/format/$FormatType`
to the URL in the API. Currently supported other formats are below. Other formats
may be added in a future version of this API.

An attempt to convert an image to an unsupported format may result in a
 `415 Unsupported Media Type` HTTP error.

#### 4.4.1 Raw Format
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/format/raw
```

This will return the data in raw format (ie. the output of mnc2raw)

#### 4.4.2 BrainBrowser Format
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/format/brainbrowser
```

This (in combination with raw) will let you extract the headers in a JSON
format that BrainBrowser can load. It will return a JSON object of the format

```js
{
    "xspace": {
        "start":"",
        "space_length":"",
        "step":""},
    "yspace": {
        "start":"",
        "space_length":"",
        "step":""
    },
    "zspace": {
        "start":"",
        "space_length":"",
        "step":""
    },
    "order":["xspace","zspace","yspace"]
}
```

#### 4.4.3 Thumbnail Format
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/format/thumbnail
```

This will return a JPEG image that can be used as a thumbnail to represent this
imaging acquisition statically (such as in the LORIS imaging browser.)

### 4.5 Image Headers
The LORIS API allows you to extract headers from the images in a RESTful manner.
The following methods are defined:

#### 4.5.1 Header Summary
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/headers
```

This will return a JSON summary of the important headers for this filename. It
will return a JSON object of the form:

```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel,
        "File" : $Filename
    },
    "Physical" : {
        "TE" : "",
        "TR" : "",
        "TI" : "",
        "SliceThickness" : "",
    },
    "Description" : {
        "SeriesName" : "",
        "SeriesDescription"  : ""
    }
    "Dimensions" : {
        "XSpace" : {
            "Length" : "",
            "StepSize" : ""
        },
        "YSpace" : {
            "Length" : "",
            "StepSize" : ""
        },
        "ZSpace" : {
            "Length" : "",
            "StepSize" : ""
        },
        "TimeDimension" : {
            "Length" : "",
            "StepSize" : ""
        }
    }
}
```

All of the dimensions are optional and may not exist for any given
file (for instance, a 3D image will not have a time dimension.)

#### 4.5.2 Complete Headers
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/headers/full
```

This will return a JSON object with ALL headers for this acquisition. 

The JSON will be of the form:

```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel,
        "File" : $Filename
    },
    "Headers" : {
        "dicomheader" : "value",
        /* more headers ... */
    }
}
```

#### 4.5.3 Specific Header
```
GET /candidates/$CandID/$VisitLabel/images/$Filename/headers/$HeaderName
```

This will return a JSON object that extracts one specific header from $Filename.

The JSON object is of the form:
```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel,
        "File" : $Filename,
        "Header" : $HeaderName
    },
    "Value" : string
}
```

## 5.0 DICOM Data

Like the imaging data, the DICOM data mostly lives in the `/candidates/$CandID/$Visit` 
portion of the REST API namespace, but is defined in a separate section of this 
document for clarity purposes.

### 5.1 Candidate DICOMs
```
GET /candidates/$CandID/$Visit/dicoms
```

A GET request to `/candidates/$CandID/$Visit/dicoms` will return a JSON object of
all the raw DICOM data which have been acquired for that visit. It will return an 
object of the form:

```js
{
    "Meta" : {
        "CandID" : $CandID,
        "Visit" : $VisitLabel,
    },
    "DicomTars" : 
        [{
        "Tarname" : "DCM_yyyy-mm-dd_ImagingUpload-hh-mm-abc123.tar",
        "SeriesInfo" :
            [{
            "SeriesDescription" : "MPRAGE_ipat2",
            "SeriesNumber" : "2",
            "EchoTime" : "2.98",
            "RepetitionTime" : "2300",
            "InversionTime" : "900",
            "SliceThickness" : "1",
            "Modality" : "MR",
            "SeriesUID" : "1.2.3.4.1107",
            },
            {
            "SeriesDescription" : "BOLD Resting State",
            "SeriesNumber" : "5",
            "EchoTime" : "30",
            "RepetitionTime" : "2100",
            "InversionTime" : NULL,
            "SliceThickness" : "3.5",
            "Modality" : "MR",
            "SeriesUID" : "3.4.5.6.1507",
            }],
        "Tarname" : "DCM_yyyy-mm-dd_ImagingUpload-hh-mm-def456.tar",
        "SeriesInfo" :
            [{
            "SeriesDescription" : "MPRAGE_ipat2",
            "SeriesNumber" : "2",
            "EchoTime" : "2.98",
            "RepetitionTime" : "2300",
            "InversionTime" : "900",
            "SliceThickness" : "1",
            "Modality" : "MR",
            "SeriesUID" : "1.7.8.9.1296",
            }],
    }],    
}
```

The `Modality` header in the SeriesInfo is either `MR` or `PT` for MRI or PET 
scans, respectively.

Only `GET` is currently supported.
