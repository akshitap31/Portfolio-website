
var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height"),
g = svg.append("g").attr("transform", "translate(" + (width / 2 - 15) + "," + (height / 2 + 25) + ")");

var stratify = d3.stratify()
.parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

var tree = d3.cluster()
.size([360, 390])
.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

d3.csv("skills.csv", function(error, data) {
if (error) throw error;
console.log(data)
var root = tree(stratify(data)
  .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); }));

var link = g.selectAll(".link")
.data(root.descendants().slice(1))
.enter().append("path")
  .attr("class", "link")
  .attr("d", function(d) {
    return "M" + project(d.x, d.y)
        + "C" + project(d.x, (d.y + d.parent.y) / 2)
        + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
        + " " + project(d.parent.x, d.parent.y);
  });

var node = g.selectAll(".node")
.data(root.descendants())
.enter().append("g")
  .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
  .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

node.append("circle")
  .attr("r", 2.5);

node.append("text")
  .attr("dy", ".31em")
  .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
  .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
  .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
  .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
});

function project(x, y) {
var angle = (x - 90) / 180 * Math.PI, radius = y;
return [radius * Math.cos(angle), radius * Math.sin(angle)];
}


// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height"),
//     g = svg.append("g").attr("transform", "translate(40,0)");

// var tree = d3.tree()
//     .size([height - 400, width - 160]);

// var cluster = d3.cluster()
//     .size([height, width - 160]);

// var stratify = d3.stratify()
//     .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

// d3.csv("../data/skills.csv", function(error, data) {
//   if (error) throw error;

//   var root = stratify(data)
//       .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

//   cluster(root);

//   var link = g.selectAll(".link")
//       .data(root.descendants().slice(1))
//     .enter().append("path")
//       .attr("class", "link")
//       .attr("d", diagonal);

//   var node = g.selectAll(".node")
//       .data(root.descendants())
//     .enter().append("g")
//       .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
//       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

//   node.append("circle")
//       .attr("r", 2.5);

//   node.append("text")
//       .attr("dy", 3)
//       .attr("x", function(d) { return d.children ? -8 : 8; })
//       .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
//       .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });

//   d3.selectAll("input")
//       .on("change", changed);

//   var timeout = setTimeout(function() {
//     d3.select("input[value=\"tree\"]")
//         .property("checked", true)
//         .dispatch("change");
//   }, 1000);

//   function changed() {
//     timeout = clearTimeout(timeout);
//     (this.value === "tree" ? tree : cluster)(root);
//     var t = d3.transition().duration(750);
//     node.transition(t).attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
//     link.transition(t).attr("d", diagonal);
//   }
// });

// function diagonal(d) {
//   return "M" + d.y + "," + d.x
//       + "C" + (d.parent.y + 100) + "," + d.x
//       + " " + (d.parent.y + 100) + "," + d.parent.x
//       + " " + d.parent.y + "," + d.parent.x;
// }