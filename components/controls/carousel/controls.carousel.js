//     controls.carousel.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT
// require controls.js

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    function Carousel(parameters, attributes) {
        
        parameters['/namespace'] = 'bs-carousel';
        
        this.initialize('carousel', parameters, attributes)
            .class('carousel slide');
        
        // get parameters
        var interval = parameters.interval || 5000;
        var show_indicator = parameters.indicator; // show indicators
        var show_controls = parameters.controls; // show slide navigation
        
        // subcontrols
        var indicators = this.add('indicators:div', {class: 'carousel-indicators'});
        var inner = this.add('inner:div', {class: 'carousel-inner'});
        
        // place slides on this.inner panel
        $DOC.processContent(inner, this.text());
        this.text('');
        
        // remove burrs
        for(var i = inner.length - 1; i >= 0; i--)
        if (inner.controls[i].__type !== 'controls.div')
            inner.controls.splice(i, 1);
        
        if (show_indicator) {
            var index = 0;
            indicators.add('li', inner.length, {'data-target': "#" + this.id}, function (item) { item.attr('data-slide-to', index++); });
        }
        
        var found_active = false;
        for(var i = 0, c = inner.length; i < c; i++) {
            
            var slide = inner.controls[i];
            slide.class('item');
            if (slide.parameter('active')) {
                found_active = true;
                slide.class('active');
                if (show_indicator)
                    indicators.controls[i].class('active');
            }
        }
        
        if (!found_active && inner.length) {
            inner.first().class('active');
            if (show_indicator)
                indicators.first.class('active');
        }
        
        if (show_controls) {
            this.add('prev:a', {class: 'left carousel-control', href: '#'+this.id, 'data-slide': 'prev'})
                .add('span', {class: 'icon-prev'});
            this.add('next:a', {class: 'right carousel-control', href: '#'+this.id, 'data-slide': 'next'})
                .add('span', {class: 'icon-next'});
        }
        
        this.listen('element', function() {
            // on attach stub element is not valid carusel
            setTimeout(function() {
                if (this._element)
                    $(this._element).carousel({'interval': interval});
            }.bind(this) ,5);
        });
    };
    Carousel.prototype = controls.control_prototype;
    controls.typeRegister('carousel', Carousel);


    function carousel_slide_factory(parameters, attributes) {
        
        var slide = controls.createBase('div', parameters, attributes);
        slide.class('bs-carousel-slide');
        
        var text = slide.text();
        slide.text('');
        $DOC.processContent(slide, text);
        
        // process markup template:
        slide.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());

        return slide;
    }
    controls.factoryRegister('slide namespace=bs-carousel', carousel_slide_factory);

}})();
