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
            endLoc: "1",
            groupBy: "gender"
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

    addGroup: function (group) {
        this.setState({ groupBy: group });
    },

    componentDidMount: function () {
        var that = this;
        var props = this.props;
        that.addGroup("gender");
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
                    data: that.calculateGroupedValues(data, that.state.groupBy),
                    isLoaded: true
                });
            }).bind(that),
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
    },

    calculateGroupedValues: function (data, groupBy) {

        var datadict = {};
        var aggregatedValues = {};

        var formatedData = data.map(function (elem) {

            datadict[elem.cpg] = { genomic_location: Number(elem.cpg_loc) };

            var id = elem.cpg + "_" + elem[groupBy];

            return [id, Number(elem.beta_value)];
        }).reduce(function (last, now) {

            var uniqueId = now[0];
            var beta_value = now[1];
            if (Array.isArray(last[now[0]])) {
                last[uniqueId].push(beta_value);
            } else {
                last[uniqueId] = [beta_value];
            }

            return last;
        }, {});

        for (var group in formatedData) {
            var beta_values = formatedData[group].sort();
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
            var arayedId = group.split('_');
            var cpg_name = arayedId[0];
            var group_label = arayedId[1];

            if (typeof aggregatedValues[cpg_name] != "undefined") {
                aggregatedValues[cpg_name].grouped_values.push({
                    group_label: group_label,
                    q1: quartiles[0],
                    median: quartiles[1],
                    q3: quartiles[2],
                    whiskerUp: whiskerUp,
                    whiskerDown: whiskerDown,
                    outliers: outliers
                });
            } else {
                aggregatedValues[cpg_name] = {
                    x: datadict[cpg_name].genomic_location,
                    grouped_values: [{
                        group_label: group_label,
                        q1: quartiles[0],
                        median: quartiles[1],
                        q3: quartiles[2],
                        whiskerUp: whiskerUp,
                        whiskerDown: whiskerDown,
                        outliers: outliers
                    }]
                };
            }
        }
        return aggregatedValues;
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        return React.createElement(
            "div",
            { id: "chart-container" },
            React.createElement(Chart, {
                className: "chart",
                width: this.props.width,
                height: this.props.height,
                data: this.state.data,
                chromosome: this.props.chromosome,
                from: this.props.startLoc,
                to: this.props.endLoc
            }),
            React.createElement("div", { id: "info-panel" })
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
            xAxisHeight: 40,
            leftLegendSpacing: 200,
            chromosome: 0,
            from: 0,
            to: 0
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

        var xScale = d3.scale.linear().domain([this.props.from, this.props.to]).range([origin.x + 15, this.props.width - this.props.margin.left - this.props.leftLegendSpacing - 15]);

        var yScale = d3.scale.linear().domain([0, 1]).range([origin.y, this.props.margin.top + this.props.topTitleHeight]);

        var title = "Beta values of participants grouped by gender for CpGs located on Chr" + this.props.chromosome + ":" + this.props.from + "-" + this.props.to;

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
                    text: title,
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
                    label: "beta value",
                    leftMargin: this.props.margin.left,
                    origin: origin,
                    height: this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight,
                    yScale: yScale
                }),
                React.createElement(XAxis, {
                    label: "genomic location",
                    origin: origin,
                    width: this.props.width - this.props.margin.left - this.props.margin.right - this.props.leftLegendSpacing - this.props.yAxisWidth,
                    xScale: xScale,
                    height: this.props.xAxisHeight
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
            boxWidth: 40
        };
    },

    componentDidMount: function () {
        console.log("Boxplot loaded");
    },

    showTooltip: function (event) {
        console.log(event.currentTarget);
    },

    handleClick: function (event) {
        console.log(this);
        /*
        console.log(event);
        console.log(event.currentTarget);
        */
        var boxName = $(event.currentTarget).attr("title");
        console.log(boxName);
        var content = JSON.stringify(this.props.data[boxName]);
        $('#info-panel').html(content);
    },

    render: function () {

        var that = this;
        var xScale = this.props.xScale;
        var yScale = this.props.yScale;
        var data = this.props.data;
        var boxwidth = this.props.boxWidth;
        var boxes = [];

        Object.keys(data).forEach(function (key) {
            var point = data[key];
            var group_size = point.grouped_values.length;
            boxes.push(point.grouped_values.map(function (elem, index) {

                var x = point.x;
                var elemWidth = boxwidth / group_size;

                return React.createElement(SpreadBox, {
                    x: xScale(x) - boxwidth / 2 + elemWidth * index,
                    name: key,
                    group_label: elem.group_label,
                    median: yScale(elem.median),
                    width: elemWidth,
                    q1: yScale(elem.q1),
                    q3: yScale(elem.q3),
                    whiskerUp: yScale(elem.whiskerUp),
                    whiskerDown: yScale(elem.whiskerDown),
                    outliers: elem.outliers.map(function (value) {
                        return yScale(value);
                    })
                });
            }));
        });

        boxes = boxes.map(function (e) {
            return React.createElement(
                "g",
                {
                    className: "group-box",
                    title: e[0].props.name,
                    onClick: that.handleClick
                },
                e.map(function (d) {
                    return d;
                })
            );
        });

        /*
             var labels = data.map(function(point, i) {
                 var median = (<text x={xScale(point.x)} y={yScale(point.median)} dx="-6" dy=".3em" textAnchor="end" key={"a"+i}>{point.median}</text>);
                 var q1 = (<text x={xScale(point.x) + xScale(21)} y={yScale(point.q1)} dx="-6" dy=".3em" textAnchor="end" key={"b"+i}>{point.q1}</text>);
                 var q3 = (<text x={xScale(point.x) + xScale(21)} y={yScale(point.q3)} dx="-6" dy=".3em" textAnchor="end" key={"c"+i}>{point.q3}</text>);
                 var whiskersDown = (<text x={xScale(point.x)} y={yScale(point.whiskerDown)} dx="-6" dy=".3em" textAnchor="end" key={"d"+i}>{point.whiskerDown}</text>);
                 var whiskersUp = (<text x={xScale(point.x)} y={yScale(point.whiskerUp)} dx="-6" dy=".3em" textAnchor="end" key={"e"+i}>{point.whiskerUp}</text>);
                 return (
                     [median, q1, q3, whiskersDown, whiskersUp]
                 )
             });
        */
        return React.createElement(
            "g",
            {
                className: "plotPannel",
                id: "data-panel"
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
                className: "spread-box"
            },
            React.createElement("line", {
                className: "center-line",
                x1: xCenter,
                x2: xCenter,
                y1: this.props.whiskerUp,
                y2: this.props.whiskerDown
            }),
            React.createElement("rect", {
                className: "iqr-box",
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
            origin: { x: 0, y: 0 },
            width: 0,
            height: 0,
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
            { className: "axis", id: "x-axis" },
            React.createElement(
                "text",
                {
                    x: props.origin.x + props.width,
                    y: props.origin.y + props.height,
                    dx: "0",
                    dy: "-0.5em",
                    textAnchor: "end"
                },
                props.label
            ),
            React.createElement("line", {
                x1: props.origin.x,
                x2: props.origin.x + props.width,
                y1: props.origin.y,
                y2: props.origin.y
            }),
            ticks
        );
    }

});

var YAxis = React.createClass({
    displayName: "YAxis",

    getDefaultProps: function () {
        var yScale = d3.scale.linear().domain([0, 1]).range([0, 1]);

        return {
            label: "",
            origin: 0,
            width: 0,
            yScale: { yScale },
            ticks: []
        };
    },

    render: function () {

        var props = this.props;
        var tickValues = [0, 0.2, 0.6, 1];
        var ticks = tickValues.map(function (t) {
            return React.createElement(YTick, {
                x: props.origin.x,
                y: props.yScale(t),
                label: t
            });
        });
        var dx = "-" + props.label.length + "em";

        return React.createElement(
            "g",
            { className: "axis", id: "y-axis" },
            React.createElement(
                "text",
                {
                    className: "y-axis-label",
                    x: props.origin.x,
                    y: props.yScale(1),
                    dx: dx,
                    dy: "-1em",
                    textAnchor: "start",
                    transform: "translate(0,0) rotate(-90)"
                },
                props.label
            ),
            React.createElement("line", {
                x1: props.origin.x,
                x2: props.origin.x,
                y1: props.yScale(0),
                y2: props.yScale(1)
            }),
            ticks
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
            { className: "axis" },
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

var YTick = React.createClass({
    displayName: "YTick",

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
            { className: "axis" },
            React.createElement(
                "text",
                {
                    className: "y-axis-ticks-label",
                    x: props.x - 6,
                    y: props.y,
                    dy: ".3em",
                    textAnchor: "end"
                },
                props.label
            ),
            React.createElement("line", {
                className: "y-axis-ticks-line",
                x1: props.x,
                x2: props.x - 5,
                y1: props.y,
                y2: props.y
            })
        );
    }
});
