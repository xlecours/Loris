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
	
	var _Tabs = __webpack_require__(9);
	
	var _variableBrowser = __webpack_require__(16);
	
	var _variableBrowser2 = _interopRequireDefault(_variableBrowser);
	
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
	      activeTab: 'profiles',
	      loaded: false,
	      data: {
	        variableTypes: ["gwas", "snp", "cnv", "cpg"]
	      }
	    };
	
	    _this.formatColumn = _this.formatColumn.bind(_this);
	    return _this;
	  }
	
	  _createClass(GenomicsApp, [{
	    key: 'formatColumn',
	    value: function formatColumn(c, a) {
	      return React.createElement(
	        'td',
	        null,
	        a
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var variableTypes = this.state.data.variableTypes;
	
	      var tabs = variableTypes.map(function (item, index) {
	        return React.createElement(
	          _Tabs.TabPane,
	          { TabId: item, key: index },
	          React.createElement(_variableBrowser2.default, { variableType: item })
	        );
	      });
	
	      var tabList = variableTypes.map(function (item) {
	        var tab = { id: item, label: item };
	        return tab;
	      });
	
	      tabList = [{ id: "profiles", label: "Profiles" }].concat(tabList);
	
	      return React.createElement(
	        _Tabs.Tabs,
	        { tabs: tabList, defaultTab: 'profiles', updateURL: true },
	        React.createElement(
	          _Tabs.TabPane,
	          { TabId: 'profiles' },
	          React.createElement(_MenuFilterForm2.default, {
	            moduleName: 'genomic_browser/profiles',
	            formatColumn: this.formatColumn
	          })
	        ),
	        tabs
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
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * This file contains React components for Tabs component.
	 *
	 * @author Loris Team
	 * @version 1.1.0
	 *
	 */
	
	/**
	 * Tabs Component.
	 * React wrapper for Bootstrap tabs. Allows to dynamically render tabs
	 * and corresponding tab panes.
	 *
	 * ================================================
	 * Usage:
	 *
	 * 1. Define an array of tabs with IDs and labels
	 *
	 * `let tabList = [{id: "tab1", label: "This is tab title"}];`
	 *
	 * 2. Pass tabList as <Tab> property and <TabPane> as child
	 *  ```
	 * <Tabs tabs={tabList} defaultTab="tab1">
	 *   <TabPane TabId={tabList[0].id}>
	 *     // Tab content goes here
	 *   </TabPane>
	 * </Tabs>
	 * ```
	 * =================================================
	 *
	 */
	var Tabs = function (_React$Component) {
	  _inherits(Tabs, _React$Component);
	
	  function Tabs(props) {
	    _classCallCheck(this, Tabs);
	
	    var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));
	
	    var hash = window.location.hash;
	    var activeTab = "";
	
	    /**
	     * Determine the initial active tab in this order
	     * 1. Try to infer from the URL, otherwise
	     * 2. Try to infer from the defaultTab prop, otherwise
	     * 3. Set to be the first tab of the list
	     */
	    if (_this.props.updateURL && hash) {
	      activeTab = hash.substr(1);
	    } else if (_this.props.defaultTab) {
	      activeTab = _this.props.defaultTab;
	    } else if (_this.props.tabs.length > 0) {
	      activeTab = _this.props.tabs[0].id;
	    }
	
	    _this.state = {
	      activeTab: activeTab
	    };
	
	    _this.handleClick = _this.handleClick.bind(_this);
	    _this.getTabs = _this.getTabs.bind(_this);
	    _this.getTabPanes = _this.getTabPanes.bind(_this);
	    return _this;
	  }
	
	  _createClass(Tabs, [{
	    key: 'handleClick',
	    value: function handleClick(tabId, e) {
	      this.setState({ activeTab: tabId });
	      this.props.onTabChange(tabId);
	
	      // Add tab href to URL querystring and scroll the page to top
	      if (this.props.updateURL) {
	        var scrollDistance = $('body').scrollTop() || $('html').scrollTop();
	        window.location.hash = e.target.hash;
	        $('html,body').scrollTop(scrollDistance);
	      }
	    }
	  }, {
	    key: 'getTabs',
	    value: function getTabs() {
	      var tabs = this.props.tabs.map(function (tab) {
	        var tabClass = this.state.activeTab === tab.id ? 'active' : null;
	        var href = "#" + tab.id;
	        var tabID = "tab-" + tab.id;
	        return React.createElement(
	          'li',
	          {
	            role: 'presentation',
	            className: tabClass,
	            key: tab.id
	          },
	          React.createElement(
	            'a',
	            { id: tabID,
	              href: href,
	              role: 'tab',
	              'data-toggle': 'tab',
	              onClick: this.handleClick.bind(null, tab.id)
	            },
	            tab.label
	          )
	        );
	      }.bind(this));
	
	      return tabs;
	    }
	  }, {
	    key: 'getTabPanes',
	    value: function getTabPanes() {
	      var tabPanes = React.Children.map(this.props.children, function (child, key) {
	        if (child) {
	          return React.cloneElement(child, {
	            activeTab: this.state.activeTab,
	            key: key
	          });
	        }
	      }.bind(this));
	
	      return tabPanes;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var tabs = this.getTabs();
	      var tabPanes = this.getTabPanes();
	      var tabStyle = {
	        marginLeft: 0,
	        marginBottom: '5px'
	      };
	
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'ul',
	          { className: 'nav nav-tabs', role: 'tablist', style: tabStyle },
	          tabs
	        ),
	        React.createElement(
	          'div',
	          { className: 'tab-content' },
	          tabPanes
	        )
	      );
	    }
	  }]);
	
	  return Tabs;
	}(React.Component);
	
	Tabs.propTypes = {
	  tabs: React.PropTypes.array.isRequired,
	  defaultTab: React.PropTypes.string,
	  updateURL: React.PropTypes.bool
	};
	Tabs.defaultProps = {
	  onTabChange: function onTabChange() {},
	  updateURL: false
	};
	
	/*
	 * TabPane component.
	 * Used to wrap content for every tab.
	 */
	
	var TabPane = function (_React$Component2) {
	  _inherits(TabPane, _React$Component2);
	
	  function TabPane() {
	    _classCallCheck(this, TabPane);
	
	    return _possibleConstructorReturn(this, (TabPane.__proto__ || Object.getPrototypeOf(TabPane)).apply(this, arguments));
	  }
	
	  _createClass(TabPane, [{
	    key: 'render',
	    value: function render() {
	      var classList = "tab-pane";
	      var title = void 0;
	
	      if (this.props.TabId === this.props.activeTab) {
	        classList += " active";
	      }
	      if (this.props.Title) {
	        title = React.createElement(
	          'h1',
	          null,
	          this.props.Title
	        );
	      }
	
	      return React.createElement(
	        'div',
	        { role: 'tabpanel', className: classList, id: this.props.TabId },
	        title,
	        this.props.children
	      );
	    }
	  }]);
	
	  return TabPane;
	}(React.Component);
	
	TabPane.propTypes = {
	  TabId: React.PropTypes.string.isRequired,
	  Title: React.PropTypes.string,
	  activeTab: React.PropTypes.string
	};
	
	exports.Tabs = Tabs;
	exports.TabPane = TabPane;

/***/ },
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
	      var refName = this.props.moduleName.concat("_filter_form");
	      this.refs[refName].clearFilter();
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
	            Module: moduleName,
	            name: filterFormName,
	            id: filterFormName,
	            ref: filterFormName,
	            columns: 3,
	            formElements: this.state.Data.form,
	            onUpdate: this.updateFilter,
	            filter: this.state.filter
	          },
	          React.createElement(ButtonElement, { ref: "", label: "Clear Filters", type: "reset", onUserInput: this.resetFilters })
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _MenuFilterForm = __webpack_require__(15);
	
	var _MenuFilterForm2 = _interopRequireDefault(_MenuFilterForm);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VariableBrowser = function (_React$Component) {
	  _inherits(VariableBrowser, _React$Component);
	
	  function VariableBrowser(props) {
	    _classCallCheck(this, VariableBrowser);
	
	    var _this = _possibleConstructorReturn(this, (VariableBrowser.__proto__ || Object.getPrototypeOf(VariableBrowser)).call(this, props));
	
	    _this.state = {
	      loaded: false
	    };
	
	    _this.formatColumn = _this.formatColumn.bind(_this);
	    return _this;
	  }
	
	  _createClass(VariableBrowser, [{
	    key: "formatColumn",
	    value: function formatColumn(c, a) {
	      return React.createElement(
	        "td",
	        null,
	        a
	      );
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return React.createElement(_MenuFilterForm2.default, {
	        moduleName: "genomic_browser/".concat(this.props.variableType, "_browser"),
	        formatColumn: this.formatColumn
	      });
	    }
	  }]);
	
	  return VariableBrowser;
	}(React.Component);
	
	VariableBrowser.propTypes = {
	  variableType: React.PropTypes.string.isRequired
	};
	
	exports.default = VariableBrowser;

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map