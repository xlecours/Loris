!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports){"use strict";function formatColumn(column,cell,rowData,rowHeaders){if(loris.hiddenHeaders.indexOf(column)>-1)return null;var row={};rowHeaders.forEach(function(header,index){row[header]=rowData[index]},this);var reactElement=null;switch(column){case"PSCID":var url=loris.BaseURL+"/"+rowData[1]+"/";reactElement=React.createElement("td",null,React.createElement("a",{href:url},cell));break;case"Subproject":reactElement=React.createElement("td",null,loris.subprojectList[cell]);break;case"File":reactElement="Y"===cell?React.createElement("td",null,React.createElement("a",{href:"#",onClick:loris.loadFilteredMenuClickHandler("genomic_browser/?submenu=viewGenomicFile",{candID:rowData[1]})},cell)):React.createElement("td",null,cell);break;case"CNV":case"CPG":case"SNP":reactElement="Y"===cell?React.createElement("td",null,React.createElement("span",{style:{cursor:"pointer"},onClick:loris.loadFilteredMenuClickHandler("genomic_browser/?submenu="+column.toLowerCase()+"_browser",{DCCID:rowData[1]})},cell)):React.createElement("td",null,cell);break;default:reactElement=React.createElement("td",null,cell)}return reactElement}window.formatColumn=formatColumn}]);
//# sourceMappingURL=profileColumnFormatter.js.map