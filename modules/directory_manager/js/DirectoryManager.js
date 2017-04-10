'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactTreebeard = require('react-treebeard');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Data Integrity Flag
 *
 * Main module component rendering the tab pane with Browse and Update tabs
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
var DirectoryManager = function (_React$Component) {
  _inherits(DirectoryManager, _React$Component);

  function DirectoryManager(props) {
    _classCallCheck(this, DirectoryManager);

    var _this = _possibleConstructorReturn(this, (DirectoryManager.__proto__ || Object.getPrototypeOf(DirectoryManager)).call(this, props));

    _this.state = {
      data: null,
      isLoaded: false,
      formData: {}
    };

    // Bind component instance to custom methods
    _this.getNameTree = _this.getNameTree.bind(_this);
    _this.onToggle = _this.onToggle.bind(_this);
    return _this;
  }

  _createClass(DirectoryManager, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getNameTree();
    }

    /**
     * Retrive data from the provided URL and save it in state
     */

  }, {
    key: 'getNameTree',
    value: function getNameTree() {
      var _this2 = this;

      $.getJSON(this.props.DataURL, function (data) {
        _this2.setState({
          data: data,
          isLoaded: true
        });
      }).error(function (error) {
        console.error(error);
      });
    }
  }, {
    key: 'updateFilter',
    value: function updateFilter(filter) {
      this.setState({ filter: filter });
    }
  }, {
    key: 'onToggle',
    value: function onToggle() {
      return;
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('DirectoryManager::render');
      console.log(this.state.data);
      var data = {
        name: 'root',
        toggled: true,
        children: [{
          name: 'parent',
          children: [{ name: 'child1' }, { name: 'child2' }]
        }, {
          name: 'loading parent',
          loading: true,
          children: []
        }, {
          name: 'parent',
          children: [{
            name: 'nested parent',
            children: [{ name: 'nested child 1' }, { name: 'nested child 2' }]
          }]
        }]
      };
      return _react2.default.createElement(_reactTreebeard.Treebeard, {
        data: data,
        onToggle: this.onToggle
      });
    }
  }]);

  return DirectoryManager;
}(_react2.default.Component);

exports.default = DirectoryManager;