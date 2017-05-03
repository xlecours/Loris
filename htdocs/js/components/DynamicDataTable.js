!function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var DynamicDataTable=React.createClass({displayName:"DynamicDataTable",propTypes:{DataURL:React.PropTypes.string.isRequired},getInitialState:function(){return{Headers:[],Data:[],isLoaded:!1,loadedData:0}},getDefaultProps:function(){return{DataURL:""}},componentDidMount:function(){this.fetchData(),window.addEventListener("update-datatable",this.fetchData)},componentWillUnmount:function(){window.removeEventListener("update-datatable",this.fetchData)},fetchData:function(){var that=this;$.ajax(this.props.DataURL,{dataType:"json",cache:!1,xhr:function xhr(){var xhr=new window.XMLHttpRequest;return xhr.addEventListener("progress",function(evt){that.setState({loadedData:evt.loaded})}),xhr},success:function(data){that.setState({Headers:data.Headers,Data:data.Data,isLoaded:!0})},error:function(data,errorCode,errorMsg){console.error(errorCode+": "+errorMsg),that.setState({error:"Error loading data"})}})},render:function(){return this.state.isLoaded?React.createElement(StaticDataTable,{Headers:this.state.Headers,Data:this.state.Data,Filter:this.props.Filter,getFormattedCell:this.props.getFormattedCell,freezeColumn:this.props.freezeColumn}):void 0!==this.state.error?React.createElement("div",{className:"alert alert-danger"},React.createElement("strong",null,this.state.error)):React.createElement("button",{className:"btn-info has-spinner"},"Loading",React.createElement("span",{className:"glyphicon glyphicon-refresh glyphicon-refresh-animate"}))}}),RDynamicDataTable=React.createFactory(DynamicDataTable);window.DynamicDataTable=DynamicDataTable,window.RDynamicDataTable=RDynamicDataTable,exports.default=DynamicDataTable}]);
//# sourceMappingURL=DynamicDataTable.js.map