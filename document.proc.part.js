//     markdown-site-template
//     http://aplib.github.io/markdown-site-template/
//     (c) 2013 vadim b.
//     License: MIT
// require marked.js, controls.js, bootstrap.controls.js, doT.js, jquery.js

(function() { "use strict";
    
    if ($DOC.state)
        return;

    // load queued components before user.js
    if (window.defercqueue) {
        var q = window.defercqueue;
        delete window.defercqueue;
        for(var i = 0, c = q.length; i < c; i++)
        try {
            q[i]();
        } catch (e) { console.log(e); }
    }

    // document transformation started after all libraries and user.js is loaded
    $DOC.loadUserJS();
    
    // Stub controls loading dispatcher
    var stubs = {};
    function stubResLoader(stub) {
        // here if stub
        var original__type = stub.parameters['#{__type}'].split('.');
        var stublist = stubs[original__type];
        if (!stublist) {
            stublist = [];
            stubs[original__type] = stublist;
        }
        stublist.push(stub);
        var url = $DOC.components + original__type[0] + '/' + original__type[1] + '/' + original__type[0] + '.' + original__type[1] + '.js';
        // load component asynchronously
        var head = document.head, component_js = $(head).children('script[src*="' + url +'"]:first')[0];
        if (!component_js) {
            var component_js = controls.extend(document.createElement('script'), {src:url, async:true});
            component_js.addEventListener('load', function() { stubs[original__type].forEach(function(stub){ stub.state = 1; }); stubs[original__type] = []; });
            component_js.addEventListener('error', function() { stubs[original__type].forEach(function(stub){ stub.state = -1; }); stubs[original__type] = []; });
            head.appendChild(component_js);
        }
    }
    
    // Add text fragment to controls tree
    var template = function(it) { return it.getText() + it.controls.map(function(control) { return control.wrappedHTML(); }).join(''); };
    $DOC.addTextContainer = function(control, text) {
        
        // container.outerHTML() returns text as is
        var container = control.add('container', text);
        
        // if text contains template then compile to getText function
        var pos = text.indexOf('{{');
        if (pos >= 0 && text.indexOf('}}') > pos) {
            container.getText = controls.template(text);
            container.template(template);
        }
    };
    
    // $DOC.components_off - turn off filters and component translation
    $DOC.processContent = function(collection, text) {
        
        if (!text)
            return;
        
        if (this.components_off) {
            this.addTextContainer(collection, text);
            return;
        }
        
        // 1. apply filters
        
        var filters = this.filters;
        for(var i = 0, c = filters.length; i < c; i++) {
            var subst = filters[i];
            text = text.replace(subst.regex, subst);
        }

        // 2. Look for [] brackets
        
        // known patterns (string literals, not closed [pairs] etc) must be excluded from search
        var known_patterns = enumerateKnownPatterns(text, 0);
        
        var scan_forleft_bracket = 0,
            scan_forright_bracket = 0,
            scan_length = known_patterns.length,
            stack,
            found_parts = []; // texts and bbcodes
        
        // unclosed tags is not components, but break parsing
        // while found unclosed [xxx] pairs (without [/xxx]), repeat parse:
        while ((stack = findParts()).length) {
            // exclude all unclosed tags
            known_patterns.push.apply(known_patterns, stack);
            // sort ascending
            known_patterns.sort(function(i1, i2) { return i1.index - i2.index; });
            // and next iteration parse
            scan_forleft_bracket = 0;
            scan_forright_bracket = 0;
            scan_length = known_patterns.length;
            found_parts = []; // texts and bbcodes
        }
        
        // create components
        for(var i = 0, c = found_parts.length; i < c; i++) {
            var part = found_parts[i];
            if (typeof part === 'string')
                this.addTextContainer(collection, part);
            else
                AddCom.apply(this, part);
        }
        
        function findParts() {
            var text_start = 0,
                stack = [], level = 0, open_tag_pos, open_tag_len,
                left_bracket = text.indexOf('[');
            
            // iterate left bracket
            while(left_bracket >= 0) {

                // check if left bracket not in literal
                while(scan_forleft_bracket < scan_length && known_patterns[scan_forleft_bracket].lastIndex < left_bracket)
                    scan_forleft_bracket++;
                if (scan_forleft_bracket >= scan_length || left_bracket < known_patterns[scan_forleft_bracket].index || left_bracket >= known_patterns[scan_forleft_bracket].lastIndex) {

                    var right_bracket_found = false,
                        right_bracket = text.indexOf(']', left_bracket + 1);
                
                    // iterate right bracket
                    while(!right_bracket_found && right_bracket >= 0) {

                        // check if right bracket not in literal
                        while(scan_forright_bracket < scan_length && known_patterns[scan_forright_bracket].lastIndex < right_bracket)
                            scan_forright_bracket++;
                        if (scan_forright_bracket >= scan_length || right_bracket < known_patterns[scan_forright_bracket].index || right_bracket >= known_patterns[scan_forright_bracket].lastIndex) {

                            // [...] [/...] [.../]

                            var is_one_pair = text.charAt(right_bracket - 1) === '/', // one pair brackets [.../]
                                is_close_tag = text.charAt(left_bracket + 1) === '/'; // close tag brackets [/...]
                            if (is_close_tag) {
                                // is close tag - find complimentary open tag
                                var close_tag = text.slice(left_bracket + 2, right_bracket),
                                    level = -1;
                                // find last equal tag in stack and up to level
                                for(var i = stack.length - 1; i >= 0; i--)
                                    if (stack[i].type === close_tag) {
                                        level = i;
                                        break;
                                    }
                                if (level === 0) {
                                    // add text before bbcode
                                    if (open_tag_pos > text_start)
                                        found_parts.push(text.slice(text_start, open_tag_pos));
                                    text_start = right_bracket + 1;
                                    // found bbcode
                                    found_parts.push([is_one_pair, open_tag_pos, open_tag_len, left_bracket, right_bracket - left_bracket + 1]);
                                }
                                else if (level < 0)
                                    level = 0;
                                stack.length = level;
                            } else {
                                if (level === 0) {
                                    open_tag_pos = left_bracket;
                                    open_tag_len = right_bracket - left_bracket + 1;
                                }
                                if (is_one_pair) {
                                    // [.../] tag
                                    if (level === 0) {
                                        // add text before bbcode
                                        if (open_tag_pos > text_start)
                                            found_parts.push(text.slice(text_start, open_tag_pos));
                                        text_start = right_bracket + 1;
                                        // found bbcode
                                        found_parts.push([is_one_pair, open_tag_pos, open_tag_len, open_tag_pos, open_tag_len - 1]);
                                    }
                                } else {
                                    // push open tag - type that between ':' and ' #`@($'
                                    var opentag = text.slice(left_bracket + 1, right_bracket),
                                        split_opentag = opentag.match(/\S+?(?=#|@|\/|`|\s|$)/)[0].split(':'),
                                        type = split_opentag.pop();
                                    // push to stack open tag and position
                                    stack.push({type: type, index: left_bracket, lastIndex: right_bracket + 1});
                                    level++;
                                }
                            }
                            right_bracket_found = true;
                        }
                        right_bracket = text.indexOf(']', ++right_bracket);
                    }
                }
                left_bracket = text.indexOf('[', ++left_bracket);
            }
        
            // remaining text at end
            if (text_start < text.length)
                found_parts.push(text.slice(text_start));
            return stack;
        }
        
        function AddCom(is_one_pair, open_tag_pos, open_tag_len, close_tag_pos, close_tag_len) {
            var opentag = is_one_pair ? text.substr(open_tag_pos + 1, open_tag_len - 3) : text.substr(open_tag_pos + 1, open_tag_len - 2);
            try {
                var control = collection.addOrStub(opentag, text.slice(open_tag_pos + open_tag_len, close_tag_pos));
//                if (control) {

                    // create stub loader
                    if (control.isStub) {
                        control.listen('control', function(control) {
                            // raise 'com' event
                            var com = $DOC.events.component;
                            if (com)
                                com.raise(control);
                        });
                        new stubResLoader(control);
                    }

                    // raise 'com' event
                    var com = $DOC.events.component;
                    if (com)
                        com.raise(control);
//                }
//                else
//                    collection.add('p', '&#60;?&#62;');
            } catch (e) { console.log(e); } // error?
        }
    };
    
    // enumerate "string literal" and [](href)
    function enumerateKnownPatterns(text, start_from) {
        var lregex = /("[\s\S]*?")|(\[[^\[\]\n]*?\]\([^\(\)\n]*?\))/g, known_patterns = [], sresult;
        lregex.lastIndex = start_from;
        while(sresult = lregex.exec(text))
            known_patterns.push({index: sresult.index, lastIndex: lregex.lastIndex});
        return known_patterns;
    }
    
    $DOC.processTextNode = processTextNode;
    function processTextNode(text_node, value) {
        var sections = $DOC.sections, edit_mode = $OPT.edit_mode;
        
        if (edit_mode) {
            // remove controls if already created for this text_node
            for(var prop in $DOC.sections) {
                var section = $DOC.sections[prop];
                if (typeof section === 'object' && section.deleteAll && section.source_node === text_node) {
                    section.deleteAll();
                }
            }
        }
        
        var control,
            text = (arguments.length > 1) ? value : text_node.nodeValue,
            first_char = text[0],
            body = document.body,
            section_name;
        if (' \n\t`@$&*#(){}-%^~"|\/\\'.indexOf(first_char) < 0) {
            try {
                if (first_char === '[') {
                    // <--[namespace.cid params] ... -->
                    // search ']' not in string literal
                    var known_patterns = enumerateKnownPatterns(text, 1),
                        rcurrent = 0, llength = known_patterns.length,
                        right_bracket_found = false,
                    right_bracket = text.indexOf(']', 1);
                    while(!right_bracket_found && right_bracket >= 0) {
                        // check if not in literals
                        while(rcurrent < llength && known_patterns[rcurrent].lastIndex < right_bracket)
                            rcurrent += 2;
                        if (rcurrent >= llength || right_bracket < known_patterns[rcurrent].index || right_bracket >= known_patterns[rcurrent].lastIndex) {
                            right_bracket_found = true;
                            
                            var com_definition = text.slice(1, right_bracket),
                                com_content =  text.slice(right_bracket + 1);
                            control = controls.createOrStub(com_definition, com_content);
                        }
                        right_bracket++;
                        right_bracket = text.indexOf(']', right_bracket);
                    }
                } else if (first_char === '!') {
                    // <!--!sectionname--> - section remover
                    $DOC.removeSection(text.slice(1));
                    var parent = text_node.parentNode;
                    if (parent) parent.removeChild(text_node);
                } else {
                    // <--sectionname...-->
                    var namelen = text.indexOf(' '),
                        eolpos = text.indexOf('\n'),
                        move = text.indexOf('->');
                    if (namelen < 0 && eolpos < 0 && move < 0) {
                        // <--sectionname-->
                        $DOC.sectionPlaceholder(text, text_node);
                        // Do not delete the placeholder!
                    } else if (namelen < 0 && move > 0) {
                        // <--sectionname->newname-->
                        $DOC.sectionMover(text_node, text.slice(0, move), text.slice(move + 2));
                    } else {
                        // <--sectionname ...-->
                        if (eolpos > 0 && (namelen < 0 || eolpos < namelen))
                            namelen = eolpos;
                        if (namelen > 0 && namelen < 128) {
                            section_name = text.slice(0, namelen);
                            var section_value = text.slice(namelen + 1);
                            control = controls.create('div', {class:section_name});
                            control.name = section_name;
                            $DOC.addSection(section_name, control);
                            control.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
                            $DOC.processContent(control, section_value);
                        }
                    }
                }
                if (control) {
                    // insert control element to DOM

                    /* ? if (!control._element) // element exists if placeholder ? */
                    control.createElement(text_node, 2/*before node*/);
                    if (edit_mode === 2/*preview*/) {
                        control.source_node = text_node;
                        control.source_section = section_name;
                    }
                    else {
                        var parent = text_node.parentNode;
                        if (parent) parent.removeChild(text_node);
                    }
                    if (control._element && control._element.parentNode === body)
                        $DOC.cbody.add(control);

                    // create component loader
                    // FIX: (for orphaned control) start loading after DOM element was created
                    if (control.isStub)
                        new stubResLoader(control);
                    
                    $DOC.events.section.raise(section_name, control, text_node);
                }
            } catch (e) { console.log(e); }
        }
    }
    
    // process sections content
    function processSections(process_head, processed_nodes) {
        
        var head = document.head, body = document.body;
        if (!process_head && !body)
            return;
        
        var sections = $DOC.sections, order = $DOC.order;

        // process DOM tree text nodes
        
        var text_nodes = [],
            iterator = document.createNodeIterator(process_head ? head : body, 0x80, null, false),
            text_node = iterator.nextNode();
        while(text_node) {
            if (processed_nodes.indexOf(text_node) < 0) {
                processed_nodes.push(text_node);
                text_nodes.push(text_node);
            }
            text_node = iterator.nextNode();
        }
        
        for(var i = 0, c = text_nodes.length; i < c; i++)
            processTextNode(text_nodes[i]);
        
        if (process_head)
            return;
        
        // check body
        var cbody = $DOC.cbody;
        if (!cbody._element && body)
            cbody.attachAll();
        if (!cbody._element)
            return;
        
        // process other named sections content, applied from controls or user.js
        
        for(var name in sections)
        if (name) { // skip unnamed for compatibility
            try {
                var placeholder, content = sections[name];
                if (content && content.placeholder) {
                    placeholder = content.placeholder;
                    content = content.content;
                }
                if (typeof content === 'string') {

                    // translate section to control object

                    var section_control = cbody.add('div', {class:name});
                    section_control.name = name;
                    section_control.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
                    $DOC.processContent(section_control, content);

                    // create dom element and place in a definite order
                    
                    var created = false;
                    
                    if (placeholder) {
                        section_control.createElement(placeholder, 2);
                        created = true;
                    } else {
                        var in_order = order.indexOf(name);
                        if (in_order >= 0) {

                            // look element after in order
                            for(var i = in_order + 1, c = order.length; i < c; i++) {
                                var exists_after_in_order = sections[order[i]];
                                if (exists_after_in_order && typeof exists_after_in_order !== 'string') {
                                    // insert before
                                    section_control.createElement(exists_after_in_order.element, 2);
                                    created = true;
                                    break;
                                }
                            }

                            if (!created)
                            // look element before in order
                            for(var i = in_order - 1; i >= 0; i--) {
                                var exists_before_in_order = sections[order[i]];
                                if (exists_before_in_order && typeof exists_before_in_order !== 'string') {
                                    if (exists_before_in_order.source_node) {
                                        // insert after source node
                                        section_control.createElement(exists_before_in_order.source_node, 3);
                                    } else
                                        // insert after
                                        section_control.createElement(exists_before_in_order.element, 3);
                                        created = true;
                                        break;
                                }
                            }
                        }
                    }
                    
                    if (!created)
                        section_control.createElement(document.body, 0);
                    
                    sections[name] = section_control;
                }
            }
            catch (e) { console.log(e); }
        }
    }

    // document transformation started after all libraries and user.js is loaded
    $DOC.finalTransformation = function() {
        if ($DOC.state)
            return;
        
        $DOC.state = 1;
        $DOC.cbody.attach();
        $DOC.listen('section', patches);
        
        var processed_nodes = [];
        
        if ($DOC.mode) {
            
            // html
            
            var timer = setInterval(function() { onresize(); }, 25);
            
            $DOC.onready(function() {
                $DOC.cbody.attachAll();
                onresize();
                $(window).on('resize', onresize);
            });
            
            var onwindowload = function() {
                window.removeEventListener('load', onwindowload);
                if ($DOC.state > 1)
                    return;
                $DOC.state = 2;
                
                clearInterval(timer); // off timer after css loaded
                
                // raise 'load' event
                var load_event = $DOC.forceEvent('load');
                load_event.raise();
                load_event.clear();

                onresize(); // before and after 'load' event
                setTimeout(onresize, 200); // resized after css applying
            };
            
            // be sure to call
            if (document.readyState === 'complete')
                onwindowload();
            else
                window.addEventListener('load', onwindowload);
            
        } else if ($OPT.edit_mode !== 1 /*page not processed in edit mode*/) {
            
            // page transformation
            
            // delay first transformation -> timer
            var timer = setInterval(function() {
                processSections(false, processed_nodes); // sections may be inserted by components
                onresize();
            }, 25);
            
            $DOC.onready(function() {
                processSections(true, processed_nodes);
                processSections(false, processed_nodes);
                onresize();
                $(window).on('resize', onresize);
            });
            
            var onwindowload = function() {
                
                window.removeEventListener('load', onwindowload);
                clearInterval(timer); // off timer after css loaded
                
                if ($DOC.state > 1)
                    return;
                
                processSections(false, processed_nodes);
                
                $DOC.state = 2;
                
                // scroll to hash element
                // scroll down if fixtop cover element
                if (window.location.hash) {
                    window.location = window.location;
                    var pad = parseInt(window.getComputedStyle(document.body).paddingTop);
                    if (pad)
                        window.scrollBy(0, -pad);
                }
                
                // raise 'load' event
                var load_event = $DOC.forceEvent('load');
                load_event.raise();
                load_event.clear();

                onresize(); // before and after 'load' event
                setTimeout(onresize, 200); // resized after css applying
            };
            
            // be sure to call
            if (document.readyState === 'complete')
                onwindowload();
            else
                window.addEventListener('load', onwindowload);
        } else {
            // raise 'load' event
            var load_event = $DOC.forceEvent('load');
            load_event.raise();
            load_event.clear();
        }
    };

    
    // Patches
    
    // apply js patches for dom elements on transformation progress
    
    function patches(name, control, source_node) {
        if (control) {
            var element = control.element;
            if (element)
                $(element).find('table').addClass('table table-bordered table-stripped');
            else
                for(var prop in control.controls)
                    $(control.controls[prop].element).find('table').addClass('table table-bordered table-stripped');
        }
    }
    
    // fired on 1. dom manipulation 2. css loading in progress can size effects 3. window resize after page loaded
    
    function onresize() {
        // body padding
        var top = 0, right = 0, bottom = 0, left = 0;
        function calc(classname, prop) {
            var el = document.querySelector(classname);
            return (el) ? el[prop] : 0;
        }
        top += calc('.fixed-top-bar', 'clientHeight');
        top += calc('.fixed-top-panel', 'clientHeight');
        right += calc('.fixed-right-side-bar', 'clientWidth');
        right += calc('.fixed-right-side-panel', 'clientWidth');
        bottom += calc('.fixed-bottom-bar', 'clientHeight');
        bottom += calc('.fixed-bottom-panel', 'clientHeight');
        left += calc('.fixed-left-side-bar', 'clientWidth');
        left += calc('.fixed-left-side-panel', 'clientWidth');
        
        $DOC.appendCSS('document#onresize', 'body{padding: ' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px;}');
    }
    
    
    // check for start document transformation
    $DOC.onready( /* debian chromium fix: bind undefined, .bind() raise exception */ function() { $DOC.checkAllScriptsReady(); });
})();
