"use strict";

/* TODO ::
 - axes
 - title
 - boxplot labels
 */

var GenomicViewer = React.createClass({
    displayName: 'GenomicViewer',

    propTypes: {
        DataURL: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            width: 800,
            height: 400,
            DataURL: ''
        };
    },

    getInitialState: function () {
        return {
            data: [],
            isLoaded: false,
            loadedData: 0
        };
    },

    showAll: function () {
        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        loadedData: evt.loaded
                    });
                });
                return xhr;
            },
            success: function (data) {
                that.setState({
                    data: data,
                    isLoaded: true
                });
            },
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
    },

    filter: function () {
        this.setState({ data: [] });
    },

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'selection' },
                'some filters',
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        { onClick: this.showAll },
                        'All'
                    ),
                    React.createElement(
                        'li',
                        { onClick: this.filter },
                        'Filter'
                    )
                )
            ),
            React.createElement('hr', null),
            React.createElement(Chart, {
                width: this.props.width,
                height: this.props.height,
                data: this.state.data })
        );
    }
});

var Chart = React.createClass({
    displayName: 'Chart',

    getDefaultProps: function () {
        return {
            margin: { top: 30, right: 50, bottom: 70, left: 50 },
            data: []
        };
    },
    getInitialState: function () {
        return {
            data: this.props.data
        };
    },
    render: function () {
        var props = this.props;
        var data = props.data;
        return React.createElement(
            'svg',
            {
                className: 'chart-container',
                width: this.props.width,
                height: this.props.height,
                className: 'box' },
            React.createElement(
                'g',
                { transform: 'translate(50,30)' },
                React.createElement(Title, {
                    text: 'My title'
                }),
                React.createElement(Legend, null),
                React.createElement(XAxis, null),
                React.createElement(YAxis, null),
                React.createElement(Boxplot, {
                    data: props.data,
                    width: props.width - props.margin.left - props.margin.right,
                    height: props.height - props.margin.top - props.margin.bottom
                })
            )
        );
    }
});

var Boxplot = React.createClass({
    displayName: 'Boxplot',

    getDefaultProps: function () {
        return {
            data: []
        };
    },

    shouldComponentUpdate: function (nextProps) {
        return this.props.data !== nextProps.data;
    },

    componentDidMount: function () {
        console.log("done");
    },

    render: function () {
        var props = this.props;
        var data = props.data;

        var yScale = d3.scale.linear().domain([0, 1]).range([0, this.props.height]);

        var xScale = d3.scale.linear().domain([10, 150]).range([0, this.props.width], 0.05);

        var boxes = data.map(function (point, i) {
            var y = props.height - yScale(point.q3),
                height = yScale(point.q3 - point.q1),
                x = xScale(point.x),
                width = xScale(15);

            return React.createElement('rect', {
                className: 'box',
                height: height,
                width: width,
                x: x,
                y: y,
                key: i
            });
        });

        var medians = data.map(function (point, i) {
            var y = yScale(1 - point.median),
                x1 = xScale(point.x),
                x2 = x1 + xScale(15);

            return React.createElement('line', {
                className: 'median',
                x1: x1,
                y1: y,
                y2: y,
                x2: x2,
                key: i
            });
        });

        var whiskersDown = data.map(function (point, i) {
            var y = yScale(1 - point.whiskerDown),
                x1 = xScale(point.x),
                x2 = x1 + xScale(15);

            return React.createElement('line', {
                className: 'whisker',
                x1: x1,
                y1: y,
                y2: y,
                x2: x2,
                key: i
            });
        });

        var whiskersUp = data.map(function (point, i) {
            var y = yScale(1 - point.whiskerUp),
                x1 = xScale(point.x),
                x2 = x1 + xScale(15);

            return React.createElement('line', {
                className: 'whisker',
                x1: x1,
                y1: y,
                y2: y,
                x2: x2,
                key: i
            });
        });

        var verticalLines = data.map(function (point, i) {
            var y2 = yScale(1 - point.whiskerUp),
                y1 = yScale(1 - point.whiskerDown),
                x = xScale(point.x) + xScale(15) * 0.5;

            return React.createElement('line', {
                className: 'center',
                x1: x,
                y1: y1,
                y2: y2,
                x2: x,
                key: i
            });
        });

        var outliers = data.map(function (point) {
            var xCenter = xScale(point.x) + xScale(15) * 0.5,
                radius = 5;

            return point.outlier.map(function (outlier, i) {
                var yCenter = yScale(1 - outlier);
                return React.createElement('circle', {
                    className: 'outlier',
                    cx: xCenter,
                    cy: yCenter,
                    r: radius,
                    key: i
                });
            });
        });

        var labels = data.map(function (point, i) {
            var median = React.createElement(
                'text',
                { x: xScale(point.x), y: yScale(1 - point.median), dx: '6', dy: '.3em', textAnchor: 'start', key: "a" + i },
                point.median
            );
            var q1 = React.createElement(
                'text',
                { x: xScale(point.x) + xScale(15), y: yScale(1 - point.q1), dx: '-6', dy: '.3em', textAnchor: 'end', key: "b" + i },
                point.q1
            );
            var q3 = React.createElement(
                'text',
                { x: xScale(point.x) + xScale(15), y: yScale(1 - point.q3), dx: '-6', dy: '.3em', textAnchor: 'end', key: "c" + i },
                point.q3
            );
            var whiskersDown = React.createElement(
                'text',
                { x: xScale(point.x), y: yScale(1 - point.whiskerDown), dx: '-6', dy: '.3em', textAnchor: 'end', key: "d" + i },
                point.whiskerDown
            );
            var whiskersUp = React.createElement(
                'text',
                { x: xScale(point.x), y: yScale(1 - point.whiskerUp), dx: '-6', dy: '.3em', textAnchor: 'end', key: "e" + i },
                point.whiskerUp
            );
            return [median, q1, q3, whiskersDown, whiskersUp];
        });

        return React.createElement(
            'g',
            null,
            verticalLines,
            boxes,
            medians,
            whiskersUp,
            whiskersDown,
            outliers,
            labels,
            this.props.children
        );
    }
});

var Title = React.createClass({
    displayName: 'Title',

    render: function () {
        return React.createElement(
            'text',
            null,
            this.props.text
        );
    }
});

var Legend = React.createClass({
    displayName: 'Legend',

    render: function () {
        return React.createElement(
            'text',
            null,
            'Legend'
        );
    }
});

var XAxis = React.createClass({
    displayName: 'XAxis',

    render: function () {
        return React.createElement(
            'text',
            null,
            'xAxis'
        );
    }
});

var YAxis = React.createClass({
    displayName: 'YAxis',

    render: function () {
        return React.createElement(
            'text',
            null,
            'yAxis'
        );
    }
});
