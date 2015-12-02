"use strict"

/* TODO ::
 - axes
 - title
 - boxplot labels
 */

var GenomicViewer = React.createClass({

    propTypes: {
        DataURL : React.PropTypes.string.isRequired,
    },

    getDefaultProps: function () {
        return {
            width: 800,
            height: 400,
            DataURL: ''
        }
    },

    getInitialState: function () {
        return {
            data: [],
            isLoaded: false,
            loadedData: 0
        }
    },

    showAll: function () {
        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
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
                    data : data,
                    isLoaded : true
                });
            },
            error: function(data) {
                that.setState({ "error" : "Unknown error loading data" });
            }
        });
    },

    filter: function () {
        this.setState({data: []});
    },

    render: function () {
        return (
            <div>
                <div className="selection">
                    some filters
                    <ul>
                        <li onClick={this.showAll}>All</li>
                        <li onClick={this.filter}>Filter</li>
                    </ul>
                </div>
                <hr/>
                <Chart
                    width={this.props.width}
                    height={this.props.height}
                    data={this.state.data}>
                </Chart>
            </div>
        );
    }
});

var Chart = React.createClass({
    getDefaultProps: function () {
        return {
            margin: {top: 30, right: 50, bottom: 70, left: 50},
            data: []
        }
    },
    getInitialState: function () {
        return {
            data: this.props.data
        }
    },
    render: function () {
        var props = this.props;
        var data = props.data;
        return (
            <svg
                className="chart-container"
                width={this.props.width}
                height={this.props.height}
                className="box">
                <g transform="translate(50,30)">
                    <Title
                        text="My title"
                    />
                    <Legend />
                    <XAxis />
                    <YAxis />
                    <Boxplot
                        data={props.data}
                        width={props.width - props.margin.left - props.margin.right}
                        height={props.height - props.margin.top - props.margin.bottom}
                    />
                </g>
            </svg>
        );
    }
});

var Boxplot = React.createClass({
    getDefaultProps: function () {
        return {
            data: []
        }
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

        var yScale = d3.scale.linear()
            .domain([0, 1])
            .range([0, this.props.height]);

        var xScale = d3.scale.linear()
            .domain([10, 150])
            .range([0, this.props.width], 0.05);

        var boxes = data.map(function (point, i) {
            var y = props.height - yScale(point.q3),
                height = yScale(point.q3 - point.q1),
                x = xScale(point.x),
                width = xScale(15);

            return (
                <rect
                    className="box"
                    height={height}
                    width={width}
                    x={x}
                    y={y}
                    key={i}
                />
            )
        });

        var medians = data.map(function (point, i) {
            var y = yScale(1 - point.median),
                x1 = xScale(point.x),
                x2 = x1 + xScale(15);

            return (
                <line
                    className="median"
                    x1={x1}
                    y1={y}
                    y2={y}
                    x2={x2}
                    key={i}
                />
            )
        });

        var whiskersDown = data.map(function (point, i) {
            var y = yScale(1 - point.whiskerDown),
                x1 = xScale(point.x),
                x2 = x1 + xScale(15);

            return (
                <line
                    className="whisker"
                    x1={x1}
                    y1={y}
                    y2={y}
                    x2={x2}
                    key={i}
                />
            )
        });

        var whiskersUp = data.map(function (point, i) {
            var y = yScale(1 - point.whiskerUp),
                x1 = xScale(point.x),
                x2 = x1 + xScale(15);

            return (
                <line
                    className="whisker"
                    x1={x1}
                    y1={y}
                    y2={y}
                    x2={x2}
                    key={i}
                />
            )
        });

        var verticalLines = data.map(function (point, i) {
            var y2 = yScale(1 - point.whiskerUp),
                y1 = yScale(1 - point.whiskerDown),
                x = xScale(point.x) + (xScale(15) * 0.5);

            return (
                <line
                    className="center"
                    x1={x}
                    y1={y1}
                    y2={y2}
                    x2={x}
                    key={i}
                />
            )
        });

        var outliers = data.map(function (point) {
            var xCenter = xScale(point.x) + (xScale(15) * 0.5),
                radius = 5;

            return point.outlier.map(function (outlier, i) {
                var yCenter = yScale(1 - outlier);
                return (
                    <circle
                        className="outlier"
                        cx={xCenter}
                        cy={yCenter}
                        r={radius}
                        key={i}
                    />
                )
            });

        });

        var labels = data.map(function(point, i) {
            var median = (<text x={xScale(point.x)} y={yScale(1 - point.median)} dx="6" dy=".3em" textAnchor="start" key={"a"+i}>{point.median}</text>);
            var q1 = (<text x={xScale(point.x)+ xScale(15)} y={yScale(1 - point.q1)} dx="-6" dy=".3em" textAnchor="end" key={"b"+i}>{point.q1}</text>);
            var q3 = (<text x={xScale(point.x)+ xScale(15)} y={yScale(1 - point.q3)} dx="-6" dy=".3em" textAnchor="end" key={"c"+i}>{point.q3}</text>);
            var whiskersDown = (<text x={xScale(point.x)} y={yScale(1 - point.whiskerDown)} dx="-6" dy=".3em" textAnchor="end" key={"d"+i}>{point.whiskerDown}</text>);
            var whiskersUp = (<text x={xScale(point.x)} y={yScale(1 - point.whiskerUp)} dx="-6" dy=".3em" textAnchor="end" key={"e"+i}>{point.whiskerUp}</text>);
            return (
                [median, q1, q3, whiskersDown, whiskersUp]
            )
        });

        return (
            <g>
                {verticalLines}
                {boxes}
                {medians}
                {whiskersUp}
                {whiskersDown}
                {outliers}
                {labels}
                {this.props.children}
            </g>
        );
    }
});

var Title = React.createClass({
    render: function () {
        return (
            <text>{this.props.text}</text>
        )
    }
});

var Legend = React.createClass({
    render: function () {
        return (
            <text>Legend</text>
        )
    }
});

var XAxis = React.createClass({
    render: function () {
        return (
            <text>xAxis</text>
        )
    }
});

var YAxis = React.createClass({
    render: function () {
        return (
            <text>yAxis</text>
        )
    }
});
