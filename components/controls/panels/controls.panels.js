//     controls.panels.js
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

var bootstrap = controls.bootstrap;
    
    // Panel
    
    function Panel(parameters, attributes) {
        
        var panel = controls.createBase('bootstrap.Panel', parameters, attributes);

        var body = panel.body;
        $DOC.processContent(body, body.attributes.$text);
        delete body.attributes.$text;
        body.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        
        return panel;
    };
    controls.factoryRegister('panel', Panel);
    
    
    // Collapse
    
    function Collapse(parameters, attributes) {
        
        var start_collapsed = parameters.collapse || parameters.collapsed,
            header = parameters.header;
        
        var body = 
        this.initialize('collapse', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate())
            ._class('collapse-panel panel panel-' + this.getControlStyle())
            ._add('header:div', {
                        class: 'panel-heading collapse-header',
                'data-toggle': 'collapse',
                        $text: '<a href="#" class="panel-title">' + (header || '') + '</a>'
            })
            .add('collapse:div', {class:'panel-collapse collapse collapse-body' + (start_collapsed ? '' : ' in')})
            .add('body:div', {class:'panel-body'});
        this.header.attributes['data-target'] = '#' + this.collapse.id;
        
        body.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        $DOC.processContent(body, this.text());
        this.text('');
        
        // process markup template:
        
    };
    Collapse.prototype = bootstrap.control_prototype;
    controls.typeRegister('collapse', Collapse);
    
    
    // Alert
    
    function Alert(parameters, attributes) {
        
        this.initialize('alert', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate())
            .class('alert alert-' + this.getControlStyle() + ' fade in');
        
        // process markup at this level
        var this_text = this.text();
        this.text('');
        $DOC.processContent(this, this_text);
    };
    Alert.prototype = bootstrap.control_prototype;
    controls.typeRegister('alert', Alert);
    
    
    // Well
    
    function Well(parameters, attributes) {
        
        this.initialize('well', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate())
            .class('well');
        
        var size = this.getControlSize();
        if (size === 'small')
            this.class('well-sm');
        else if (size === 'large')
            this.class('well-lg');
        
        var this_text = this.text();
        this.text('');
        $DOC.processContent(this, this_text);
    };
    Well.prototype = bootstrap.control_prototype;
    controls.typeRegister('well', Well);
   
    
}})();
