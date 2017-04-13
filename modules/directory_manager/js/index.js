!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(2),a=r(o);$(function(){var e=loris.BaseURL+"/directory_manager/?format=json",t=React.createElement("div",{id:"page-directory-manager"},React.createElement(a.default,{dataURL:e,module:"directory_manager"}));ReactDOM.render(t,document.getElementById("lorisworkspace"))})},,function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(3),c=r(l),u=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={data:{},isLoaded:!1},n.getTree=n.getTree.bind(n),n.getAdditionalElements=n.getAdditionalElements.bind(n),n}return i(t,e),s(t,[{key:"componentDidMount",value:function(){this.getTree()}},{key:"getTree",value:function(){var e=this;$.getJSON(this.props.dataURL,function(t){e.setState({data:t,isLoaded:!0})}).error(function(e){console.error(e)})}},{key:"getAdditionalElements",value:function(e,t){var n={className:this.state.data.className,fullpath:e,action:"getAdditionnalElements"},r=function(e){var n=JSON.parse(e),r=Object.keys(n).map(function(e,t){var r=void 0;switch(e){case"registration_status":var o=void 0,a=void 0,i=void 0;n[e]?"Not found..."==n[e]?(a="glyphicon glyphicon-question-sign",o=n[e]):"number"==typeof n[e]&&(a="glyphicon glyphicon-ok",o="Registered"):(a="glyphicon glyphicon-remove",o="Not registered"),r=React.createElement("span",{className:a,userfile:i,"data-toggle":"tooltip",title:o})}return r});t(r)}.bind(this);return $.ajax({type:"POST",url:this.props.dataURL,data:JSON.stringify(n),cache:!1,contentType:!1,processData:!1,success:r,error:function(e){console.error(e),swal({title:"Error!",type:"error",content:e.statusText})}})}},{key:"addToSelection",value:function(e){}},{key:"render",value:function(){var e=null;return e=this.state.isLoaded?React.createElement(c.default,{tree:this.state.data,getAdditionalElements:this.getAdditionalElements}):React.createElement("text",null,"Loading..."),React.createElement("div",{className:"panel panel-primary"},e)}}]),t}(React.Component);t.default=u},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(4),c=r(l),u=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={expended:!1,additionnalElements:[]},n.onClickHandler=n.onClickHandler.bind(n),n.getAdditionalElements=n.getAdditionalElements.bind(n),n.addElements=n.addElements.bind(n),n}return i(t,e),s(t,[{key:"onClickHandler",value:function(){var e=this.state.expended!==!0;this.setState({expended:e})}},{key:"addElements",value:function(e){this.setState({additionnalElements:e})}},{key:"getAdditionalElements",value:function(e,t){if(this.props.getAdditionalElements){var n=this.props.tree.name.concat("/",e);return this.props.getAdditionalElements(n,t)}}},{key:"componentDidMount",value:function(){this.props.getAdditionalElements&&this.props.getAdditionalElements(this.props.tree.name,this.addElements)}},{key:"render",value:function(){var e="directory-tree",n="glyphicon glyphicon-folder-close",r=void 0,o=void 0,a=void 0;if(this.props.tree.isReadable){if(this.state.expended){var i=this.getAdditionalElements;e=e.concat(" expended"),r=this.props.tree.directories.map(function(e,n){return React.createElement(t,{key:n,tree:e,getAdditionalElements:i})}),o=this.props.tree.files.map(function(e,t){return React.createElement(c.default,{key:t,name:e,getAdditionalElements:i})}),n="glyphicon glyphicon-folder-open"}}else a=React.createElement("div",{className:"module-warnings"},"Permission denied...");return React.createElement("div",{className:e},React.createElement("div",{className:"click-handler container-directory",onClick:this.onClickHandler},React.createElement("div",{className:"item-directory"},React.createElement("span",{className:n}),React.createElement("text",null,this.props.tree.name),a,this.state.additionnalElements)),r,o)}}]),t}(React.Component);u.propTypes={tree:React.PropTypes.shape({name:React.PropTypes.string.isRequired,isReadable:React.PropTypes.bool,files:React.PropTypes.array.isRequired,directories:React.PropTypes.array.isRequired}),getAdditionalElements:React.PropTypes.func},t.default=u},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(e){function t(e){n(this,t);var o=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.state={isLoaded:!1,additionnalElements:[]},o.addElements=o.addElements.bind(o),o}return o(t,e),a(t,[{key:"componentDidMount",value:function(){this.props.getAdditionalElements&&this.props.getAdditionalElements(this.props.name,this.addElements)}},{key:"addElements",value:function(e){this.setState({additionnalElements:e})}},{key:"render",value:function(){return React.createElement("div",{className:"file-item"},React.createElement("span",{className:"glyphicon glyphicon-file"}),React.createElement("text",null,this.props.name),this.state.additionnalElements)}}]),t}(React.Component);i.propTypes={name:React.PropTypes.string.isRequired,getAdditionalElements:React.PropTypes.func},t.default=i}]);
//# sourceMappingURL=index.js.map