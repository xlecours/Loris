/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _MenuFilterForm = __webpack_require__(15);
	
	var _MenuFilterForm2 = _interopRequireDefault(_MenuFilterForm);
	
	var _columnFormatter = __webpack_require__(16);
	
	var _columnFormatter2 = _interopRequireDefault(_columnFormatter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var GenomicsApp = function (_React$Component) {
	  _inherits(GenomicsApp, _React$Component);
	
	  function GenomicsApp(props) {
	    _classCallCheck(this, GenomicsApp);
	
	    var _this = _possibleConstructorReturn(this, (GenomicsApp.__proto__ || Object.getPrototypeOf(GenomicsApp)).call(this, props));
	
	    _this.state = {
	      loaded: false
	    };
	    return _this;
	  }
	
	  _createClass(GenomicsApp, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(_MenuFilterForm2.default, {
	          moduleName: 'genomics/genomic_browser',
	          formatColumn: _columnFormatter2.default
	        })
	      );
	    }
	  }]);
	
	  return GenomicsApp;
	}(React.Component);
	
	$(function () {
	  var app = React.createElement(
	    'div',
	    null,
	    React.createElement(GenomicsApp, null)
	  );
	
	  ReactDOM.render(app, document.getElementById("lorisworkspace"));
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * This file contains React component for Panel
	 *
	 * @author Alex I.
	 * @version 1.0.0
	 *
	 */
	
	/**
	 * Panel component
	 * Wraps children in a collapsible bootstrap panel
	 */
	var Panel = function (_React$Component) {
	  _inherits(Panel, _React$Component);
	
	  function Panel(props) {
	    _classCallCheck(this, Panel);
	
	    var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props));
	
	    _this.state = {
	      collapsed: _this.props.initCollapsed
	    };
	
	    // Initialize panel class based on collapsed status
	    _this.panelClass = _this.props.initCollapsed ? "panel-collapse collapse" : "panel-collapse collapse in";
	
	    _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);
	    return _this;
	  }
	
	  _createClass(Panel, [{
	    key: "toggleCollapsed",
	    value: function toggleCollapsed() {
	      this.setState({ collapsed: !this.state.collapsed });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      // Change arrow direction based on collapse status
	      var glyphClass = this.state.collapsed ? "glyphicon pull-right glyphicon-chevron-down" : "glyphicon pull-right glyphicon-chevron-up";
	
	      // Add panel header, if title is set
	      var panelHeading = this.props.title ? React.createElement(
	        "div",
	        {
	          className: "panel-heading",
	          onClick: this.toggleCollapsed,
	          "data-toggle": "collapse",
	          "data-target": '#' + this.props.id,
	          style: { cursor: 'pointer' }
	        },
	        this.props.title,
	        React.createElement("span", { className: glyphClass })
	      ) : '';
	
	      return React.createElement(
	        "div",
	        { className: "panel panel-primary" },
	        panelHeading,
	        React.createElement(
	          "div",
	          { id: this.props.id, className: this.panelClass, role: "tabpanel" },
	          React.createElement(
	            "div",
	            { className: "panel-body", style: { height: this.props.height } },
	            this.props.children
	          )
	        )
	      );
	    }
	  }]);
	
	  return Panel;
	}(React.Component);
	
	Panel.propTypes = {
	  id: React.PropTypes.string,
	  height: React.PropTypes.string,
	  title: React.PropTypes.string
	};
	Panel.defaultProps = {
	  initCollapsed: false,
	  id: 'default-panel',
	  height: '100%'
	};
	
	exports.default = Panel;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Panel = __webpack_require__(2);
	
	var _Panel2 = _interopRequireDefault(_Panel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This file contains React component for FilterForm
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Loris Team
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 1.1.0
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	/**
	 * FilterForm component.
	 * A wrapper for form elements inside a selection filter.
	 *
	 * Adds necessary filter callbacks to all children and passes them to FormElement
	 * for proper rendering.
	 *
	 * Keeps track of filter object and sends it to parent on every update.
	 *
	 * //HACK/NOTE: Loris has special behaviour for `candID` attribute in the query string,
	 * making it impossible to use it for selection filters. This components renames
	 * all `candID` fields to `candidateID` automatically before appending them to URL.
	 *
	 */
	var FilterForm = function (_React$Component) {
	  _inherits(FilterForm, _React$Component);
	
	  function FilterForm(props) {
	    _classCallCheck(this, FilterForm);
	
	    // Bind component instance to custom methods
	    var _this = _possibleConstructorReturn(this, (FilterForm.__proto__ || Object.getPrototypeOf(FilterForm)).call(this, props));
	
	    _this.clearFilter = _this.clearFilter.bind(_this);
	    _this.getFormChildren = _this.getFormChildren.bind(_this);
	    _this.setFilter = _this.setFilter.bind(_this);
	    _this.onElementUpdate = _this.onElementUpdate.bind(_this);
	
	    // Keeps track of querystring values
	    // Saved as class variable instead of keeping in state
	    _this.queryString = QueryString.get();
	    return _this;
	  }
	
	  _createClass(FilterForm, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var filter = {};
	      var queryString = this.queryString;
	
	      // Initiaze filter using querystring value
	      Object.keys(queryString).forEach(function (key) {
	        var filterKey = key === 'candidateID' ? 'candID' : key;
	        filter[filterKey] = {
	          value: queryString[key],
	          exactMatch: false
	        };
	      });
	
	      // Update parent component
	      this.props.onUpdate(filter);
	    }
	
	    /**
	     * Clear the filter object, querystring and input fields
	     */
	
	  }, {
	    key: 'clearFilter',
	    value: function clearFilter() {
	      this.queryString = QueryString.clear(this.props.Module);
	      this.props.onUpdate({});
	    }
	
	    /**
	     * Itterates through FilterForm children, sets necessary callback functions
	     * and initializes filterTable
	     *
	     * @return {Array} formChildren - array of children with necessary props
	     */
	
	  }, {
	    key: 'getFormChildren',
	    value: function getFormChildren() {
	      var formChildren = [];
	      React.Children.forEach(this.props.children, function (child, key) {
	        // If child is a React component (i.e not a simple DOM element)
	        if (React.isValidElement(child) && typeof child.type === "function" && child.props.onUserInput) {
	          var callbackFunc = child.props.onUserInput;
	          var callbackName = callbackFunc.name;
	          var elementName = child.type.displayName;
	          var queryFieldName = child.props.name === 'candID' ? 'candidateID' : child.props.name;
	          var filterValue = this.queryString[queryFieldName];
	          // If callback function was not set, set it to onElementUpdate() for form
	          // elements and to clearFilter() for <ButtonElement type='reset'/>.
	          if (callbackName === "onUserInput") {
	            if (elementName === "ButtonElement" && child.props.type === "reset") {
	              callbackFunc = this.clearFilter;
	            } else {
	              callbackFunc = this.onElementUpdate.bind(null, elementName);
	            }
	          }
	          // Pass onUserInput and value props to all children
	          formChildren.push(React.cloneElement(child, {
	            onUserInput: callbackFunc,
	            value: filterValue ? filterValue : '',
	            key: key
	          }));
	          // Initialize filter for StaticDataTable
	          this.setFilter(elementName, child.props.name, filterValue);
	        } else {
	          formChildren.push(React.cloneElement(child, { key: key }));
	        }
	      }.bind(this));
	
	      return formChildren;
	    }
	
	    /**
	     * Appends entry to filter object or deletes it if value is
	     * empty.
	     *
	     * Sets exactMatch to true for all SelectElements (i.e dropdowns)
	     * in order to force StaticDataTable to do exact comparaison
	     *
	     * @param {string} type - form element type (i.e component name)
	     * @param {string} key - the name of the form element
	     * @param {string} value - the value of the form element
	     *
	     * @return {{}} filter - filterData
	     */
	
	  }, {
	    key: 'setFilter',
	    value: function setFilter(type, key, value) {
	      var filter = {};
	      if (this.props.filter) {
	        filter = JSON.parse(JSON.stringify(this.props.filter));
	      }
	
	      if (key && value) {
	        filter[key] = {};
	        filter[key].value = value;
	        filter[key].exactMatch = type === "SelectElement";
	      } else if (filter && key && value === '') {
	        delete filter[key];
	      }
	
	      return filter;
	    }
	
	    /**
	     * Sets filter object and querystring to reflect values of input fields
	     *
	     * @param {string} type - form element type (i.e component name)
	     * @param {string} fieldName - the name of the form element
	     * @param {string} fieldValue - the value of the form element
	     */
	
	  }, {
	    key: 'onElementUpdate',
	    value: function onElementUpdate(type, fieldName, fieldValue) {
	      // Make sure both key/value are string before sending them to querystring
	      if (typeof fieldName !== "string" || typeof fieldValue !== "string") {
	        return;
	      }
	
	      // Update query string
	      var queryFieldName = fieldName === 'candID' ? 'candidateID' : fieldName;
	      this.queryString = QueryString.set(this.queryString, queryFieldName, fieldValue);
	
	      // Update filter and get new filter object
	      var filter = this.setFilter(type, fieldName, fieldValue);
	      this.props.onUpdate(filter);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // Get formatted children
	      var formChildren = this.getFormChildren();
	      var formElements = this.props.formElements;
	
	      if (formElements) {
	        Object.keys(formElements).forEach(function (fieldName) {
	          var queryFieldName = fieldName === 'candID' ? 'candidateID' : fieldName;
	          formElements[fieldName].onUserInput = this.onElementUpdate.bind(null, fieldName);
	          formElements[fieldName].value = this.queryString[queryFieldName];
	        }.bind(this));
	      }
	
	      return React.createElement(
	        _Panel2.default,
	        {
	          id: this.props.id,
	          height: this.props.height,
	          title: this.props.title
	        },
	        React.createElement(
	          FormElement,
	          this.props,
	          formChildren
	        )
	      );
	    }
	  }]);
	
	  return FilterForm;
	}(React.Component);
	
	FilterForm.defaultProps = {
	  id: 'selection-filter',
	  height: '100%',
	  title: 'Selection Filter',
	  onUpdate: function onUpdate() {
	    console.warn('onUpdate() callback is not set!');
	  }
	};
	FilterForm.propTypes = {
	  Module: React.PropTypes.string.isRequired,
	  filter: React.PropTypes.object.isRequired,
	  id: React.PropTypes.string,
	  height: React.PropTypes.string,
	  title: React.PropTypes.string,
	  onUpdate: React.PropTypes.func
	};
	
	exports.default = FilterForm;

/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FilterForm = __webpack_require__(13);
	
	var _FilterForm2 = _interopRequireDefault(_FilterForm);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MenuFilterForm = function (_React$Component) {
	  _inherits(MenuFilterForm, _React$Component);
	
	  function MenuFilterForm(props) {
	    _classCallCheck(this, MenuFilterForm);
	
	    var _this = _possibleConstructorReturn(this, (MenuFilterForm.__proto__ || Object.getPrototypeOf(MenuFilterForm)).call(this, props));
	
	    loris.hiddenHeaders = [];
	
	    _this.state = {
	      isLoaded: false,
	      filter: {}
	    };
	
	    // Bind component instance to custom methods
	    _this.fetchData = _this.fetchData.bind(_this);
	    _this.updateFilter = _this.updateFilter.bind(_this);
	    _this.resetFilters = _this.resetFilters.bind(_this);
	    return _this;
	  }
	
	  _createClass(MenuFilterForm, [{
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this.fetchData();
	    }
	
	    /**
	     * Retrive data from the provided URL and save it in state
	     * Additionaly add hiddenHeaders to global loris vairable
	     * for easy access by columnFormatter.
	     */
	
	  }, {
	    key: "fetchData",
	    value: function fetchData() {
	      var url = loris.BaseURL.concat("/", this.props.moduleName, "/?format=json");
	      $.ajax(url, {
	        method: "GET",
	        dataType: 'json',
	        success: function (data) {
	          this.setState({
	            Data: data,
	            isLoaded: true
	          });
	        }.bind(this),
	        error: function error(_error) {
	          console.error(_error);
	        }
	      });
	    }
	  }, {
	    key: "updateFilter",
	    value: function updateFilter(filter) {
	      this.setState({ filter: filter });
	    }
	  }, {
	    key: "resetFilters",
	    value: function resetFilters() {
	      this.refs.mediaFilter.clearFilter();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      // Waiting for async data to load
	      if (!this.state.isLoaded) {
	        return React.createElement(
	          "button",
	          { className: "btn-info has-spinner" },
	          "Loading",
	          React.createElement("span", {
	            className: "glyphicon glyphicon-refresh glyphicon-refresh-animate" })
	        );
	      }
	
	      var moduleName = this.props.moduleName;
	      var filterFormName = moduleName.concat("_filter_form");
	
	      return React.createElement(
	        "div",
	        { id: this.props.name },
	        React.createElement(
	          _FilterForm2.default,
	          {
	            Module: name,
	            name: filterFormName,
	            id: filterFormName,
	            ref: filterFormName,
	            columns: 3,
	            formElements: this.state.Data.form,
	            onUpdate: this.updateFilter,
	            filter: this.state.filter
	          },
	          React.createElement(ButtonElement, { label: "Clear Filters", type: "reset", onUserInput: this.resetFilters })
	        ),
	        React.createElement(StaticDataTable, {
	          Data: this.state.Data.Data,
	          Headers: this.state.Data.Headers,
	          Filter: this.state.filter,
	          getFormattedCell: this.props.formatColumn
	        })
	      );
	    }
	  }]);
	
	  return MenuFilterForm;
	}(React.Component);
	
	MenuFilterForm.propTypes = {
	  moduleName: React.PropTypes.string.isRequired
	};
	
	exports.default = MenuFilterForm;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Modify behaviour of specified column cells in the Data Table component
	 * @param {string} column - column name
	 * @param {string} cell - cell content
	 * @param {arrray} rowData - array of cell contents for a specific row
	 * @param {arrray} rowHeaders - array of table headers (column names)
	 * @return {*} a formated table cell for a given column
	 */
	function formatColumn(column, cell, rowData, rowHeaders) {
	  console.log(loris.hiddenHeaders);
	  console.log(loris.hiddenHeaders.indexOf(column));
	  // If a column if set as hidden, don't display it
	  if (loris.hiddenHeaders.indexOf(column) > -1) {
	    return null;
	  }
	
	  // Create the mapping between rowHeaders and rowData in a row object.
	  var row = {};
	  rowHeaders.forEach(function (header, index) {
	    row[header] = rowData[index];
	  }, this);
	
	  return React.createElement(
	    "td",
	    null,
	    cell
	  );
	}
	
	exports.default = formatColumn;

/***/ }
/******/ ]);
//# sourceMappingURL=genomicsIndex.js.map