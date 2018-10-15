//     gcharts.PieChart.js control for displaying d3.BubbleChart
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    var d3v3_state = 0, not_drawn = [];
    $DOC.appendScript('d3.v3', 'http://d3js.org/d3.v3.js', function(state) {
        d3v3_state = state;
        if (d3v3_state > 0) {
            for(var i in not_drawn)
                not_drawn[i].draw();
            not_drawn = undefined;
        }
    });
    

    function CBubbleChart(parameters, attributes) {
        
        controls.controlInitialize(this, 'd3.BubbleChart', parameters, attributes);
        this.style('min-width:50px;min-height:50px;');
        
        var data;
        try {
            data = JSON.parse(this.text());
        } catch(e) {}
        
        this.text('');
        
        if (!data)
            data = {};
        
        this.draw = function() {
            var element = this._element;
            if (element && d3v3_state)
                draw.call(this);
        };
        
        function draw() {
            
            var diameter = parseInt(this.parameters.diameter) || 960,
            format = d3.format(",d"),
            color = d3.scale.category20c(),
            element = this._element;

            var bubble = d3.layout.pack()
                .sort(null)
                .size([diameter, diameter])
                .padding(1.5);

            var svg = d3.select(element).append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");

            var node = svg.selectAll(".node")
                .data(bubble.nodes(classes(data))
                .filter(function(d) { return !d.children; }))
              .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.append("title")
                .text(function(d) { return d.className + ": " + format(d.value); });

            node.append("circle")
                .attr("r", function(d) { return d.r; })
                .style("fill", function(d) { return color(d.packageName); });

            node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .text(function(d) { return d.className.substring(0, d.r / 3); });


            // Returns a flattened hierarchy containing all leaf nodes under the root.
            function classes(root) {
              var classes = [];

              function recurse(name, node) {
                if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
                else classes.push({packageName: name, className: node.name, value: node.size});
              }

              recurse(null, root);
              return {children: classes};
            }

            d3.select(element).style("height", diameter + "px");
        }
        
        this.listen('element', function(element) {
            if (element)
                this.draw();
        });
        
        if (!d3v3_state)
            not_drawn.push(this);
    };
    CBubbleChart.prototype = controls.control_prototype;
    controls.typeRegister('d3.BubbleChart', CBubbleChart);
}

}).call(this);
