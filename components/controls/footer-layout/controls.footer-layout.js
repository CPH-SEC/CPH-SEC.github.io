//     controls.footer-layout
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    function FooterLayout(parameters, attributes) {
        
        this.initialize('footer-layout', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        
        var media = this.parameter('media'),        // media selector
            padding = this.parameter('padding'),    // padding parameter
            scheme = this.parameter('scheme') || 'line';
            
        $DOC.processContent(this, this.text());
        this.text('');

        switch(this.parameter('scheme')) {

            // >> horizontal centered
            case 'line':

                this.listen('element', function() {
                    this.lineParseDOM();
                });
                
                $DOC.appendCSS('controls.footer-layout.line',
'.cfl-line-container { margin:0; padding:0; float:left; }\
.cfl-line-container > li { line-height:32px; list-style:none; float:left; padding:12px 24px 12px 0px; }\
.cfl-line-item { line-height:32px; list-style:none; float:left; padding:12px 24px 12px 0px; }\
.cfl-line-container:last-child, .cfl-line-item:last-child { float:right; padding-right:0; }\
.cfl-line-container:first-child, .cfl-line-item:first-child { float:left; }\
');
        
                this.lineParseDOM = function() {
                    var element = this._element;
                    if (element) {

                        var nodes = element.childNodes;
                        for(var i = nodes.length - 1; i >= 0; i--) {
                            var node = nodes[i];
                            if (node.nodeType === 1) {
                                var tag = node.tagName.toUpperCase();
                                switch(tag) {
                                    case 'UL':
                                        $(node).addClass('cfl-line-container');
                                    break;
                                    case 'HR':
                                        element.removeChild(node);
                                    break;
                                    default:
                                        $(node).addClass('cfl-line-item');
                                }
                            }
                        }
                    }
                };
            break;
        }
    };
    FooterLayout.prototype = controls.control_prototype;
    controls.typeRegister('footer-layout', FooterLayout);


}})();
