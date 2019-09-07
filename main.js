var windowWidth = document.getElementById("chart").offsetWidth;
var windowHeight = document.getElementById("chart").offsetHeight;

console.log(windowWidth, windowHeight);

var treemapLayout = d3
  .treemap()
  .size([windowWidth, windowHeight])
  .paddingOuter(14);

function make(root) {
  var nodes = root.descendants();

  var u = d3
    .select("#chart")
    .append("svg")
    .selectAll("g.node")
    .data(nodes);

  var nodes = u
    .enter()
    .append("g")
    .classed("node", true);

  nodes
    .append("rect")
    .attr("x", function(d) {
      return d.x0;
    })
    .attr("y", function(d) {
      return d.y0;
    })
    .attr("width", function(d) {
      return d.x1 - d.x0;
    })
    .attr("height", function(d) {
      return d.y1 - d.y0;
    });

  nodes
    .append("text")
    .attr("x", function(d) {
      return d.depth === 3 ? 0.5 * (d.x0 + d.x1) : d.x0 + 3;
    })
    .attr("y", function(d) {
      return d.depth === 3 ? 0.5 * (d.y0 + d.y1) : d.y0 + 6;
    })
    .each(function(d) {
      var label = d.depth === 1 ? d.data.key : "";

      d3.select(this)
        .text(label)
        .style("font-size", d3.min([(1.4 * (d.x1 - d.x0)) / label.length, 12]))
        .style("display", d.x1 - d.x0 < 10 || d.y0 - d.y1 < 10);
    })
    .style("text-anchor", function(d) {
      return d.depth === 3 ? "middle" : "start";
    })
    .attr("dy", "0.3em");
}

function ready(err, data) {
  let nest = d3
    .nest()
    .key(function(data) {
      return data.CATEGORIAECONOMICA;
    })
    .key(function(data) {
      return data.GRUPONATUREZADESPESA;
    })
    .key(function(data) {
      return data.MODALIDADEAPLICACAO;
    })
    .entries(data);

  nest = {
    key: "root",
    values: nest
  };

  let root = d3
    .hierarchy(nest, function(data) {
      return data.values;
    })
    .sum(function(data) {
      return data.VALORLIQUIDADO;
    });

  treemapLayout(root);
  make(root);
}

d3.text("dados.csv", function(err, raw) {
  var dsv = d3.dsvFormat(";");
  var data = dsv.parse(raw);
  ready(err, data);
});
