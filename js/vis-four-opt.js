function visFour() {
  var n = 10, // number of layers
    m = 17, // number of samples per layer
    stack = d3.layout.stack(),
    layers0 = stack(d3.range(n).map(function () {
      return bumpLayer(m);
    })),
    layers1 = stack(d3.range(n).map(function () {
      return bumpLayer(m);
    }));

  var width = $("#vis-four").width();
  var height = $("#sponsor-div").height();
  $("#vis-four").height(height);

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(layers0.concat(layers1), function (layer) {
      return d3.max(layer, function (d) {
        return d.y0 + d.y;
      });
    })])
    .range([height, 0]);

  var color = d3.scale.linear()
    .range(["#3e6b85", "#c5d2db"]);

  var svg = d3.select("#vis-four").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("opacity", "0.7");

  x.domain(layers0[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(layers0[layers0.length - 1], function(d) { return d.y0 + d.y; })]).nice();

  var layer = svg.selectAll(".layer")
    .data(layers0)
    .enter().append("g")
    .attr("class", "layer")
    .style("fill", function (d, i) {
      return (i == 0) ? "#f4921e" : color(i/(n-1));
    });

  layer.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y + d.y0); })
    .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
    .attr("width", x.rangeBand() - 1);

  var visFourTimer;

  $("#vis-four").appear();

  $("#vis-four").on('appear', function() {
    if (visFourTimer == undefined) {
      visFourTimer = window.setInterval(function () {
        d3.selectAll(".layer")
          .data(function () {
            var newLayer = stack(d3.range(n).map(function () {
              return bumpLayer(m);
            }));
            return newLayer;
          })
          .selectAll("rect")
          .data(function(d) { return d; })
          .transition()
          .ease("linear")
          .duration(2500)
          .attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y + d.y0); })
          .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
          .attr("width", x.rangeBand() - 1);
      }, 4000, true);
    }
  });

  $("#vis-four").on('disappear', function() {
    if (visFourTimer !== undefined) {
      visFourTimer = window.clearInterval(visFourTimer);
    }
  });

// Inspired by Lee Byron's test data generator.
  function bumpLayer(n) {

    function bump(a) {
      var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
      for (var i = 0; i < n; i++) {
        var w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function (d, i) {
      return {x: i, y: Math.max(0, d)};
    });
  }
}