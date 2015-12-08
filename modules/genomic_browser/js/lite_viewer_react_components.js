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
            width: 0,
            height: 0,
            DataURL: ''
        };
    },

    getInitialState: function () {
        return {
            width: this.props.width,
            height: this.props.height,
            data: this.showAll(),
            isLoaded: false,
            loadedData: 0
        };
    },

    showAll: function () {
        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            data: {
                chromosome: "1",
                startLoc: "1",
                endLoc: "100000000"
            },
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
                    data: that.calculateGroupedValues(data),
                    isLoaded: true
                });
            },
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
    },

    calculateGroupedValues: function (data) {

        var datadict = {};
        var aggregatedValues = [];

        var formatedData = data.map(function (elem) {

            datadict[elem.cpg] = { genomic_location: Number(elem.cpg_loc) };

            return [elem.cpg, Number(elem.beta_value)];
        }).reduce(function (last, now) {

            if (Array.isArray(last[now[0]])) {
                last[now[0]].push(now[1]);
            } else {
                last[now[0]] = [now[1]];
            }

            return last;
        }, {});

        for (var cpg in formatedData) {
            var beta_values = formatedData[cpg].sort();
            var quartiles = jStat.quartiles(beta_values);
            var iqr = quartiles[2] - quartiles[0];
            var whiskerUp = jStat.max(beta_values.filter(function (x) {
                return x < quartiles[2] + 1.5 * iqr;
            }));
            var whiskerDown = jStat.min(beta_values.filter(function (x) {
                return x > quartiles[0] - 1.5 * iqr;
            }));
            var outliers = beta_values.filter(function (x) {
                return x < quartiles[0] - 1.5 * iqr || x > quartiles[2] + 1.5 * iqr;
            });

            aggregatedValues.push({
                x: datadict[cpg].genomic_location,
                name: cpg,
                q1: quartiles[0],
                median: quartiles[1],
                q3: quartiles[2],
                whiskerUp: whiskerUp,
                whiskerDown: whiskerDown,
                outliers: outliers
            });
        }

        return aggregatedValues;
        /*
                return [
                    {x: 45, name: "cg0004301", median: 0.51, q1: 0.35, q3: 0.65, whiskerDown: 0.15, whiskerUp: 0.75, outliers: [1.0, 0.8, 0.1, 0.05]},
                    {x: 65, name: "cg0004302", median: 0.51, q1: 0.35, q3: 0.65, whiskerDown: 0.25, whiskerUp: 0.75, outliers: [0.9, 0.8, 0.1, 0.05]}
                ];
        */
    },

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(Chart, {
                className: 'chart-div',
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
            margin: { top: 20, right: 100, bottom: 20, left: 20 },
            data: []
        };
    },
    getInitialState: function () {
        return {
            data: this.props.data
        };
    },

    render: function () {

        var xCoord = this.props.data.map(function (e) {
            return e.x;
        });

        var xScale = d3.scale.linear().domain([jStat.min(xCoord), jStat.max(xCoord)]).range([0, this.props.width - (this.props.margin.right + this.props.margin.left)]);

        var yScale = d3.scale.linear().domain([0, 1]).range([0, this.props.height - (this.props.margin.top + this.props.margin.bottom)]);

        var t = `translate(0 ,${ this.props.margin.left }, ${ this.props.margin.top })`;

        return React.createElement(
            'svg',
            {
                className: 'box',
                width: this.props.width,
                height: this.props.height,
                transform: t
            },
            React.createElement(
                'g',
                null,
                React.createElement(Title, {
                    text: 'My title'
                }),
                React.createElement(Legend, null),
                React.createElement(YAxis, {
                    leftMargin: this.props.margin.left,
                    topMargin: this.props.margin.top,
                    width: '20',
                    height: this.props.height - this.props.margin.top - this.props.margin.bottom,
                    yScale: yScale
                }),
                React.createElement(XAxis, {
                    x1: this.props.margin.left,
                    x2: this.props.width - this.props.margin.left - this.props.margin.right,
                    y1: 0,
                    y2: 100
                }),
                React.createElement(Boxplot, {
                    width: this.props.width - this.props.margin.left - this.props.margin.right,
                    height: this.props.height - this.props.margin.top - this.props.margin.bottom,
                    data: this.props.data
                })
            )
        );
    }
});

var Boxplot = React.createClass({
    displayName: 'Boxplot',

    getDefaultProps: function () {
        return {
            data: [],
            width: 0
        };
    },

    componentDidMount: function () {
        console.log("Boxplot loaded");
    },

    render: function () {

        var data = this.props.data;
        var xCoord = data.map(function (e) {
            return e.x;
        });

        var xScale = d3.scale.linear().domain([jStat.min(xCoord), jStat.max(xCoord)]).range([0, this.props.width]);

        var yScale = d3.scale.linear().domain([0, 1]).range([0, this.props.height]);

        var boxes = this.props.data.map(function (point) {
            return React.createElement(SpreadBox, {
                x: xScale(point.x),
                name: point.name,
                median: yScale(1 - point.median),
                width: 20,
                q1: yScale(1 - point.q1),
                q3: yScale(1 - point.q3),
                whiskerUp: yScale(1 - point.whiskerUp),
                whiskerDown: yScale(1 - point.whiskerDown),
                outliers: point.outliers.map(function (value) {
                    return yScale(1 - value);
                })
            });
        });

        var labels = data.map(function (point, i) {
            var median = React.createElement(
                'text',
                { x: xScale(point.x), y: yScale(1 - point.median), dx: '-6', dy: '.3em', textAnchor: 'end', key: "a" + i },
                point.median
            );
            var q1 = React.createElement(
                'text',
                { x: xScale(point.x) + xScale(21), y: yScale(1 - point.q1), dx: '-6', dy: '.3em', textAnchor: 'end', key: "b" + i },
                point.q1
            );
            var q3 = React.createElement(
                'text',
                { x: xScale(point.x) + xScale(21), y: yScale(1 - point.q3), dx: '-6', dy: '.3em', textAnchor: 'end', key: "c" + i },
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
            {
                className: 'plotPannel',
                translate: 'transform(30,50)'
            },
            boxes
        );
    }
});

var SpreadBox = React.createClass({
    displayName: 'SpreadBox',

    getDefaultProps: function () {
        return {
            name: "",
            x: 0,
            width: 0,
            median: 0,
            q1: 0,
            q3: 0,
            whiskerUp: 0,
            whiskerDown: 0,
            outliers: []
        };
    },

    componentDidMount: function () {
        console.log(this.props.name + " mounted");
    },

    render: function () {
        var xCenter = this.props.x + this.props.width * 0.5;
        var outliers = this.props.outliers.map(function (value) {
            return React.createElement('circle', {
                className: 'outlier',
                cx: xCenter,
                cy: value,
                r: '2'
            });
        });
        console.log(this.props.x);

        return React.createElement(
            'g',
            { className: 'spread-box' },
            React.createElement('line', {
                className: 'center-line',
                x1: xCenter,
                x2: xCenter,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerDown
            }),
            React.createElement('rect', {
                height: this.props.q1 - this.props.q3,
                width: this.props.width,
                x: this.props.x,
                y: this.props.q3
            }),
            React.createElement('line', {
                className: 'median',
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.median,
                y2: this.props.median
            }),
            React.createElement('line', {
                className: 'whisker',
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerUp
            }),
            React.createElement('line', {
                className: 'whisker',
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.whiskerDown,
                y2: this.props.whiskerDown
            }),
            outliers
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

    getDefaultProps: function () {
        return {
            label: "",
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
            ticks: []
        };
    },
    render: function () {
        return React.createElement(
            'g',
            null,
            React.createElement('line', {
                x1: this.props.x1,
                x2: this.props.x2,
                y1: this.props.y1,
                y2: this.props.y2
            })
        );
    }
});

var YAxis = React.createClass({
    displayName: 'YAxis',

    render: function () {
        return React.createElement(
            'g',
            null,
            React.createElement('line', {
                x1: this.props.leftMargin,
                x2: this.props.leftMargin,
                y1: this.props.topMargin,
                y2: this.props.yScale(1)
            })
        );
    }
});
