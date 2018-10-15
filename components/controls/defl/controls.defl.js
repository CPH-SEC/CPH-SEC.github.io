//     controls.defl.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT
// built-in [defl] - definition list component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    function Defl(parameters, attributes) {
        var control = controls.createBase('dl', parameters, attributes);

        control.text = function(text) {
            var terms = (text || '').split(/^--(.*)/m);
            for(var i = 1, c = terms.length; i < c; i+=2) {
                this.add('dt', terms[i]);
                this.add('dd', terms[i+1]);
            }
        };

        control.text(attributes.$text);
        delete attributes.$text;

        return control;
    }
    controls.factoryRegister('defl', Defl);

}})();
