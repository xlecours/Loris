!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(2),a=r(o);$(function(){var e=loris.BaseURL+"/directory_manager?format=json",t=React.createElement("div",{id:"page-directory-manager"},React.createElement(a.default,{dataURL:e,module:"directory_manager"}));ReactDOM.render(t,document.getElementById("lorisworkspace"))})},,function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),u=r(l),s=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={data:{},isLoaded:!1,formData:{}},n.folderClickHandler=n.folderClickHandler.bind(n),n.fileClickHandler=n.fileClickHandler.bind(n),n}return i(t,e),c(t,[{key:"componentDidMount",value:function(){this.getNameTree()}},{key:"getNameTree",value:function(){var e=this;$.getJSON(this.props.dataURL,function(t){e.setState({data:t,isLoaded:!0})}).error(function(e){console.error(e)})}},{key:"fileClickHandler",value:function(e){console.log(e),this.setState({selectedFile:e.path})}},{key:"folderClickHandler",value:function(e){console.log(e)}},{key:"render",value:function(){var e=null;return console.log(this.state.isLoaded),this.state.isLoaded&&(e=React.createElement(u.default,{tree:this.state.data})),React.createElement("div",null,e)}}]),t}(React.Component);t.default=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),u=r(l),s=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={expended:!1},n.onClickHandler=n.onClickHandler.bind(n),n}return i(t,e),c(t,[{key:"onClickHandler",value:function(){var e=this.state.expended!==!0;this.setState({expended:e})}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e="glyphicon glyphicon-folder-close",n=void 0,r=void 0;return this.state.expended&&(n=this.props.tree.directories.map(function(e,n){return React.createElement(t,{key:n,tree:e})}),r=this.props.tree.files.map(function(e,t){return React.createElement(u.default,{key:t,name:e})}),e="glyphicon glyphicon-folder-open"),React.createElement("div",{className:"directory-tree"},React.createElement("div",{className:"click-handler",onClick:this.onClickHandler},React.createElement("span",{className:e}),React.createElement("text",null,this.props.tree.name)),n,r)}}]),t}(React.Component);s.propTypes={tree:React.PropTypes.shape({name:React.PropTypes.string.isRequired,files:React.PropTypes.array.isRequired,directories:React.PropTypes.array.isRequired})},t.default=s},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(e){function t(e){n(this,t);var o=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.state={},o}return o(t,e),a(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return React.createElement("div",{className:"file-item"},React.createElement("span",{className:"glyphicon glyphicon-file"}),React.createElement("text",null,this.props.name))}}]),t}(React.Component);t.default=i}]);
//# sourceMappingURL=index.js.map