"use strict"

/* TODO ::
 - axes
 - title
 - boxplot labels
 */

var GenomicViewer = React.createClass({

    propTypes: {
        DataURL : React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            width: 0,
            height: 0,
            DataURL: "",
            chromosome: "1",
            startLoc: "1",
            endLoc: "1"
        }
    },

    getInitialState: function () {
        return {
            width: this.props.width,
            height: this.props.height,
            data: [],
            isLoaded: false,
            loadedData: 0
        }
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
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function(evt) {
                    that.setState({
                        loadedData : evt.loaded
                    });
                });
                return xhr;
            },
            success: function(data) {
                that.setState({
                    data : that.calculateGroupedValues(data),
                    isLoaded : true
                });
            }.bind(that),
            error: function(data) {
                that.setState({ "error" : "Unknown error loading data" });
            }
        });
    },

    calculateGroupedValues: function (data) {

        var datadict = {};
        var aggregatedValues = [];

        var formatedData = data.map(function(elem) {

            datadict[elem.cpg] = {genomic_location: Number(elem.cpg_loc)};

            return [elem.cpg, Number(elem.beta_value)];

        }).reduce(function(last, now) {

            if (Array.isArray(last[now[0]])) {
                last[now[0]].push(now[1]);
            } else {
                last[now[0]] = [now[1]];
            }

            return last;

        }, {});

        for(var cpg in formatedData) {
            var beta_values = formatedData[cpg].sort();
            var quartiles = jStat.quartiles(beta_values);
            var iqr = quartiles[2] - quartiles[0];
            var whiskerUp = jStat.max(beta_values.filter(function(x) {
                return x < (quartiles[2] + 1.5 * iqr)
            }));
            var whiskerDown = jStat.min(beta_values.filter(function(x) {
                return x > (quartiles[0] - 1.5 * iqr)
            }));
            var outliers = beta_values.filter(function(x) {
                return x < (quartiles[0] - 1.5 * iqr) || x > (quartiles[2] + 1.5 * iqr)
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

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    render: function () {
        return (
            <div>
                <Chart
                    className="chart-div"
                    width={this.props.width}
                    height={this.props.height}
                    data={this.state.data}
                    from={this.props.startLoc}
                    to={this.props.endLoc}
                >
                </Chart>
            </div>
        );
    }
});

var Chart = React.createClass({

    getDefaultProps: function () {
        return {
            margin: {top: 10, right: 20, bottom: 10, left: 20},
            yAxisWidth: 20,
            topTitleHeight: 20,
            xAxisHeight: 40,
            leftLegendSpacing: 200,
            from: 0,
            to: 0,
            data: []
        }
    },

    getInitialState: function () {
        return {
            data: this.props.data
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },

    render: function () {

        var origin = {
            x: this.props.margin.left + this.props.yAxisWidth,
            y: this.props.height - this.props.xAxisHeight
        };

        var xCoord = this.props.data.map(function(e) {
            return e.x;
        });

        var xScale = d3.scale.linear()
            .domain([this.props.from,this.props.to])
            .range([origin.x + 15 , this.props.width - this.props.margin.left - this.props.leftLegendSpacing - 15]);

        var yScale = d3.scale.linear()
            .domain([0, 1])
            .range([origin.y, this.props.margin.top + this.props.topTitleHeight]);

        return (
            <svg
                className="chart"
                width={this.props.width}
                height={this.props.height}
                >
                <g>
                    <Title
                        text="My title"
                        x={(this.props.width - this.props.margin.left - this.props.yAxisWidth - this.props.leftLegendSpacing - this.props.margin.right) / 2 + this.props.margin.left + this.props.yAxisWidth}
                        y={this.props.margin.top + this.props.topTitleHeight}
                    />
                    <Legend
                        x={this.props.width - this.props.margin.right - this.props.leftLegendSpacing}
                        y={this.props.margin.top + this.props.topTitleHeight}
                        width={this.props.leftLegendSpacing}
                        height={this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight}
                    />
                    <YAxis
                        label="beta value"
                        leftMargin={this.props.margin.left}
                        origin={origin}
                        height={this.props.height - this.props.margin.top - this.props.topTitleHeight - this.props.margin.bottom - this.props.xAxisHeight}
                        yScale={yScale}
                    />
                    <XAxis
                        label="genomic location"
                        origin={origin}
                        width={this.props.width - this.props.margin.left - this.props.margin.right - this.props.leftLegendSpacing - this.props.yAxisWidth}
                        xScale={xScale}
                        height={this.props.xAxisHeight}
                    />
                    <Boxplot
                        width={this.props.width - this.props.margin.left - this.props.margin.right}
                        height={this.props.height - this.props.margin.top - this.props.margin.bottom}
                        data={this.props.data}
                        xScale={xScale}
                        yScale={yScale}
                    />
                </g>
            </svg>
        );
    }
});

var Boxplot = React.createClass({


    getDefaultProps: function () {
        return {
            data: [],
            width: 0,
            xScale: null,
            yScale: null,
            boxWidth: 15
        }
    },

    componentDidMount: function() {
        console.log("Boxplot loaded");
    },

    render: function () {

        var xScale = this.props.xScale;
        var yScale = this.props.yScale;
        var data = this.props.data;
        var boxwidth = this.props.boxWidth;

        var boxes = this.props.data.map(function(point) {
            return (
                <SpreadBox
                    x={xScale(point.x) - (boxwidth/2)}
                    name={point.name}
                    median={yScale(point.median)}
                    width={boxwidth}
                    q1={yScale(point.q1)}
                    q3={yScale(point.q3)}
                    whiskerUp={yScale(point.whiskerUp)}
                    whiskerDown={yScale(point.whiskerDown)}
                    outliers={point.outliers.map(function (value) {return yScale(value)})}
                />
            );
        });

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

        return (
            <g
                className="plotPannel"
            >
                {boxes}
            </g>
        )

    }
});

var SpreadBox = React.createClass({

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
        }
    },

    componentDidMount: function() {
        console.log(this.props.name + " mounted");
    },

    onMouseOver: function (e) {
        alert(e.clientX);
        return (
            <text x="20" y = "20" >BOB!!</text>
        )
    },

    render: function () {
        var xCenter = this.props.x + (this.props.width * 0.5);
        var outliers = this.props.outliers.map(function(value) {
            return (
                <circle
                    className="outlier"
                    cx={xCenter}
                    cy={value}
                    r="2"
                />
            )
        });

        return (
            <g
                className="spread-box"
                title={this.props.name}
                data-toggle="tooltip"
                data-placement="right"
                onMouseOver={this.onMouseOver}
            >
                <line
                    className="center-line"
                    x1={xCenter}
                    x2={xCenter}
                    y1={this.props.whiskerUp}
                    y2={this.props.whiskerDown}
                />
                <rect
                    height={this.props.q1 - this.props.q3}
                    width={this.props.width}
                    x={this.props.x}
                    y={this.props.q3}
                />
                <line
                    className="median"
                    x1={this.props.x}
                    x2={this.props.x + this.props.width}
                    y1={this.props.median}
                    y2={this.props.median}
                />
                <line
                    className="whisker"
                    x1={this.props.x}
                    x2={this.props.x + this.props.width}
                    y1={this.props.whiskerUp}
                    y2={this.props.whiskerUp}
                />
                <line
                    className="whisker"
                    x1={this.props.x}
                    x2={this.props.x + this.props.width}
                    y1={this.props.whiskerDown}
                    y2={this.props.whiskerDown}
                />
                {outliers}
            </g>
        )
    }
});

var Title = React.createClass({
    render: function () {
        return (
            <text
                className="chart-title"
                x={this.props.x}
                y={this.props.y}
                textAnchor="middle"
            >
                {this.props.text}
            </text>
        )
    }
});

var Legend = React.createClass({
    render: function () {
        return (
            <rect
                x={this.props.x}
                y={this.props.y}
                width={this.props.width}
                height={this.props.height}
            />
        )
    }
});

var XAxis = React.createClass({
    getDefaultProps: function () {
        var xScale = d3.scale.linear()
            .domain([0,1])
            .range([0,1]);

        return {
            label: "",
            origin: {x:0, y:0},
            width: 0,
            height: 0,
            xScale: {xScale},
            ticks: []
        }
    },

    render: function () {

        var props = this.props;
        var ticks = props.xScale.ticks(10).map(function(t) {
            return (
                <XTick
                    x={props.xScale(t)}
                    y={props.origin.y}
                    label={t}
                />
            )
        });

        return (
            <g className="axis" id="x-axis">
                <text
                    x={props.origin.x + props.width}
                    y={props.origin.y + props.height}
                    dx="0"
                    dy="-0.5em"
                    textAnchor="end"
                >
                    {props.label}
                </text>
                <line
                    x1={props.origin.x}
                    x2={props.origin.x + props.width}
                    y1={props.origin.y}
                    y2={props.origin.y}
                />
                {ticks}
            </g>
        )
    }

});

var YAxis = React.createClass({
    getDefaultProps: function () {
        var yScale = d3.scale.linear()
            .domain([0,1])
            .range([0,1]);

        return {
            label: "",
            origin: 0,
            width: 0,
            yScale: {yScale},
            ticks: []
        }
    },

    render: function () {

        var props = this.props;
        var tickValues = [0, 0.2, 0.6, 1]
        var ticks = tickValues.map(function(t) {
            return (
                <YTick
                    x={props.origin.x}
                    y={props.yScale(t)}
                    label={t}
                />
            )
        });
        var dx = "-" + props.label.length + "em";

        return (
            <g className="axis" id="y-axis">
                <text
                    className="y-axis-label"
                    x={props.origin.x}
                    y={props.yScale(1)}
                    dx={dx}
                    dy="-1em"
                    textAnchor="start"
                    transform="translate(0,0) rotate(-90)"
                >
                    {props.label}
                </text>
                <line
                    x1={props.origin.x}
                    x2={props.origin.x}
                    y1={props.yScale(0)}
                    y2={props.yScale(1)}
                />
                {ticks}
            </g>
        )
    }
});

var XTick = React.createClass({
    getDefaultProps: function () {
        return {
            label: "",
            x: 0,
            y: 0
        }
    },

    render: function () {
        var props = this.props;
        return (
            <g className="axis">
                <text
                    className="x-axis-ticks-label"
                    x={props.x}
                    y={props.y + 5}
                    dy="1em"
                    textAnchor="middle"
                >
                    {props.label}
                </text>
                <line
                    className="x-axis-ticks-line"
                    x1={props.x}
                    x2={props.x}
                    y1={props.y}
                    y2={props.y + 5}
                />
            </g>
        )
    }
});

var YTick = React.createClass({
    getDefaultProps: function () {
        return {
            label: "",
            x: 0,
            y: 0
        }
    },

    render: function () {
        var props = this.props;
        return (
            <g className="axis">
                <text
                    className="y-axis-ticks-label"
                    x={props.x - 6}
                    y={props.y}
                    dy=".3em"
                    textAnchor="end"
                >
                    {props.label}
                </text>
                <line
                    className="y-axis-ticks-line"
                    x1={props.x}
                    x2={props.x - 5}
                    y1={props.y}
                    y2={props.y}
                />
            </g>
        )
    }
});