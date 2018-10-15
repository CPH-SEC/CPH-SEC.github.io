//     gcharts.PieChart.js control for displaying Google Charts.Pie Chart
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    var jsapi_state = 0, corechart_state = 0, not_drawn = [];
    $DOC.appendScript('www.google.com/jsapi', 'https://www.google.com/jsapi', function(state) {
        jsapi_state = state;
        if (jsapi_state > 0) {
            google.load('visualization', '1.0', {packages:['corechart'], callback: function() {
                corechart_state = 1;
                for(var i in not_drawn)
                    not_drawn[i].draw();
                not_drawn = undefined;
            }});
        }
    });
    
    var OPTIONS = 'backgroundColor backgroundColor.stroke backgroundColor.strokeWidth backgroundColor.fill chartArea chartArea.left chartArea.top chartArea.width chartArea.height fontSize fontName height is3D legend legend.position legend.alignment legend.textStyle pieHole pieSliceBorderColor pieSliceText pieSliceTextStyle pieStartAngle sliceVisibilityThreshold title titleTextStyle tooltip tooltip.showColorCode tooltip.text tooltip.textStyle tooltip.trigger width';
    

    function CPieChart(parameters, attributes) {
        
        controls.controlInitialize(this, 'gcharts.PieChart', parameters, attributes);
        this.style('min-width:50px;min-height:50px;');
        
        var data;
        try {
            data = JSON.parse(this.text());
        } catch(e) {}
        
        this.text('');
        
        if (!Array.isArray(data))
            data = [];
        
        var options = {
            title: parameters.title || ''
        };
        
        // copy options
        for(var prop in parameters)
        if (OPTIONS.indexOf(prop) >= 0)
            options[prop] = parameters[prop];
        
        var chart;
        
        this.draw = function() {
            var element = this._element;
            if (element) {
                
                if (corechart_state) {
                
                    if (!chart || chart.element !== element)
                        chart = new google.visualization.PieChart(element);

                    var gdatatable = google.visualization.arrayToDataTable(data);
                    chart.draw(gdatatable, options);
                }
            }
        };
        
        this.listen('element', function(element) {
            if (element)
                this.draw();
        });
        
        if (!corechart_state)
            not_drawn.push(this);
    };
    CPieChart.prototype = controls.control_prototype;
    controls.typeRegister('gcharts.PieChart', CPieChart);
}

}).call(this);
