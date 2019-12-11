var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("assets/data/data.csv").then(function (data) {

    // Step 1: Parse Data/Cast as numbers (**only need to do this for numeric data**)
    // ==============================
    data.forEach(function (data) {
        data.age = +data.age;
        data.smokes = +data.smokes;

    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(data, d => d.age)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.smokes)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // var xMin;
    // var xMax;
    // var yMin;
    // var yMax;

    // xMin = d3.min(age, function (data) {
    //     return data.age;
    // });

    // xMax = d3.max(age, function (data) {
    //     return data.age;
    // });
    // yMin = d3.min(smokes, function (data) {
    //     return data.smokes;
    // });
    // yMax = d3.max(smokes, function (data) {
    //     return data.smokes;
    // });

    // xLinearSxale.domain([xMin, xMax]);
    // yLinearScale.domain([yMin, yMax]);
    // console.log(xMin);
    // console.log(yMax);


    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("null")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "purple")
        .attr("opacity", ".5")


    // Step 5.5: Append Text
    // ==============================
    // var textGroup = chartGroup.selectAll("null")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .text(d => xScale(d[abbr]))
    //     .attr("class", "stateText")
    //     .attr("x", d => xScale(d[age]))
    //     .attr("y", d => yScale(d[smokes]));
    //     .text(d => d.abbr)

    var stateText = chartGroup.append('g').selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .classed('stateText', true) //classed as in the d3 css sheet
        .attr('x', d => xLinearScale(d.age))
        .attr('y', d => yLinearScale(d.smokes))
        .attr('transform', 'translate(0,4.0)')
        .text(d => `${d.abbr}`)



    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(d => {
            return (`${d.state} <br>Smokes: ${d.smokes} <br>Age: ${d.age}`);
        });
    svg.call(toolTip);


    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age");
}).catch(function (error) {
    console.log(error);
});
