!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports){"use strict";function formatColumn(column,cell,rowData,rowHeaders){if(loris.hiddenHeaders.indexOf(column)>-1)return null;var row={};if(rowHeaders.forEach(function(header,index){row[header]=rowData[index]},this),"Correct Answer"===column){var correctAnswer="",newValue=row["New Value"],oldValue1=row["Correct Answer"],oldValue2=row.OldValue2;return"1"===newValue&&null!==oldValue1&&(correctAnswer=oldValue1),"2"===newValue&&null!==oldValue2&&(correctAnswer=oldValue2),React.createElement("td",null,correctAnswer)}return React.createElement("td",null,cell)}Object.defineProperty(exports,"__esModule",{value:!0}),window.formatColumn=formatColumn,exports.default=formatColumn}]);
//# sourceMappingURL=resolved_conflicts_columnFormatter.js.map