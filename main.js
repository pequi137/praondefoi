var treemapLayout = d3
  .treemap()
  .size([900, 600])
  .padding(12);

function stratifyOrcamento(csv) {}

function make(root) {
  var nodes = root.descendants();

  var u = d3
    .select(".wrapper")
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
      var label = d.depth === 0 ? "" : d.depth === 3 ? d.data.Film : d.data.key;

      d3.select(this)
        .text(label)
        .style("font-size", d3.min([(1.4 * (d.x1 - d.x0)) / label.length, 11]))
        .style("display", d.x1 - d.x0 < 10 || d.y0 - d.y1 < 10);
    })
    .style("text-anchor", function(d) {
      return d.depth === 3 ? "middle" : "start";
    })
    .attr("dy", "0.3em");
}

function ready(err, data) {
  var nest = d3
    .nest()
    .key(function(d) {
      return d.CATEGORIAECONOMICA;
    })
    .key(function(d) {
      return d.GRUPONATUREZADESPESA;
    })
    .entries(data);

  nest = {
    key: "root",
    values: nest
  };

  var root = d3
    .hierarchy(nest, function(d) {
      return d.values;
    })
    .sum(function(d) {
      return d.VALORLIQUIDADO === undefined ? null : d.VALORLIQUIDADO;
    });

  treemapLayout(root);
  make(root);
}

d3.csv("dados.csv", ready);
