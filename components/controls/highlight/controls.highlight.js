//     controls.highlight.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    var script_loaded = 0, not_processed = [], controls = $ENV.controls,
        default_template = function(it) {
            return '<pre' + it.printAttributes() + '><code>' + controls.encodeHTML(it.text()) + '</code></pre>';
        },
        template = function(it) {
            var result, lang = it.parameter('lang');
            try {
                if (!hljs.LANGUAGES.hasOwnProperty(lang))
                    console.log('highlight.js: language ' + lang + ' module not found!');
                else
                    result = hljs.highlight(lang, it.text(), true);
            }
            catch (e) { console.log('highlight.js:' + e); }
            return '<pre' + it.printAttributes() + '><code>' + result.value + '</code></pre>';
        };
    
    function Highlight(parameters, attributes) {
        var loaded = (typeof hljs !== 'undefined');
        this.initialize('highlight', parameters, attributes, loaded ? template : default_template);
        if (!loaded) {
            // highlight.min.js yet not loaded
            if (script_loaded >= 0)
                not_processed.push(this);
        }
        
        var style = this.parameter('style');
        if (style)
            $DOC.appendCSS('highlight.js css', 'http://yandex.st/highlightjs/7.3/styles/' + style + '.min.css');
    
    }
    Highlight.prototype = controls.control_prototype;
    controls.typeRegister('highlight', Highlight);
    
    // call for each not_processed on highlight.min.js on script load result
    function on_script_state() {
        this.template((typeof hljs !== 'undefined') ? template : default_template);
        this.refresh();
    }
    
    // load from CDN:
    if (typeof hljs === 'undefined') {
        $DOC.appendScript('highlight.js', 'http://yandex.st/highlightjs/7.3/highlight.min.js', function(state) {
            script_loaded = state;
            for(var prop in not_processed)
                on_script_state.call(not_processed[prop]);
            not_processed = [];
        });
        $DOC.appendCSS('highlight.js css', 'http://yandex.st/highlightjs/7.3/styles/vs.min.css');
    }
}

}).call(this);
