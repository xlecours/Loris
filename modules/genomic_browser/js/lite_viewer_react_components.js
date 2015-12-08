"use strict";

/* TODO ::
 - axes
 - title
 - boxplot labels
 */

var GenomicViewer = React.createClass({
    displayName: "GenomicViewer",

    propTypes: {
        DataURL: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            width: 0,
            height: 0,
            DataURL: "",
            chromosome: "1",
            startLoc: "1",
            endLoc: "1"
        };
    },

    getInitialState: function () {
        return {
            width: this.props.width,
            height: this.props.height,
            data: [],
            isLoaded: false,
            loadedData: 0
        };
    },

    componentDidMount: function () {
        var that = this;
        var props = this.props;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            data: {
                chromosome: props.chromosome,
                startLoc: props.startLoc,
                endLoc: props.endLoc
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
            success: (function (data) {
                that.setState({
                    data: that.calculateGroupedValues(data),
                    isLoaded: true
                });
            }).bind(that),
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
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(Chart, {
                className: "chart-div",
                width: this.props.width,
                height: this.props.height,
                data: this.state.data,
                from: this.props.startLoc,
                to: this.props.endLoc
            })
        );
    }
});

var Chart = React.createClass({
    displayName: "Chart",

    getDefaultProps: function () {
        return {
            margin: { top: 10, right: 20, bottom: 10, left: 20 },
            yAxisWidth: 20,
            topTitleHeight: 20,
            xAxisHeight: 20,
            leftLegendSpacing: 200,
            from: 0,
            to: 0,
            data: []
        };
    },

    getInitialState: function () {
        return {
            data: this.props.data
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {

        var origin = {
            x: this.props.margin.left + this.props.yAxisWidth,
            y: this.props.height - this.props.xAxisHeight
        };

        var xCoord = this.props.data.map(function (e) {
            return e.x;
        });

        var xScale = d3.scale.linear().domain([this.props.from, this.props.to]).range([origin.x + 15, this.props.width - this.props.margin.left - this.props.leftLegendSpacing - 15]);

        var yScale = d3.scale.linear().domain([0, 1]).range([origin.y, this.props.margin.top + this.props.topTitleHeight]);

        return React.createElement(
            "svg",
            {
                className: "chart",
                width: this.props.width,
                height: this.props.height
            },
            React.createElement(
                "g",
                null,
                React.createElement(Title, {
                    text: "My title",
                    x: (this.props.width - this.props.margin.left - this.props.yAxisWidth - this.props.leftLegendSpacing - this.props.margin.right) / 2 + this.props.margin.left + this.props.yAxisWidth,
                    y: this.props.margin.top + this.props.topTitleHeight
                }),
                React.createElement(Legend, {
                    x: this.props.width - this.props.margin.right - this.props.leftLegendSpacing,
                    y: this.props.margin.top + this.props.topTitleHeight,
                    width: this.props.leftLegendSpacing,
                    height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight
                }),
                React.createElement(YAxis, {
                    leftMargin: this.props.margin.left,
                    origin: origin,
                    height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight,
                    yScale: yScale
                }),
                React.createElement(XAxis, {
                    origin: origin,
                    width: this.props.width - this.props.margin.left - this.props.margin.right - this.props.leftLegendSpacing - this.props.yAxisWidth,
                    xScale: xScale
                }),
                React.createElement(Boxplot, {
                    width: this.props.width - this.props.margin.left - this.props.margin.right,
                    height: this.props.height - this.props.margin.top - this.props.margin.bottom,
                    data: this.props.data,
                    xScale: xScale,
                    yScale: yScale
                })
            )
        );
    }
});

var Boxplot = React.createClass({
    displayName: "Boxplot",

    getDefaultProps: function () {
        return {
            data: [],
            width: 0,
            xScale: null,
            yScale: null,
            boxWidth: 15
        };
    },

    componentDidMount: function () {
        console.log("Boxplot loaded");
    },

    render: function () {

        var xScale = this.props.xScale;
        var yScale = this.props.yScale;
        var data = this.props.data;
        var boxwidth = this.props.boxWidth;

        var boxes = this.props.data.map(function (point) {
            return React.createElement(SpreadBox, {
                x: xScale(point.x) - boxwidth / 2,
                name: point.name,
                median: yScale(point.median),
                width: boxwidth,
                q1: yScale(point.q1),
                q3: yScale(point.q3),
                whiskerUp: yScale(point.whiskerUp),
                whiskerDown: yScale(point.whiskerDown),
                outliers: point.outliers.map(function (value) {
                    return yScale(value);
                })
            });
        });

        var labels = data.map(function (point, i) {
            var median = React.createElement(
                "text",
                { x: xScale(point.x), y: yScale(point.median), dx: "-6", dy: ".3em", textAnchor: "end", key: "a" + i },
                point.median
            );
            var q1 = React.createElement(
                "text",
                { x: xScale(point.x) + xScale(21), y: yScale(point.q1), dx: "-6", dy: ".3em", textAnchor: "end", key: "b" + i },
                point.q1
            );
            var q3 = React.createElement(
                "text",
                { x: xScale(point.x) + xScale(21), y: yScale(point.q3), dx: "-6", dy: ".3em", textAnchor: "end", key: "c" + i },
                point.q3
            );
            var whiskersDown = React.createElement(
                "text",
                { x: xScale(point.x), y: yScale(point.whiskerDown), dx: "-6", dy: ".3em", textAnchor: "end", key: "d" + i },
                point.whiskerDown
            );
            var whiskersUp = React.createElement(
                "text",
                { x: xScale(point.x), y: yScale(point.whiskerUp), dx: "-6", dy: ".3em", textAnchor: "end", key: "e" + i },
                point.whiskerUp
            );
            return [median, q1, q3, whiskersDown, whiskersUp];
        });

        return React.createElement(
            "g",
            {
                className: "plotPannel"
            },
            boxes
        );
    }
});

var SpreadBox = React.createClass({
    displayName: "SpreadBox",

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
            return React.createElement("circle", {
                className: "outlier",
                cx: xCenter,
                cy: value,
                r: "2"
            });
        });

        return React.createElement(
            "g",
            {
                className: "spread-box",
                "data-probename": this.props.name
            },
            React.createElement("line", {
                className: "center-line",
                x1: xCenter,
                x2: xCenter,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerDown
            }),
            React.createElement("rect", {
                height: this.props.q1 - this.props.q3,
                width: this.props.width,
                x: this.props.x,
                y: this.props.q3
            }),
            React.createElement("line", {
                className: "median",
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.median,
                y2: this.props.median
            }),
            React.createElement("line", {
                className: "whisker",
                x1: this.props.x,
                x2: this.props.x + this.props.width,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerUp
            }),
            React.createElement("line", {
                className: "whisker",
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
    displayName: "Title",

    render: function () {
        return React.createElement(
            "text",
            {
                className: "chart-title",
                x: this.props.x,
                y: this.props.y,
                textAnchor: "middle"
            },
            this.props.text
        );
    }
});

var Legend = React.createClass({
    displayName: "Legend",

    render: function () {
        return React.createElement("rect", {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height
        });
    }
});

var XAxis = React.createClass({
    displayName: "XAxis",

    getDefaultProps: function () {
        var xScale = d3.scale.linear().domain([0, 1]).range([0, 1]);

        return {
            label: "",
            origin: 0,
            xCanter: 0,
            width: 0,
            xScale: { xScale },
            ticks: []
        };
    },

    render: function () {

        var props = this.props;
        var ticks = props.xScale.ticks(10).map(function (t) {
            return React.createElement(XTick, {
                x: props.xScale(t),
                y: props.origin.y,
                label: t
            });
        });

        return React.createElement(
            "g",
            null,
            React.createElement(
                "text",
                null,
                this.props.label
            ),
            React.createElement("line", {
                x1: this.props.origin.x,
                x2: this.props.origin.x + this.props.width,
                y1: this.props.origin.y,
                y2: this.props.origin.y
            }),
            ticks
        );
    }

});

var YAxis = React.createClass({
    displayName: "YAxis",

    getDefaultProps: function () {
        return {
            label: "",
            origin: 0,
            width: 0,
            yScale: null
        };
    },

    render: function () {
        return React.createElement(
            "g",
            null,
            React.createElement("line", {
                x1: this.props.origin.x,
                x2: this.props.origin.x,
                y1: this.props.origin.y,
                y2: this.props.origin.y - this.props.height
            })
        );
    }
});

var XTick = React.createClass({
    displayName: "XTick",

    getDefaultProps: function () {
        return {
            label: "",
            x: 0,
            y: 0
        };
    },

    render: function () {
        var props = this.props;
        return React.createElement(
            "g",
            null,
            React.createElement(
                "text",
                {
                    className: "x-axis-ticks-label",
                    x: props.x,
                    y: props.y + 5,
                    dy: "1em",
                    textAnchor: "middle"
                },
                props.label
            ),
            React.createElement("line", {
                className: "x-axis-ticks-line",
                x1: props.x,
                x2: props.x,
                y1: props.y,
                y2: props.y + 5
            })
        );
    }
});
