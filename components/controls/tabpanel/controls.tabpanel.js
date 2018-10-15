//     controls.tabpanel.js
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    function CTabPanel(parameters, attributes) {
        
        this.initialize('controls.tabpanel', parameters, attributes)
            .class('tabpanel');
        
        var header = this.add('header:bootstrap.TabPanelHeader'),
            body = this.add('body:bootstrap.TabPanelBody`panel-body');
        
        // place tabs on this.content panel
        $DOC.processContent(body, attributes.$text);
        attributes.$text = '';
        
        var found_active = false;
        body.each(function(tabpage) {
            if (tabpage.__type === 'bootstrap.TabPage') {
                var tabheader = header.add('bootstrap.TabHeader', {$href:'#' + tabpage.id, $text:tabpage.parameter('header')});
                if (tabpage.parameters.active) {
                    found_active = true;
                    tabheader.class('active');
                    tabpage.class('active in');
                }
            }
        });
        
        if (!found_active && header.length) {
            header.first.class('active');
            body.first.class('active in');
        }
    };
    CTabPanel.prototype = controls.control_prototype;
    controls.typeRegister('tabpanel', CTabPanel);
    
    
    function tabpage_factory(parameters, attributes) {
        
        // create and customize bootstrap.TabPage
        
        // create control
        var bootstrap_tabpage = controls.createBase('bootstrap.TabPage', parameters, attributes);
        
        // first #parameter name - tab caption
        
        // Here: this control is wrapped with HTML and markup not be processed.
        // To process the markup at this level:
        
        var this_text = bootstrap_tabpage.attributes.$text;
        bootstrap_tabpage.attributes.$text = '';
        $DOC.processContent(bootstrap_tabpage, this_text);
        
        // process markup template:
        bootstrap_tabpage.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());

        return bootstrap_tabpage;
    }
    controls.factoryRegister('tabpage', tabpage_factory);
    

}})();
