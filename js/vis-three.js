function visThree() {
  var width = 480,
    height = 350,
    radius = Math.min(width, height) / 2;

  var svg = d3.select("#vis-three").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

  var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function (d) {
      return 1;
    });

  var arc = d3.svg.arc()
    .startAngle(function (d) {
      return d.x;
    })
    .endAngle(function (d) {
      return d.x + d.dx;
    })
    .innerRadius(function (d) {
      return Math.sqrt(d.y);
    })
    .outerRadius(function (d) {
      return Math.sqrt(d.y + d.dy);
    });

  d3.json("js/flare.json", function (error, root) {
    if (error) throw error;

    var path = svg.datum(root)
      .selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function (d) {
        return d.depth ? null : "none";
      }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#c5d2db")
      .style("fill", function (d) {
        return "#3e6b85";
      })
      .each(stash);

    var count = true;
    var timer = window.setInterval(function () {
      count = !count;
      var value = (count)
        ? function () {
        return 1;
      }
        : function (d) {
        return d.size;
      };
      path
        .data(partition.value(value).nodes)
        .transition()
        .duration(1500)
        .attrTween("d", arcTween);
    }, 3000);

    var timer2 = window.setInterval(function () {
      var randomPath = Math.floor(Math.random() * (path.size() + 1));
      path
        .style("fill", function (d, i) {
          return (i == randomPath) ? "#f4921e" : "#3e6b85";
        });
    }, 300);


  });

// Stash the old values for transition.
  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

// Interpolate the arcs in data space.
  function arcTween(a) {
    var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    return function (t) {
      var b = i(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return arc(b);
    };
  }
}
