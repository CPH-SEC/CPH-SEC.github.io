//     controls.navbar.js Boostrap-compatible navigation bar
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    function NavBar(parameters, attributes) {
        attributes.role = 'navigation';
        this.initialize('controls.navbar', parameters, attributes, $ENV.getDefaultTemplate('nav'), $ENV.getDefaultTemplate())
            .class('navbar navbar-default');

        // text contains two parts separated by '***', first part non togglable, second part is togglable
        var parts = (this.text() || '').split(/^\*\*\*/m);
        this.text('');

        // Brand part
        
        this.add('header:div`navbar-header')
            .template(function(it) {
return '<div' + it.printAttributes() + '>\
<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">\
<span class="sr-only">Toggle navigation</span>\
<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>'
+ $ENV.marked( (it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("") )
.replace(/<a href/ig, '<a class="navbar-brand" href')
+ '</div>'; 
        });
        if (parts.length > 1)
            $DOC.processContent(this.header, parts[0]);
        
        // Collapsible part
        
        this.add('collapse:div`collapse navbar-collapse navbar-ex1-collapse')
            .template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        $DOC.processContent(this.collapse, parts.slice(-1)[0]);
        
        this.applyElement = function() {
            var element = this._element;
            if (element) {
                
                var nav_uls = element.querySelectorAll('.navbar-collapse > ul');
                for(var i = 0, ci = nav_uls.length; i < ci; i++) {
                    var nav_ul = nav_uls[i],
                        clss = nav_ul.classList;
                    clss.add('nav');
                    clss.add('navbar-nav');
                }
                
                var dropdownmenus = element.querySelectorAll('ul ul');
                for(var j = 0, c = dropdownmenus.length; j < c; j++) {
                    var dropdownmenu = dropdownmenus[j];
                    dropdownmenu.classList.add('dropdown-menu');

                    var dropdown = dropdownmenu.parentElement;
                    dropdown.classList.add('dropdown');
                    var toggle = dropdown.getElementsByTagName('a')[0];
                    if (toggle) {
                        toggle.classList.add('dropdown-toggle');
                        toggle.setAttribute('data-toggle', 'dropdown');
                        toggle.setAttribute('href', '#');
                        if (toggle.innerHTML.indexOf('<b class="caret"></b>') <= 0)
                            toggle.insertAdjacentHTML('beforeend', '<b class="caret"></b>');
                    }
                }

                var current_location = window.location.href.toLowerCase().replace(/(^.*:)|(\/index.htm$)|(\/index.html$)|(#$)/g, ''),
                    current_location_segs = current_location.split('/');

                var links = element.querySelectorAll('a:not([href="#"])');
                for(var k = 0, ck = links.length; k < ck; k++) {
                    var link = links[k],
                        compare = link.href.toLowerCase().replace(/(^.*:)|(\/index.htm$)|(\/index.html$)|(#$)/g, '');
                    if (compare === current_location)
                        activateMenuItemItems(link);
                    else {
                        var compare_segs = compare.split('/'),
                            matched = true;
                        for(var l = 0, cl = compare_segs.length; l < cl && matched; l++)
                        if (compare_segs[l] !== current_location_segs[l])
                            matched = false;
                        if (matched)
                            activateMenuItemItems(link);
                    }
                }
            }
        };
                
        this.listen('element', function() {
            this.applyElement();
        });
        
        function activateMenuItemItems(link, top) {
            while(link.parentElement) {
                link = link.parentElement;
                if (link.tagName === 'LI')
                    link.classList.add('active');
            }
        }
    };
    NavBar.prototype = controls.control_prototype;
    controls.typeRegister('navbar', NavBar);

}})();
