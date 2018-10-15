//     controls.page-layout.js Page layout manager
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    function PageLayout(parameters, attributes) {
        
        controls.controlInitialize(this, 'page-layout', parameters, attributes);
        
        // media selector
        var media = this.parameter('media'),
            visible_columns = [], columnset_hash = '', out = [],
            padding = this.parameter('padding'); // padding parameter

        switch(this.parameter('scheme')) {

            // >> horizontal centered
            case 'centered':

                // default horizontal padding for 'centered' scheme
                padding = padding || '16px';


                var width = this.parameter('width') || '90%',
                    min_width = this.parameter('min-width') || width,
                    max_width = this.parameter('max-width') || width;
                var _width_ = '';
                if (width) _width_ += 'width:' + width + ';';
                if (min_width) _width_ += 'min-width:' + min_width + ';';
                if (max_width) _width_ += 'max-width:' + max_width + ';';


                out.push((media) ? ('@media (' + media + '){') : '');
                out.push(
'', // placeholder for columns
this.text(), // additional css
'body{margin:0 auto;', _width_, '}\
.header-bar, .header-panel, .footer-bar, .footer-panel { padding-left:' + padding + '; padding-right:' + padding + '; }\
.left-side-panel, .left-side-bar, .content-panel, .content-bar, .right-side-panel , .right-side-bar { display: inline-block; }');
                if (media)
                    out.push('}');

            break;
            // << horizontal centered
        }
       
        
        
        var columns = this.parameter('columns');
        if (columns) {
            columns = columns.split(',');
            var handler = setColumnsWidths.bind(this);
            $(window).on('resize', handler);
            $DOC.onload(handler);
        }
        
        function setColumnsWidths() {
            visible_columns = [];
            var cbody = $DOC.cbody;
            $DOC.columns.forEach(function(column) {
                var ccol = cbody[column];
                if (ccol) {
                    var element = ccol._element;
                    
                    if (!element || (element && $(element).is(":visible")))
                        visible_columns.push(column);
                }
            });
            var hash = visible_columns.join(',');
            if (hash !== columnset_hash) {
                // changed the composition of visible columns
                columnset_hash = hash;
                var widths = '';
                for(var i = 0, c = visible_columns.length; i < c; i++)
                if (i < columns.length) {
                    
                    widths += '.' + visible_columns[i] + '{width:' + columns[i] + ';';
                    
                    // set horizontal padding
                    if (i === 0)
                        widths += 'padding-left:' + padding + ';';
                    else if (i === c-1)
                        widths += 'padding-right:' + padding + ';';
                    
                    widths += '}';
                }
                out[1] = widths;
                this.refresh();
            }
        }
        
        
        
        this.template(function(it) { 
            return '<style' + it.printAttributes() + '>' + out.join('') + '</style>'; });
    };
    PageLayout.prototype = controls.control_prototype;
    controls.typeRegister('page-layout', PageLayout);

}})();
