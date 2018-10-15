(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    var all_themes = {
        '':'Bootstrap Default',
        'amelia-theme':'Bootswatch: Amelia',
        'cerulian-theme':'Bootswatch: Cerulian',
        'cosmo-theme':'Bootswatch: Cosmo',
        'cyborg-theme':'Bootswatch: Cyborg',
        'flatly-theme':'Bootswatch: Flatly',
        'journal-theme':'Bootswatch: Journal',
        'readable-theme':'Bootswatch: Readable',
        'simplex-theme':'Bootswatch: Simplex',
        'slate-theme':'Bootswatch: Slate',
        'spacelab-theme':'Bootswatch: Spacelab',
        'united-theme':'Bootswatch: United',
        'msdn-like-theme':'MSDN-like'
    };

    // check the browser support localStorage
    if (typeof localStorage !== 'undefined')
    $DOC.onload(function() {
        var exists = $DOC.vars.theme_switcher_menu_item;
        if (exists) {
            if ($DOC.mode)
                exists.deleteElement();
        } else {
            var navbar_ul = $('.navbar-collapse > ul').first();
            if (navbar_ul) {
                // create mods submenu
                var menuitem = controls.create('li', {id:'theme-switcher-menu-item', class:'dropdown'})
                    ._add('a', {class:'dropdown-toggle', 'data-toggle':'dropdown', $text:'Mods<b class="caret"></b>', href:'#'})
                    ._add('ul', {class:'dropdown-menu'}, function(modslist) {
                        Object.keys(all_themes).forEach(function(theme) {
                            modslist
                                .add('li')
                                    .add('a', {$text:all_themes[theme], href:'#theme=default', $theme:theme})
                                        .listen('click', function() {
                                            $DOC.theme = this.attributes.$theme;
                                            event.preventDefault();
                                        });
                        });

                        modslist
                            .add('li')
                                .add('a', {href:$DOC.root + 'customize-with-a-Bootstrap-theme.html', $text:'How to customize with a Bootstrap theme'});
                    });

                navbar_ul.append(menuitem.outerHTML());
                menuitem.attachAll();
                $DOC.vars.theme_switcher_menu_item = menuitem;
            }
        }
    });
    
}})();