function visFive() {
  var n = 17; // number of categories
  var margin = 10;
  var width = $("#vis-five").width() - margin;
  //var height = $("#vis-four").height() - margin;
  var height = $("#participant-div").height();
  $("#vis-five").height(height);
  var radius = (Math.min(width,height) / 2);
  var arc = d3.svg.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 100);

  var color = d3.scale.linear()
    .range(["#3e6b85", "#c5d2db"]);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
      return d.percent;
    });

  var svg = d3.select("#vis-five").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", "0.7")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var makeData = function() {
    var data = [];
    var sum = 0;
    for (var i = 0; i < n; i++) {
      var value = Math.random();
      data.push({percent: value});
      sum += value;
    }

    for (var i = 0; i < n; i++) {
      data[i].percent = data[i].percent * (1 / sum);
    }
    return data;
  };

  var data = makeData();

  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  var path = g.append("path")
    .attr("d", arc)
    .style("fill", function (d, i) {
      return (i == (n-1)) ? "#f4921e" : color(i * (1/n));
    })
    .each(function(d) { this._current = d; });

  var visFiveTimer;

  $("#vis-five").appear();

  $("#vis-five").on('appear', function () {
    if (visFiveTimer == undefined) {
      visFiveTimer = window.setInterval(function () {
        path = path.data(pie(makeData())); // compute the new angles
        path.transition().duration(2500).attrTween("d", arcTween); // redraw the arcs
      }, 2500, true);
    }
  });

  $("#vis-five").on('disappear', function () {
    if (visFiveTimer !== undefined) {
      visFiveTimer = window.clearInterval(visFiveTimer);
    }
  });

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }
}
