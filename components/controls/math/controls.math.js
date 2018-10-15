//     controls.math.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    var script_loaded = 0, load_controls = [],
        script_template = controls['controls.script'].outer_template,
        preload_template = function(it) { return '<div' + it.printAttributes() + '>loading...</div>'; };
    
    // call for each load_controls on MathJax.js loaded
    function onload() {
        var math_type = this.parameters.type || Object.keys(this.parameters)[0] || 'mml';
        this.attr('type', 'math/' + math_type + '; mode=display');

        // in MathML <!-- − --> write as [!-- − --] (replace brackets) only if notation placed in <!--section -->
        if (math_type === 'mml' && this.attributes.$text)
            this.attributes.$text = this.attributes.$text.replace(/--\]/g, '-->').replace(/\[!--/g, '<!--');

        this.template(script_template);
        this.refresh();
    }
    
    // call for each load_controls on MathJax.js load error
    function onerror() {
        this.template(function(){ return '&lt;' + this.__type + '?&gt;';});
        this.refresh();
    }

    function CMathJax(parameters, attributes) {
        controls.controlInitialize(this, 'math.MathJax', parameters, attributes);
        
        if (typeof MathJax === 'undefined') {
            // MathJax yet not loaded
            if (script_loaded >= 0) {
                this.template(preload_template);
                load_controls.push(this);
            }
        } else {
            // MathJax loaded
            onload.call(this);
        }
    }
    CMathJax.prototype = controls.control_prototype;
    controls.typeRegister('math.MathJax', CMathJax);  // utype
    controls.typeRegister('controls.math', CMathJax); // cocurrent type
    

    // load from CDN:
    if (typeof MathJax === 'undefined') {
        var config = 'TeX-AMS-MML_HTMLorMML'; // http://docs.mathjax.org/en/latest/configuration.html
        $DOC.appendScript('math.MathJax', "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=" + config, function(state) {
            script_loaded = state;
            for(var prop in load_controls) {
                var control = load_controls[prop];
                if (state > 0)
                    onload.call(control);
                else
                    onerror.call(control);
            }
            load_controls = [];
        });
    }
}

}).call(this);
