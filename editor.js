(function() { 'use strict';
if (window.top !== window.self || window['mw-document-editor']) return; window['mw-document-editor'] = true;
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    var db, daourl, daoroot, host, cpanel, controller, table, toolbar, tabheaders, options, code_edit, parser, preview, timer0 = [], timer1 = [],
        pubsettings;

    $(window).load(function() {
        location.url = decodeURI(location.href.split('?')[0]);
        
        daourl = controls.create('DataObject');
        daourl.key = location.url;
        daourl.fromJSON = function(data) {
            this.selected = data && data.selected;
            this.sourceMw = data && data.sourceMw;
            this.editMw   = data && data.editMw;
            this.history  = data && data.history;
            this.github_path  = data && data.github_path;
            // validate restored data
            if (!Array.isArray(this.history))
                this.history = [];
        };
        daourl.toJSON = function() {
            return {
                key:        this.key,
                selected:   this.selected,
                sourceMw:   this.sourceMw,
                editMw:     this.editMw,
                history:    this.history,
                github_path:    this.github_path
            };
        };
        
        daoroot = controls.create('DataObject');
        var resolve = document.createElement('script');
            resolve.setAttribute('src', $DOC.root);
        daoroot.key = resolve.src.split('?')[0];    
        daoroot.fromJSON = function(data) {
            this.github  = data && data.github;
        };
        daoroot.toJSON = function() {
            return {
                key:    this.key,
                github: this.github
            };
        };
        
        db = new DB({drafts:daourl, settings:daoroot}, function() {
            db.restore(openEditor);
        });
    });

    function openEditor() {
                
        // host adapter
        host = new Host();
        
        $DOC.cbody.attachAll();
        $DOC.appendCSS('document.editor.css', '.tooltip, .popover { z-index:1200; }');

        // parser-builder
        parser = new Parser();

        // preview
        $DOC.cbody.add(preview = new Preview());
        preview.createElement();

        // toolbar

        table = $DOC.cbody.add('div', {style:'overflow:hidden; border-radius:4px; position:fixed; top:20px;bottom:20px;right:20px; height:50%; width:50%; z-index:1101; border: silver solid 1px; background-color:white;'});
        toolbar = table.add('toolbar:div`clearfix', {style:'z-index:1111; background-color:#f0f0f0; line-height:32px; padding:0;'})
            .listen('element', function(element) {
                if (element)
                    $(element).find('button,li,a').tooltip({placement:'bottom', container:'body', toggle:'tooltip'});
            });
            
        // buttons revert, download, save

        toolbar.add('save_group:bootstrap.BtnGroup`mar5', function(save_group) {
            // revert button
            save_group.add('revert:bootstrap.Button', {$icon:'backward', 'data-original-title':'Revert'})
                .listen('click', function() {
                    controller.revert();
                });

            // download button
            var dfname = host.fileName || 'document.html';
            if (dfname.toLowerCase().slice(-5) !== '.html') dfname += '.html';
            save_group.add('download:a`btn btn-default', '<b class="glyphicon glyphicon-save"></b>',
                {download:dfname, 'data-original-title':'Download'})
                .listen('mousedown', setDataUrl)
                .listen('focus', setDataUrl)
                .listen('click', function(event) {
                    try {
                        // IE
                        var blob = new Blob([controller.buildHTML()]);
                        window.navigator.msSaveOrOpenBlob(blob, dfname);
                        event.preventDefault();
                        return;
                    } catch(e) {}
                });
                function setDataUrl() {
                    // download data:link chrome+ firefox+ opera+ ie- safari-
                    // context menu 'Save link as...'. 
                    controller.save();
                    save_group.download.element.href = (window.navigator.appName.indexOf('etscape') > 0 ? 'data:unknown'/*Safari*/ : 'data:application'/*other*/) + '/octet-stream;charset=utf-8,' + encodeURIComponent(controller.buildHTML());
                }

            // save button
            save_group.add('save:bootstrap.SplitButton', {$icon:'floppy-disk', 'data-original-title':'Save'}, function(splitbutton) {
                splitbutton.button
                    ._class('disabled')
                    .listen('click', function() {
                        controller.write();
                    });
                splitbutton.toggle._class('disabled');
                splitbutton.items.add('bootstrap.DropdownItem', {$icon:'resize-small'}).listen('click', function() {
                    controller.write(0);
                }).text('.html');
                splitbutton.items.add('bootstrap.DropdownItem', {$icon:'resize-full'}).listen('click', function() {
                    controller.write(1);
                }).text('.html + .mw.html');
                splitbutton.items.add('bootstrap.DropdownItem', {$icon:'share-alt'}).listen('click', function() {
                    controller.copy();
                }).text('Copy');
            });
            
            toolbar.add('cpanel:bootstrap.Button`hide fleft martop5 marbottom5 marleft5 padleft15 padright15', {$icon:'cog', 'data-original-title':'Control panel'})
                .listen('click', function() {

                });
        });

        // buttons fullscreen, flip, close

        toolbar.add('bootstrap.Button`mar5 fright', {$icon:'remove', 'data-original-title':'Close editor (Ctrl-F12)'})
            .listen('click', function() {
                var url = location.href, pos = url.indexOf('?edit'); if (pos < 0) pos = url.indexOf('&edit');
                if (pos >= 0)
                    window.location = url.slice(0, pos) + url.slice(pos + 5);
            });

        var split = toolbar.add('bootstrap.Splitbutton`martop5 fright', {$icon:'fullscreen'});
        split.button.listen('click', function() {
            controller.mode = (controller.mode) ? 0 : 1;
        });
        var items = split.items;
        items.add('bootstrap.DropdownItem', {$icon:'chevron-left'}).listen('click', function() {
            controller.position = 1;
        });
        items.add('bootstrap.DropdownItem', {$icon:'chevron-right'}).listen('click', function() {
            controller.position = 0;
        });
        items.add('bootstrap.DropdownItem', {$icon:'chevron-up'}).listen('click', function() {
            controller.position = 2;
        });
        items.add('bootstrap.DropdownItem', {$icon:'chevron-down'}).listen('click', function() {
            controller.position = 3;
        });
        
        toolbar.add('export_group:bootstrap.BtnGroup`mar5', function(export_group) {
            export_group.add('github:bootstrap.Button', {'data-original-title':'Publish'})
                ._icon('export')._text('GitHub')
                .listen('click', function() {
                    pubsettings.getSettings(false, function(flag) {
                        if (flag)
                            pubsettings.publish();
                    });
                });
//            export_group.add('github:bootstrap.Button', {'data-original-title':'Publish settings'})
//                ._icon('cog')
//                .listen('click', function() {
//                    pubsettings.getSettings(true);
//                });
        });
        
        
        
        
        // tabheaders
        toolbar.add(tabheaders = new TabHeaders());

        // code edit
        table.add(code_edit = new CodeEditor());
        
        // options page
        table.add(options = new Options());

        // create form
        table.createElement();

        // app controller
        controller = new Controller();
        
        // Publish settings
        pubsettings = new PubSettings();
        
        // activators
        setInterval(function() { for(var i = 0, c = timer0.length; i < c; i++) timer0[i](); }, 25);
        setInterval(function() { for(var i = 0, c = timer1.length; i < c; i++) timer1[i](); }, 1000);
    }
    
    
    // options page
    function Options() {
        
        var options = controls.create('div', {class:'pad20'});
        
        var visible = true;
        Object.defineProperty(options, 'visible', {
            get: function() { return visible; },
            set: function(value) { visible = value; if (options.element) options.element.style.display = (visible) ? 'block' : 'none'; }
        });
        options.listen('element', function(element) { if (element) element.style.display = (visible) ? 'block' : 'none'; });
        
        var title_grp = options.add('bootstrap.FormGroup');
        title_grp.add('bootstrap.ControlLabel', {$text:'Title:'});
        title_grp.add('title_edit:bootstrap.ControlInput', {value:''})
            .listen('change', function() {
                parser.title = title_grp.title_edit.value;
            });
        
        parser.listen(function() {
            if (parser.title !== title_grp.title_edit.value)
                title_grp.title_edit.value = parser.title;
        });
        
        // to check for changes and rise data event
        options.save = function() {
        };
        
        return options;
    }


    function CodeEditor() { // mode, text, section
        
        var code_edit = controls.create('textarea', {class:'form-control', style:'font-family:Consolas,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace; display:none; border:0; border-radius:0; border-left:#f9f9f9 solid 6px; box-shadow:none; width:100%; height:100%; resize:none; '});
        
        code_edit.code_edit_resize = function() {
            var element = code_edit.element;
            if (element) {
                element.style.height = ($(table.element).height() - $(toolbar.element).height()) + 'px';
            }
        };
        $(window).on('resize', code_edit.code_edit_resize);
        timer1.push(code_edit.code_edit_resize);
        
        var mode = 0; // 0 - options, hide text area, 1 - html, 2 - section
        Object.defineProperty(code_edit, 'mode', {
            get: function() { return mode; },
            set: function(value) {
                if (value > 2)
                    value = 2;
                if (value !== mode) {
                    mode = value;
                    if (this.element)
                        code_edit.element.style.display = (mode) ? 'block' : 'none';
                    code_edit.code_edit_resize();
                }
            }
        });
        var editvalue;
        code_edit.listen('element', function(element) {
            if (element)
                element.value = editvalue;
            code_edit.code_edit_resize();
        });
        Object.defineProperty(code_edit, 'text', {
            get: function() { return this.element ? this.element.value : editvalue; },
            set: function(value) {
                editvalue = value || '';
                if (this.element)
                    this.element.value = editvalue;
                this.modified = 0;
            }
        });
        // to check for changes and rise data event
        code_edit.save = function() {
            checkForChanges();
            if (this.modified) {
                this.modified = 0;
                this.raise('text', editvalue);
            }
        };
        function checkForChanges() {
            if (code_edit.mode) {
                var element = code_edit._element;
                if (element && element.value !== editvalue) {
                    code_edit.modified = 25;
                    editvalue = element.value;
                }
            }
        }
        code_edit.listen('change', checkForChanges, true);
        
        timer0.push(function() {
            checkForChanges();
            if (code_edit.modified)
            if (--code_edit.modified < 2) {
                code_edit.modified = 0;
                code_edit.raise('text', editvalue);
            }
        });
        
        return code_edit;
    }
    
    
    function TabHeaders() {
        // item { id: text: hint: icon: }
        var selected, selectedIndex = -1;
        
        var tabs_header_control = toolbar.add('tabs_header:bootstrap.TabPanelHeader');
        tabs_header_control.bind(controls.create('dataarray'));
        
        // predefined tabs
        tabs_header_control.data.push({isoptions:true, text:'', hint:'Page options', icon:'list-alt'}, {ishtml:true, text:'HTML', hint:'Edit as HTML'});
        
        // set tab list
        tabs_header_control.setTabs = function(tabs) {
            var data = tabheaders.data;
            
            if (tabs.length + 2 < data.length)
                data.splice(1, data.length - tabs.length - 2);
            
            for(var i = data.length, to = tabs.length + 2; i < to; i++)
                data.splice(1, 0, {});
            
            for(var i = 1, c = data.length - 1; i < c; i++)
                data[i].text = tabs[i-1];

            data.raise();
        };
        
        function tabClick() {
            tabs_header_control.selectedIndex = tabs_header_control.controls.indexOf(this);
        }
        
        // synchronize controls with data array
        tabs_header_control.listen('data', function() {
            var subcontrols = tabs_header_control.controls, data = this.data;
            
            for(var i = subcontrols.length, c = data.length; i < c; i++)
                tabs_header_control.add('bootstrap.TabHeader')
                    .listen('click', tabClick);
                
            for(var i = subcontrols.length - 1, c = data.length; i >= c; i--) {
                var control = subcontrols[i];
                control.deleteAll();
                control.removeListener('click', tabClick);
                tabs_header_control.remove(control);
            }
            
            for(var i = 0, c = data.length; i < c; i++) {
                var item = data[i];
                item.id = subcontrols[i].id;
                var control = subcontrols[i];
                control.attributes['data-original-title'] = item.hint;
                control.attributes.$icon = item.icon;
                control.text(item.text);
                if (item === selected)
                    control.class('active');
                else
                    control.class(null, 'active');
            }
            
            tabs_header_control.checkSelection();
            
            if (tabs_header_control.element)
                tabs_header_control.refresh();
        });
        
        // selected
        
        Object.defineProperty(tabs_header_control, 'selectedIndex',
        {
            get: function() { return selectedIndex; },
            set: function(value) { this.selected = value; }
        });
        Object.defineProperty(tabs_header_control, 'selected',
        {
            get: function() { return selected; },
            set: function(value) {
                
                var data = this.data;

                if (typeof value === 'string') {
                    // by id
                    for(var i = 0, c = data.length; i < c; i++) {
                        var item = data[i];
                        if (item.id === value) {
                            this.selected = item;
                            return;
                        }
                    }
                    // by text
                    for(var i = 0, c = data.length; i < c; i++) {
                        var item = data[i];
                        if (item.text === value) {
                            this.selected = item;
                            return;
                        }
                    }
                    return;
                }
            
                if (typeof value === 'number') {
                    if (value >= 0 && value < data.length && value !== selectedIndex)
                        this.selected = data[value];
                    else if ( value === -1)
                        this.selected = undefined;
                    return;
                }
                
                var index = data.indexOf(value);
                if (index >= 0) {
                    var item = data[index];
                    if (item !== selected && selected)
                        this.lastSelected = selected;
                }
                if (value !== selected || index !== selectedIndex) {
                    for(var subcontrols = this.controls, i = 0, c = subcontrols.length; i < c; i++) {
                        if (i === index)
                            subcontrols[i].class('active');
                        else
                            subcontrols[i].class(null, 'active');
                    }
                    this.raise('selected', selected = value ? value : undefined, selectedIndex = index);
                }
            }
        });
        
        tabs_header_control.checkSelection = function() {
            var data = this.data;
            if (!data.length)
                this.selected = -1;
            else {
                var index = data.indexOf(selected);
                if (index < 0)
                    this.selected = this.lastSelected;
                if (!this.selected)
                    this.selected = 0;
            }
        };

        return tabs_header_control;
    }
    
    
    function Preview() {
        var update_inner_html, sections_keys;
        
        // set preview mode to url
        var url = location.href;
            url = url.slice(0, url.length - location.hash.length);
            if (url.indexOf('?') > 0)
                url += '&preview';
            else
                url += '?preview';
        preview = controls.create('iframe', {sandbox:'', src:url, style:'position:fixed; left:0; top:0; width:100%; height:100%; z-index:1100; border:none;'});
        
        preview.updateInnerHtml = function(inner_html, _sections_keys) {
            update_inner_html = inner_html;
            sections_keys = _sections_keys;

            var element = this.element,
                $doc = this.$DOC;
            if (element && $doc) {
                var doc = element.contentDocument,
                    win = element.contentWindow,
                    html = doc.getElementsByTagName('html')[0];
                if (html) {
                    $doc.initialize();
                    // update html
                    html.innerHTML = inner_html;
                    // reproduce document
                    $doc.headTransformation();
                    if (win.$OPT.userjs) {
                        $doc.loadUserJS(); // final transformation started after script loaded
                    } else {
                        setTimeout(function(){
                            $doc.finalTransformation();
                        },0);
                    }
                }
            }
        };
        
        preview.reload = function() {
            if (this.element)
                this.deleteAll();
            this.createElement();
        };
        
        preview.listen('load', function() {
            // window.load event handlers preforms final transformation
            setTimeout(function() {
                // check if navigated out the current location
                try {
                    if (this.element.contentWindow.location.pathname !== window.location.pathname)
                        this.reload();
                } catch (e) {
                    this.reload();
                }

                this.$DOC = this.element && preview.element.contentWindow.$DOC;

                // update html
                if (update_inner_html !== undefined)
                    this.updateInnerHtml(update_inner_html, sections_keys);
            }.bind(preview), 0);
        });

        preview.updateNamedSection = function(name, text, updated_inner_html) {
            update_inner_html = updated_inner_html;
            var doc = this.$DOC;
            var doc_section = doc.sections[name];
            if (typeof doc_section === 'object' && doc_section.source_node) {
                doc.processTextNode(doc_section.source_node, name + '\n' + text);
            }
        };
        
        function html_entity_decode(text) {
            var ta = document.createElement('textarea');
            ta.innerHTML = text;
            return ta.value;
        }
        preview.grabHTML= function() {
            var doc = this.element && this.element.contentDocument,
            $doc = this.$DOC,
            // clone html document
            clone = doc.documentElement.cloneNode(),
            // remove text nodes
            iterator = doc.createNodeIterator(clone, 0x80, null, false),
            text_node = iterator.nextNode();
            while(text_node) {
                text_node.parentNode.removeChild(text_node);
                text_node = iterator.nextNode();
            }
            var html = '<!DOCTYPE html>' + clone.outerHTML
                // decode noscript node
                .replace(/<noscript>([\s\S]*?)<\/noscript>/g, function(m,innerText) { return '<noscript>' + html_entity_decode(innerText) + '</noscript>'; }),
                pos = html.lastIndexOf('</body>');
            return html.substr(0, pos) + '<script>$DOC.onready(function() { if ($OPT.edit_mode) return;'
             + '$DOC.chead = JSON.parse(unescape("' + escape(JSON.stringify($doc.chead)) + '"), controls.reviverJSON);'
             + '$DOC.cbody = JSON.parse(unescape("' + escape(JSON.stringify($doc.cbody)) + '"), controls.reviverJSON);'
             + '$DOC.vars = JSON.parse(unescape("' + escape(JSON.stringify($doc.vars)) + '"), controls.reviverJSON);'
             + '$DOC.onload(function(){ $DOC.chead.attachAll(); $DOC.cbody.attachAll(); for(var prop in $DOC.vars) { var v = $DOC.vars[prop]; if (v.__type) v.attachAll(); } });'
             + '});</script>'
             + html.substr(pos);
        };
        
        return preview;
    }
    
    
    // Parser and builder. Parse html and create html build tree.
    // 
    // html - parsed html
    // chtml - html builder root control
    // sections - parsed sections
    // seccontrols - map section name -> builder node
    function Parser() {
        var html;
        
        // >> key elements
        var chead;
        
        var title, ctitle;
        Object.defineProperty(this, 'title',
        {
            get: function() { return title; },
            set: function(value) {
                title = value;
                if (!ctitle) {
                    if (!chead)
                        return;
                    ctitle = chead.add('div');
                    ctitle.template(template);
                }
                ctitle.controls.length = 0;
                ctitle.opentag = '<title>' + value + '</title>';
                ctitle.closetag = '';
                html = this.buildHTML();
                this.raise();
            }
        });
        
        // << key elements
        
        function template() { // builder control template
            return (this.opentag || '')
                + (this.attributes.$text || '') + this.controls.map(function(control) { return control.outerHTML(); }).join('')
                + (this.closetag || '');
        };
        
        Object.defineProperty(this, 'html',
        {
            get: function() { return html; },
            set: function(value) {
                if (value !== html) {
                    html = value;
                    
                    var sections = {}, seccontrols = {};
                
                    var doc = document.implementation.createHTMLDocument(''),
                        docelement = doc.documentElement;
                    
                    var match = /<html[\s\S]*?>([\s\S]*)<\/html>/mi.exec(html);
                    if (match)
                        docelement.innerHTML = match[1];

                    var chtml = controls.create('div'); // root control
                    var nodes = [], nodecontrols = [];

                    var iterator = doc.createNodeIterator(docelement, 0xFFFF, null, false),
                        node = iterator.nextNode();
                    while(node) {

                        var control = (node === docelement) ? chtml : controls.create('div');
                        control.template(template);
                        nodes.push(node);
                        nodecontrols.push(control);
                        var index = nodes.indexOf(node.parentNode);
                        if (index >= 0)
                            nodecontrols[index].add(control);

                        // parse text node
                        if (node.nodeType === 8) {
                            var text = node.nodeValue, first_char = text[0];
                            control.opentag = '<!--' + node.nodeValue + '-->';

                            if (first_char === '%') {
                                // <--%namespace.cid#params( ... )%namespace.cid-->
                                // \ 1 cid \ 2 #params \ 3 content
                            } else if (first_char === '!') {
                                // <!--!sectionname--> - section remover
                            } else {
                                // <--sectionname...-->
                                var namelen = text.indexOf(' '),
                                    eolpos = text.indexOf('\n'),
                                    move = text.indexOf('->');
                                if (namelen < 0 && eolpos < 0 && move < 0) {
                                    // <--sectionname--> placeholder
                                } else if (namelen < 0 && move > 0) {
                                    // <--sectionname->newname--> mover
                                } else {
                                    if (eolpos > 0 && (namelen < 0 || eolpos < namelen))
                                        namelen = eolpos;
                                    if (namelen > 0 && namelen < 128) {
                                        var secname = text.slice(0, namelen);
                                        sections[secname] = text.slice(namelen + 1);
                                        seccontrols[secname] = control;
                                    }
                                }
                            }
                        } else if (node === docelement) {
                            // incorrect parsing <html> tag
                            // control === chtml
                            var match = /(<html[\s\S]*?>)[\s\S]*?<head/mi.exec(html);
                            control.opentag = '<!DOCTYPE html>\n' + (match ? match[1] : '<html>') + '\n';
                            control.closetag = '\n</html>';
                        } else {
                            // create template for no text node control

                            var outer = node.outerHTML, inner = node.innerHTML;
                            if (inner) {
                                var pos = outer.lastIndexOf(inner);
                                if (pos < 0)
                                    control.opentag = outer;
                                else {
                                    control.opentag = outer.slice(0,pos);
                                    control.closetag = outer.slice(pos + inner.length);
                                }
                            } else if (outer)
                                control.opentag = outer;
                            else
                                control.opentag = node.nodeValue;
                        }
                        node = iterator.nextNode();
                    }
                    
                    // >> key elements
                    
                    // head
                    var ehead = doc.getElementsByTagName('head')[0];
                    chead = ehead && nodecontrols[nodes.indexOf(ehead)];

                    
                    // title
                    var etitle = doc.getElementsByTagName('title')[0];
                    if (etitle) {
                        title = etitle.textContent;
                        ctitle = nodecontrols[nodes.indexOf(etitle)];
                    } else {
                        title = '';
                        ctitle = null;
                    }
                    
                    // << key elements
                    
                    this.chtml = chtml;
                    this.sections = sections;
                    this.seccontrols = seccontrols;
                    this.raise();
                }
            }
        });
        
        this.updateNamedSection = function(name, value) {
            var build_control = this.seccontrols[name];
            if (build_control) {
                this.sections[name] = value;
                build_control.opentag = '<!--' + name + '\n' + (value) + '-->\n';
                html = this.chtml.outerHTML();
            }
        };

        this.buildHTML = function() {
            return this.chtml.outerHTML();
        };
    }
    Parser.prototype = controls.create('DataObject');
    
    
    function Controller() {
        var controller = this;
        
        // on parser update html
        parser.listen(function() {
            controller.edit_html = parser.html;
            // update tabheaders
            tabheaders.setTabs(Object.keys(parser.sections));
            // update preview
            preview.updateInnerHtml(parser.chtml.innerHTML(), Object.keys(parser.sections));
        });

        // edited html
        var edit_html;
        Object.defineProperty(this, 'edit_html', {
            get: function() { return edit_html; },
            set: function(value) {
                if (value !== edit_html) {
                    edit_html = value;
                    parser.html = edit_html;
                }
            }
        });

        function activity() {
            if (controller.modified)
                controller.modified = 25;
        }
        
        // check unsaved changes
        this.checkEdits = function() {
            var tab = tabheaders.selected;
            if (tab && tab.isoptions)
                options.save();
            else if (tab)
                code_edit.save();
        };

        // on tab header selected
        tabheaders.listen('selected', this, function() {
            this.checkEdits();
            // update code_edit
            this.updateCodeEdit();
            this.modified = 5;
            options.visible = (tabheaders.selectedIndex === 0);
        });
        
        // update edit area
        this.updateCodeEdit = function() {
            var tab = tabheaders.selected;
            code_edit.mode = (!tab || tab.isoptions) ? 0 : (tab.ishtml) ? 1 : 2;
            switch(code_edit.mode) {
                case 1: // html
                    code_edit.text = controller.edit_html;
                    break;
                case 2: // sections
                    var selected = tabheaders.selected;
                    if (selected) {
                        // set selected section name and text to edit
                        code_edit.section = selected.text;
                        code_edit.text = parser.sections[selected.text];
                    } else
                        code_edit.text = '';
                    break;
                default:
                    code_edit.text = '';
            }
        };
        // on code editor data
        code_edit.listen('text', function(edit_value) {
            switch(code_edit.mode) {
                case 1: // html edited
                    controller.edit_html = edit_value;
                    controller.modified = 25;
                    break;

                case 2: // section code edited
                    controller.updateNamedSection(code_edit.section,  code_edit.text);
                    controller.modified = 25;
                    break;
            }
        });

        // update one section when the value of section edited
        this.updateNamedSection = function(name, value) {
            parser.updateNamedSection(name, value);
            edit_html = parser.buildHTML();
            preview.updateNamedSection(name, value, parser.chtml.innerHTML());
        };

        // save changes to db
        this.save = function() {
            this.checkEdits();
            
            daourl.selected = tabheaders.selected && tabheaders.selected.text;
            daourl.editMw = this.edit_html;
            // delete record if source not modified
            if (daourl.html === host.mwHtml)
                daourl.delete = true;
            daourl.raise();
            
            this.modified = 0;
        };
        
        // write or publish edited document
        this.write = function() {
            this.save();
            if (arguments.length)
                host.fileMode = arguments[0];
            if (host.fileMode){
                if (host.write(controller.buildHTML(), preview.grabHTML()))
                    db.onReady(function() { location.reload(); });
            }
            else
                if (host.write(controller.buildHTML()))
                    db.onReady(function() { location.reload(); });
        };
        
        this.copy = function() {
            this.save();
            var new_name = window.prompt('Enter file name', host.fileName);
            if (new_name && new_name !== host.fileName) {
                if (host.fileMode) {
                    var write_path = host.writeTo(new_name, controller.buildHTML(), preview.grabHTML());
                    if (write_path)
                        db.onReady(function() { window.location = write_path; });
                }
                else {
                    var write_path = host.writeTo(new_name, controller.buildHTML());
                    if (write_path)
                        db.onReady(function() { window.location = write_path; });
                }
            }
        };
        
        // revert()
        this.revert = function() {
            this.edit_html = host.mwHtml;
            this.updateCodeEdit();
            this.modified = 2;
            setTimeout(function() { window.location.reload(); }, 300);
        };

        this.buildHTML = function() {
            code_edit.save();
            return parser.buildHTML();
        };

        // >> form layout

        var mode = 0, position = 0, hpadding = 600, vpadding = 500;
        function setStyle(ptop, pright, pbottom, pleft, pwidth, pheight, ttop, tright, tbottom, tleft, twidth, theight) {
            if (preview.element) {
                var style = preview.element.style;
                style.top = ptop; style.right = pright; style.bottom = pbottom; style.left = pleft; style.width = pwidth; style.height = pheight;
                style = table.element.style;
                style.top = ttop; style.right = tright; style.bottom = tbottom; style.left = tleft; style.width = twidth; style.height = theight;
            }
        }
        function relayout() {
            if (mode) {
                switch(position) {
                    case 1: setStyle('0', '0', '0', '0', '100%', '100%',  'auto', 'auto', '20px', '20px', '50%', '50%'); break;
                    case 2: setStyle('0', '0', '0', '0', '100%', '100%',  '20px', 'auto', 'auto', '20px', '50%', '50%'); break;
                    case 3: setStyle('0', '0', '0', '0', '100%', '100%',  'auto', '20px', '20px', 'auto', '50%', '50%'); break;
                    default:setStyle('0', '0', '0', '0', '100%', '100%',  '20px', '20px', 'auto', 'auto', '50%', '50%');
                }
            } else {
                switch(position) {
                    case 1: setStyle('0', '0', '0', 'auto', '50%', '100%',  '0', 'auto', '0', '0', '50%', '100%'); break;
                    case 2: setStyle('auto', '0', '0', '0', '100%', '50%',  '0', '0', 'auto', '0', '100%', '50%'); break;
                    case 3: setStyle('0', '0', 'auto', '0', '100%', '50%',  'auto', '0', '0', '0', '100%', '50%'); break;
                    default:setStyle('0', 'auto', '0', '0', '50%', '100%',  '0', '0', '0', 'auto', '50%', '100%');
                }
            }
            code_edit.code_edit_resize();
        }
        
        // 0 - nonoverlapping preview and editor panels, 1 - preview full window, editor overlaps the preview window, 2 - preview in separate window
        Object.defineProperty(this, 'mode', {
            get: function() { return mode; },
            set: function(value) {
                mode = value;
                relayout();
                controller.saveLayout();
            }
        });

        // 0 - right, 1 - left, 2 - top, 3 - bottom
        Object.defineProperty(this, 'position', {
            get: function() { return position; },
            set: function(value) {
                position = value;
                relayout();
                controller.saveLayout();
            }
        });

        this.saveLayout = function() {
            if (typeof localStorage !== 'undefined')
                localStorage.setItem('editor layout', [mode, position, hpadding, vpadding].join(';'));
        };

        if (typeof localStorage !== 'undefined') {
            try {
                var vars = localStorage.getItem('editor layout').split(';');
                mode = parseInt(vars[0]);
                position = parseInt(vars[1]);
                hpadding = parseInt(vars[2]);
                vpadding = parseInt(vars[3]);
            } catch(e) {}
            relayout();
        }

        // << form layout


        // initialize
        var default_selected = localStorage && localStorage.getItem('default selected page');
        tabheaders.lastSelected = daourl.selected || default_selected || tabheaders.data[0];
        this.edit_html = daourl.editMw || host.mwHtml || '';
        tabheaders.checkSelection();
        if (host.writable) {
            toolbar.save_group.save.button.class(null, 'disabled');
            toolbar.save_group.save.toggle.class(null, 'disabled');
        }
        
        timer0.push(function() {
            if (this.modified && --this.modified < 2) {
                this.modified = 0;
                this.save();
            }
        }.bind(this));
    }
    
    function PubSettings() {
        // check github settings
        this.getSettings = function(force_open, callback) {
            var github = daoroot.github || (daoroot.github = {}),
                user = github.user,
                repo = github.repo,
                branch = github.branch,
                names = getMwFileName({fileName:daourl.github_path}),
                apikey = sessionStorage.getItem('github-apikey') || '';
        
                if (!names.fileName)
                    // /repo/path
                    names = getMwFileName({fileName:decodeURIComponent(location.pathname).split('/').slice(2).join('/')});
        
            // input settings
//            if (force_open || !user || !apikey || !repo || !names.fileName || !branch) {
                user = user || location.host.split('.')[0];
                repo = repo || decodeURIComponent(location.pathname).split('/')[1];
                branch = branch || 'gh-pages';
                
                var modal = $DOC.cbody.github_modal;
                if (!modal) {
                    modal = $DOC.cbody.github_modal = $DOC.cbody.add(githubSettingsModalForm());
                    modal.createElement();
                    modal.close.listen('click', function() {
                        $(modal.element).modal('hide');
                        if (callback)
                            callback(false);
                    });
                    modal.OK.listen('click', function() {
                        var github = daoroot.github || (daoroot.github = {});
                        github.user = modal.user.value || '';
                        sessionStorage.setItem('github-apikey', modal.apikey.value || ''),
                        github.repo = modal.repo.value || '';
                        github.branch = modal.branch.value || 'gh-pages';
                        daoroot.raise();
                        daourl.github_path = modal.path.value || '';
                        daourl.raise();
                        if (modal.callback)
                            modal.callback(github.user && github.repo && github.branch && daourl.github_path && modal.apikey.value);
                    });
                    modal.Cancel.listen('click', function() {
                        $(modal.element).modal('hide');
                        if (modal.callback)
                            modal.callback(false);
                    });
                }
                modal.user.value = user;
                modal.apikey.value = apikey;
                modal.repo.value = repo;
                modal.branch.value = branch;
                modal.path.value = names.fileName;
                modal.modeCheckbox.checked = host.fileMode;
                modal.callback = callback;
                $(modal.element).modal('show');
//            } else {
//                if (callback)
//                    callback(true);
//            }
        };
        
        this.publish = function() {
            var github = daoroot.github || (daoroot.github = {});

            var githubapi = new window.github_api({
                username: github.user,
                password: sessionStorage.getItem('github-apikey'),
                auth: "basic"
            });

            var repo = githubapi.getRepo(github.user, github.repo),
                mw_html = controller.buildHTML();
                var names = getMwFileName({fileName:daourl.github_path});
            
            var modal = $DOC.cbody.github_modal;
            if (modal.modeCheckbox.checked) {
                var html = preview.grabHTML();
                repo.write(github.branch, names.mwFileName, mw_html, '---', function(err) {
                    if (err) console.log(err);
                    else {
                        // simultaneous api requests not supported, delay 3 sec
                        setTimeout(function() {
                            repo.write(github.branch, names.fileName, html, '---', function(err) {
                                if (err) {
                                    setTimeout(function() {
                                        repo.write(github.branch, names.fileName, html, '---', function(err) {
                                            if (err) console.log(err);
                                            else
                                                $(modal && modal.element).modal('hide');
                                        });
                                    }, 3000);
                                } else
                                    $(modal && modal.element).modal('hide');
                            });
                        }, 3000);
                    }
                });
            } else {
                // 2. write .html
                repo.write(github.branch, names.fileName, mw_html, '---', function(err) {
                    if (err) console.log(err);
                    else {
                        // 3. delete .mw.html
                        setTimeout(function() {
                            repo.removeFile(github.branch, names.mwFileName, function(err) {
                                if (err && err !== 404) {
                                    setTimeout(function() {
                                        repo.removeFile(github.branch, names.mwFileName, function(err) {
                                            if (err && err !== 404)
                                                console.log(err);
                                            else
                                                $(modal && modal.element).modal('hide');
                                        });
                                    }, 3000);
                                } else
                                    $(modal && modal.element).modal('hide');
                            });
                        }, 3000);
                    }
                });
            }
        };
        
        function githubSettingsModalForm() {
            var modal = controls.create('bootstrap.modal', {style:'z-index:1200;', disabled:true});
            modal.close = modal.header.add('button`close', '&times;', {type:'button'});
            modal.header.add('h4`modal-title', 'Publish on GitHub');
            var form = modal.body.add('form:bootstrap.Form');
            form
                ._add('bootstrap.FormGroup', function(grp) {
                    grp.add('bootstrap.ControlLabel', 'Username:');
                    modal.user = grp.add('bootstrap.ControlInput');
                })
                ._add('bootstrap.FormGroup', function(grp) {
                    grp._add('bootstrap.ControlLabel', 'Repository:');
                    modal.repo = grp.add('bootstrap.ControlInput');
                })
                ._add('bootstrap.FormGroup', function(grp) {
                    grp._add('bootstrap.ControlLabel', 'Branch:');
                    modal.branch = grp.add('bootstrap.ControlInput');
                })
                ._add('bootstrap.FormGroup', function(grp) {
                    grp._add('bootstrap.ControlLabel', 'Path in repository:');
                    modal.path = grp.add('bootstrap.ControlInput');
                })
                ._add('bootstrap.FormGroup', function(grp) {
                    grp._add('bootstrap.ControlLabel', 'Personal access token or password:');
                    modal.apikey = grp.add('bootstrap.ControlInput');
                });
            modal.OK = modal.footer.add('bootstrap.Button#primary', 'OK');
            modal.Cancel = modal.footer.add('bootstrap.Button', 'Cancel');
            
            // compile to .html checkbox
            modal.modeCheckbox = 
                form.add('bootstrap.FormGroup')
                    .add('bootstrap.ControlCheckbox`martop20', {$text:'Compile to html'});
            
            // reference
            modal.ref0 = 
                form.add('bootstrap.FormGroup')
                    .add('a`martop20', {target:'repo'});
            setInterval(function() {
                var user = modal.user.value, repo = modal.repo.value;
                if (user && repo) {
                    var reporef = 'https://github.com' + '/' + user + '/' + repo;
                    modal.ref0
                        ._text(reporef)
                        ._attr('href', reporef);
                }
            }, 977);
            
            
            
            return modal;
        }
    }
    
    function getMwFileName(data) {
        var fileName = data.fileName, mwFileName = data.mwFileName;
        if (!fileName)
            return data;
        // location != *.html
        if (fileName.slice(-5) !== '.html') {
            data.fileName += '.html';
            return getMwFileName(data);
        // location == *.mw.html
        } else if (fileName.slice(-8) === '.mw.html') {
            fileName = fileName.slice(0, fileName.length - 8);
            mwFileName = fileName + '.mw.html';
            fileName += '.html';
        } else {
            mwFileName = fileName.slice(0, fileName.length - 5) + '.mw.html';
        }
        data.fileName = fileName;
        data.mwFileName = mwFileName;
        return data;
    }
        
    function Host() {
        this.environment = 0;   //  1 - node-webkit, 2 - hosted
        this.writable = 0;
        this.errorState = -1/*not initialized*/;
        this.mwHtml = '';       // markdown webdocs source file
        this.fileMode = 0;      // fileMode - 0 - one .html file, 1 - separate .html and .mw.html
        
        var url = location.url;
        var sep = url.lastIndexOf('/'), asep = url.lastIndexOf('\\');
        sep = (asep > sep) ? asep : sep;
        this.path = url.slice(0, sep + 1);
        this.fileName = url.slice(sep + 1);
        getMwFileName(this);
        var _this = this;
        
        // node-webkit
        if (typeof nwDispatcher !== 'undefined' && location.protocol === 'file:') {
            this.environment = 1;
            this.writable = true;
            var fs = require('fs'),
                mwFilePath = this.path.slice(8)/*file:*/ +  this.mwFileName,
                filePath = this.path.slice(8)/*file:*/ +  this.fileName;
        
            try {
                if (fs.existsSync(mwFilePath)) {
                    this.fileMode = 1;
                    // .mw.html must be mw
                    this.mwHtml = fs.readFileSync(mwFilePath).toString().replace(/\r/g, '');
                } else
                    // .html can be mw
                    this.mwHtml = fs.readFileSync(filePath).toString().replace(/\r/g, '');
                this.errorState = 0;
            } catch(e) {
                this.errorState = 1;
            }
            
            // write file
            this.write = function(mw_doc, html) {
                if (this.writable && !this.errorState) 
                try {
                    if (this.fileMode) {
                        fs.writeFileSync(mwFilePath, mw_doc);
                        fs.writeFileSync(filePath, html);
                    } else {
                        fs.writeFileSync(filePath, mw_doc);
                        try {
                            fs.unlinkSync(mwFilePath);
                        } catch(e) {}
                    }
                    return filePath;
                } catch(e) {console.log(e);
                    // write fail
                };
            };
            
            this.writeTo = function(filename, mw_doc, html) {
                if (this.writable && !this.errorState) 
                try {
                    var names = getMwFileName({fileName:filename}),
                        mwWritePath = this.path.slice(8)/*file:*/ + names.mwFileName,
                        writePath = this.path.slice(8)/*file:*/ + names.fileName;
                        
                    if (this.fileMode) {
                        fs.writeFileSync(mwWritePath, mw_doc);
                        fs.writeFileSync(writePath, html);
                    } else {
                        fs.writeFileSync(writePath, mw_doc);
                        try {
                            fs.unlinkSync(mwWritePath);
                        } catch(e) {}
                    }
                    return writePath;
                } catch(e) {console.log(e);
                    // write fail
                };
            };
            
        } else {
            if (location.protocol === 'file:')
                /* Can not get .mw file and handle errors in 'file:' mode. */
                this.errorState = 1;
            var host = this;
            $.ajax({url:_this.path + _this.mwFileName, type:'GET', dataType:'html', async:0})
                .done(function(data) {
                    host.mwHtml = data.replace(/\r/g, '');
                    host.fileMode = 1;
                })
                .fail(function(e, status, xhr) {
                    $.ajax({url:_this.path + _this.fileName, type:'GET', dataType:'html', async:0})
                        .done(function(data) {
                            // html can be mw
                            host.mwHtml = data.replace(/\r/g, '');
                        })
                        .fail(function() {
                            // source not retrieved, prevent writing
                            this.errorState = 1;
                        });
                });
        }
        // hosted webapplication
//        } else if (location.protocol !== 'file:') {
//            var href = location.href, pos = href.lastIndexOf('/'), curl /*controller url*/ = href.slice(0, pos) + '/@';
//
//            this.write = function(fname, data) {
//                if (curl)
//                $.ajax({url:curl, type:'POST', dataType:'json', contentType:'application/json; charset=UTF-8', async:0, data:JSON.stringify({command:'write', url:fname, data:data})})
//                    .done(function(response) {
//                        if (response.result === 'success')
//                            db.onReady(function() { location.reload(); });
//                    });
//            };
//
//            if (curl)
//            $.ajax({url:curl, type:'POST', dataType:'json', contentType:'application/json; charset=UTF-8', data:JSON.stringify({command:'options'})})
//                .done(function(response) {
//                    if (response.result === 'success') {
//                        this.environment = 2;
//                        if (this.editable = response.editable)
//                            toolbar.save_group.save.class(null, 'disabled');
//                    }
//                });
//        }
    }
    
    // Database engine adapter
    // If not supported both indexedDB and webSQL no call ready callback and error message
    function DB(tables, onready) {
        var db = this, indexeddb, websqldb;
        this.errorState = -1/*not initialized*/;
        
        for(var prop in tables) {
            var dataobject = tables[prop];
            dataobject.listen(function() {
                this.modified = true;
            });
        }
        
        timer0.push(function() {
            for(var prop in tables) {
                var dataobject = tables[prop];
                if (dataobject.modified)
                    db.write();
            }
        });
        
        if (window.indexedDB) {
            try {
                // indexedDB.deleteDatabase
                var request = window.indexedDB.open('markdown-webdocs.editor.db.1', 1.0);

                request.onsuccess = function(event) { 
                    indexeddb = event.target.result;
                    onready();
                };

                request.onupgradeneeded = function(event) {
                    indexeddb = event.target.result;
                    for(var prop in tables)
                        indexeddb.createObjectStore(prop, {keyPath: 'key'});
                    onready();
                };

                request.onerror = function(event) {
                    errorMessage('<h4><b class="glyphicon glyphicon-warning-sign">&nbsp;</b>Editor loading error</h4>Database error. Please try using another browser for editing the document.');
                    console.log(event);
                };

                request.onblocked = function(event) {
                    errorMessage('<h4><b class="glyphicon glyphicon-warning-sign">&nbsp;</b>Editor loading error</h4>Database blocked');
                    console.log(event);
                };

            } catch(e) {
                NoIDBError();
                return;
            }

            db.restore = function(callback) {
                try {
                    var tr = indexeddb.transaction(Object.keys(tables), 'readonly'),
                        requests = 0, stated = 0;
                    for(var prop in tables) {
                        var dataobject = tables[prop],
                            request = tr.objectStore(prop).get(dataobject.key);
                        requests++;
                        request.onsuccess = function(event) {
                            dataobject = tables[event.target.source.name];
                            dataobject.fromJSON(event.target.result);
                            dataobject.modified = false;
                            stated++;
                            if (stated === requests) {
                                db.errorState = 0;
                                if (callback)
                                    callback();
                            }
                        };
                        request.onerror = function(event) {
                            console.log(event);
                            this.errorState = 1;
                        };
                    }
                } catch (e) {
                    console.log(e);
                    this.errorState = 1;
                    // db scheme error
                    // todo
                }
            };

            db.write = function() {

                if (!this.errorState)
                try {
                    var tr = indexeddb.transaction(Object.keys(tables), 'readwrite');
                    
                    for(var prop in tables) {
                        var dataobject = tables[prop];
                        if (dataobject.modified) {
                            var store = tr.objectStore(prop);
                        
                            // delete command
                            if (dataobject.delete) {
                                delete dataobject.delete;
                                store.delete(dataobject.key);
                            }
                            else {
                                var request = store.put(dataobject.toJSON());
                                request.onsuccess = function() {
                                };
                                request.onerror = function(err) {
                                    console.log(err);
                                };
                            }
                            
                            dataobject.modified = false;
                            
                            if (dataobject.selected && localStorage)
                                localStorage.setItem('default selected page', dataobject.selected);
                        }
                    }

                } catch (e) {
                    console.log(e);
                    // db scheme error
                    // todo
                }
            };


        } else if (!window.openDatabase) {
            NoIDBError();
            return;
        } else {


            // web SQL engine
            try {
                var websqldb = window.openDatabase('markdown-webdocs.editor.db.1', '1.0', 'markdow webdocs editor', 0);
                if (!websqldb) {
                    NoIDBError();
                    return;
                }

                // check table
                websqldb.transaction(
                    function(tx){
                        for(var prop in tables)
                            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + prop + ' (key TEXT NOT NULL PRIMARY KEY, value TEXT)',
                                [], null/*onsuccess*/, NoIDBError/*onerror*/);
                    },
                    NoIDBError/*onerror*/,
                    onready/*onreadytransaction*/
                );
            } catch(e) {
                NoIDBError();
                return;
            }

            db.restore = function(callback) {
                try {
                    websqldb.transaction(
                        function(tx){
                            var requests = 0, stated = 0;
                            for(var prop in tables) {
                                var dataobject = tables[prop];
                                tx.executeSql('SELECT value FROM ' + prop + ' WHERE key = ? LIMIT 1',
                                    [dataobject.key],
                                    function(tx, result) { // onsuccess
                                        if (result.rows.length) {
                                            try {
                                                dataobject.fromJSON(JSON.parse(result.rows.item(0).value));
                                            } catch (e) {
                                                dataobject.fromJSON({});
                                            }
                                            dataobject.modified = false;
                                        }
                                        stated++;
                                        if (stated === requests) {
                                            db.errorState = 0;
                                            if (callback)
                                                callback();
                                        }
                                    },
                                    function(event){ // onerror
                                        console.log(event);
                                    });
                            }
                        },
                        /*onerror*/function(){
                            console.log(event);
                        },
                        /*onreadytransaction*/function(){
                        }
                    );
                } catch (e) {
                    // db scheme error
                    // todo
                }
            };

            db.write = function() {
                if (!errorState)
                try {
                    websqldb.transaction(
                        function(tx){
                            for(var prop in tables) {
                                var dataobject = tables[prop];
                                
                                // delete command
                                if (dataobject.delete) {
                                    delete dataobject.delete;
                                    tx.executeSql(
                                    'DELETE FROM ' + prop + ' WHERE key = ?',
                                    [dataobject.key],
                                    function(tx, result) { // onsuccess
                                    },
                                    function(event){ // onerror
                                        console.log(event);
                                    });
                                }
                                else {
                                    tx.executeSql(
                                    'INSERT OR REPLACE INTO ' + prop + ' (key, value) VALUES (?, ?)',
                                    [dataobject.key, JSON.stringify(dataobject)],
                                    function(tx, result) { // onsuccess
                                    },
                                    function(event){ // onerror
                                        console.log(event);
                                    });
                                }
                            }
                        },
                        function(){ // onerror
                            console.log(event);
                        },
                        function(){ // onreadytransaction
                        }
                    );
                    modified = false;
                } catch (e) {
                    console.log(e);
                    // db scheme error
                    // todo
                }
            };
        }
        
        db.onReady = function reload(callback) {
            setTimeout(function() {
                callback();
            }, 400);
        };
        
        function NoIDBError() { errorMessage('<h4><b class="glyphicon glyphicon-warning-sign">&nbsp;</b>Editor loading error</h4>Your browser does not supported and can not be used to edit documents. Please use Firefox, Chrome, Opera or Safari.'); }
    }
    
    
    function errorMessage(message) {
        // alert message
        $DOC.cbody
            .attachAll()
            .add('div', {style:'position:fixed; left:0; top:0; width:100%; height:100%; background-color:white; opacity:0.9; z-index:1201;'})
            .createElement();
        $DOC.cbody
            .add('alert:div.mar20 alert alert-warning col1-sm-offset-3 col-sm-6', {$text:message, style:'position:fixed; left:25px; top:25px; z-index:1202;'})
            .createElement();
    }

}
})();



// Github.js 0.9.0
// (c) 2013 Michael Aufreiter, Development Seed
// Github.js is freely distributable under the MIT license.
// For all details and documentation:
// http://substance.io/michael/github

(function() {
    
    function Base64encode(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
        } while (i < input.length);

        return output;
    }



    var API_URL = 'https://api.github.com';

    var Github = function(options) {

    // HTTP Request Abstraction
    // =======
    //
    // I'm not proud of this and neither should you be if you were responsible for the XMLHttpRequest spec.

    function _request(method, path, data, cb, raw, sync) {
      function getURL() {
        var url = path.indexOf('//') >= 0 ? path : API_URL + path;
        return url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
      }

      var xhr = new XMLHttpRequest();
      if (!raw) {xhr.dataType = "json";}

      xhr.open(method, getURL(), !sync);
      if (!sync) {
        xhr.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300 || this.status === 304) {
              cb(null, raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true, this);
            } else {
              cb({path: path, request: this, error: this.status});
            }
          };
        }
      };
      xhr.setRequestHeader('Accept','application/vnd.github.raw+json');
      xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
      if ((options.token) || (options.username && options.password)) {
           xhr.setRequestHeader('Authorization', options.token
             ? 'token '+ options.token
             : 'Basic ' + Base64encode(options.username + ':' + options.password)
           );
         }
      data ? xhr.send(JSON.stringify(data)) : xhr.send();
      if (sync) return xhr.response;
    }

    function _requestAllPages(path, cb) {
      var results = [];
      (function iterate() {
        _request("GET", path, null, function(err, res, xhr) {
          if (err) {
            return cb(err);
          }

          results.push.apply(results, res);

          var links = (xhr.getResponseHeader('link') || '').split(/\s*,\s*/g),
              next = _.find(links, function(link) { return /rel="next"/.test(link); });

          if (next) {
            next = (/<(.*)>/.exec(next) || [])[1];
          }

          if (!next) {
            cb(err, results);
          } else {
            path = next;
            iterate();
          }
        });
      })();
    }



    // User API
    // =======

    Github.User = function() {
      this.repos = function(cb) {
        // Github does not always honor the 1000 limit so we want to iterate over the data set.
        _requestAllPages("/user/repos?type=all&per_page=1000&sort=updated", function(err, res) {
          cb(err, res);
        });
      };

      // List user repositories
      // -------

      this.userRepos = function(username, cb) {
        // Github does not always honor the 1000 limit so we want to iterate over the data set.
        _requestAllPages("/users/"+username+"/repos?type=all&per_page=1000&sort=updated", function(err, res) {
          cb(err, res);
        });
      };

      // List organization repositories
      // -------

      this.orgRepos = function(orgname, cb) {
        // Github does not always honor the 1000 limit so we want to iterate over the data set.
        _requestAllPages("/orgs/"+orgname+"/repos?type=all&&page_num=1000&sort=updated&direction=desc", function(err, res) {
          cb(err, res);
        });
      };

    };


    // Repository API
    // =======

    Github.Repository = function(options) {
      var repo = options.name;
      var user = options.user;

      var that = this;
      var repoPath = "/repos/" + user + "/" + repo;

      var currentTree = {
        "branch": null,
        "sha": null
      };

      // Uses the cache if branch has not been changed
      // -------

      function updateTree(branch, cb) {
        if (branch === currentTree.branch && currentTree.sha) return cb(null, currentTree.sha);
        that.getRef("heads/"+branch, function(err, sha) {
          currentTree.branch = branch;
          currentTree.sha = sha;
          cb(err, sha);
        });
      }

      // Get a particular reference
      // -------

      this.getRef = function(ref, cb) {
        _request("GET", repoPath + "/git/refs/" + ref, null, function(err, res) {
          if (err) return cb(err);
          cb(null, res.object.sha);
        });
      };

      // Create a new reference
      // --------
      //
      // {
      //   "ref": "refs/heads/my-new-branch-name",
      //   "sha": "827efc6d56897b048c772eb4087f854f46256132"
      // }

      this.createRef = function(options, cb) {
        _request("POST", repoPath + "/git/refs", options, cb);
      };

      // Delete a reference
      // --------
      //
      // repo.deleteRef('heads/gh-pages')
      // repo.deleteRef('tags/v1.0')

      this.deleteRef = function(ref, cb) {
        _request("DELETE", repoPath + "/git/refs/"+ref, options, cb);
      };



      // Retrieve the changes made between base and head
      // -------

      this.compare = function(base, head, cb) {
        _request("GET", repoPath + "/compare/" + base + "..." + head, null, function(err, diff) {
          if (err) return cb(err);
          cb(null, diff);
        });
      };

      // List all branches of a repository
      // -------

      this.listBranches = function(cb) {
        _request("GET", repoPath + "/git/refs/heads", null, function(err, heads) {
          if (err) return cb(err);
          cb(null, _.map(heads, function(head) { return _.last(head.ref.split('/')); }));
        });
      };

      // Retrieve the contents of a blob
      // -------

      this.getBlob = function(sha, cb) {
        _request("GET", repoPath + "/git/blobs/" + sha, null, cb, 'raw');
      };

      // For a given file path, get the corresponding sha (blob for files, tree for dirs)
      // -------

      this.getSha = function(branch, path, cb) {
        // Just use head if path is empty
        if (path === "") return that.getRef("heads/"+branch, cb);
        that.getTree(branch+"?recursive=true", function(err, tree) {
          if (err) return cb(err);
          var file = _.select(tree, function(file) {
            return file.path === path;
          })[0];
          cb(null, file ? file.sha : null);
        });
      };

      // Retrieve the tree a commit points to
      // -------

      this.getTree = function(tree, cb) {
        _request("GET", repoPath + "/git/trees/"+tree, null, function(err, res) {
          if (err) return cb(err);
          cb(null, res.tree);
        });
      };

      // Post a new blob object, getting a blob SHA back
      // -------

      this.postBlob = function(content, cb) {
        if (typeof(content) === "string") {
          content = {
            "content": content,
            "encoding": "utf-8"
          };
        }

        _request("POST", repoPath + "/git/blobs", content, function(err, res) {
          if (err) return cb(err);
          cb(null, res.sha);
        });
      };

      // Update an existing tree adding a new blob object getting a tree SHA back
      // -------

      this.updateTree = function(baseTree, path, blob, cb) {
        var data = {
          "base_tree": baseTree,
          "tree": [
            {
              "path": path,
              "mode": "100644",
              "type": "blob",
              "sha": blob
            }
          ]
        };
        _request("POST", repoPath + "/git/trees", data, function(err, res) {
          if (err) return cb(err);
          cb(null, res.sha);
        });
      };

      // Post a new tree object having a file path pointer replaced
      // with a new blob SHA getting a tree SHA back
      // -------

      this.postTree = function(tree, cb) {
        _request("POST", repoPath + "/git/trees", { "tree": tree }, function(err, res) {
          if (err) return cb(err);
          cb(null, res.sha);
        });
      };

      // Create a new commit object with the current commit SHA as the parent
      // and the new tree SHA, getting a commit SHA back
      // -------

      this.commit = function(parent, tree, message, cb) {
        var data = {
          "message": message,
          "author": {
            "name": options.username
          },
          "parents": [
            parent
          ],
          "tree": tree
        };

        _request("POST", repoPath + "/git/commits", data, function(err, res) {
          currentTree.sha = /*!Ad 422 -> res === undefined fixed*/res &&       res.sha; // update latest commit
          if (err) return cb(err);
          cb(null, /*!Ad fixed*/res &&       res.sha);
        });
      };

      // Update the reference of your head to point to the new commit SHA
      // -------

      this.updateHead = function(head, commit, cb) {
        _request("PATCH", repoPath + "/git/refs/heads/" + head, { "sha": commit }, function(err, res) {
          cb(err);
        });
      };

      // Show repository information
      // -------

      this.show = function(cb) {
        _request("GET", repoPath, null, cb);
      };

      // Get contents
      // --------

      this.contents = function(branch, path, cb, sync) {
        return _request("GET", repoPath + "/contents?ref=" + branch + (path ? "&path=" + path : ""), null, cb, 'raw', sync);
      };

      // Fork repository
      // -------

      this.fork = function(cb) {
        _request("POST", repoPath + "/forks", null, cb);
      };

      // Branch repository  
      // --------  
 
      this.branch = function(oldBranch,newBranch,cb) {
        if(arguments.length === 2 && typeof arguments[1] === "function") {
          cb = newBranch;
          newBranch = oldBranch;
          oldBranch = "master";
        }
        this.getRef("heads/" + oldBranch, function(err,ref) {
          if(err && cb) return cb(err);
          that.createRef({
            ref: "refs/heads/" + newBranch,
            sha: ref
          },cb);
        });
      }

      // Create pull request
      // --------

      this.createPullRequest = function(options, cb) {
        _request("POST", repoPath + "/pulls", options, cb);
      };

      // List hooks
      // --------

      this.listHooks = function(cb) {
        _request("GET", repoPath + "/hooks", null, cb);
      };

      // Get a hook
      // --------

      this.getHook = function(id, cb) {
        _request("GET", repoPath + "/hooks/" + id, null, cb);
      };

      // Create a hook
      // --------

      this.createHook = function(options, cb) {
        _request("POST", repoPath + "/hooks", options, cb);
      };

      // Edit a hook
      // --------

      this.editHook = function(id, options, cb) {
        _request("PATCH", repoPath + "/hooks/" + id, options, cb);
      };

      // Delete a hook
      // --------

      this.deleteHook = function(id, cb) {
        _request("DELETE", repoPath + "/hooks/" + id, null, cb);
      };

      // Read file at given path
      // -------

      this.read = function(branch, path, cb) {
        that.getSha(branch, path, function(err, sha) {
          if (!sha) return cb("not found", null);
          that.getBlob(sha, function(err, content) {
            cb(err, content, sha);
          });
        });
      };

      // Remove a file from the tree
      // -------

      this.remove = function(branch, path, cb) {
        updateTree(branch, function(err, latestCommit) {
          that.getTree(latestCommit+"?recursive=true", function(err, tree) {
            // Update Tree
            //!Ad undescore 'fixed'
            var newTree = tree.filter(function(ref) { return ref.path !== path; });
            newTree.forEach(function(ref) { if (ref.type === "tree") delete ref.sha; });
            //!Ad
            if (tree.length === newTree.length)
                cb(404/*not found*/);
                        
             
              
            that.postTree(newTree, function(err, rootTree) {
              that.commit(latestCommit, rootTree, 'Deleted '+path , function(err, commit) {
                that.updateHead(branch, commit, function(err) {
                  cb(err);
                });
              });
            });
          });
        });
      };
      
    //!Ad
    this.removeFile = function(branch, path, cb) {
        updateTree(branch, function(err, latestCommit) {
            that.getTree(latestCommit+"?recursive=true", function(err, tree, res) {
                if (!tree || !tree.some(function(ref) {
                    if (ref.path === path && ref.type === 'blob') {
                        var data = {path: ref.path, message: '---', sha: ref.sha, branch: branch};
                        _request("DELETE", repoPath + "/contents/" + path, data, function(err, res) {
                            if (err) return cb(err);
                            cb(null, res.sha);
                        });
                        return true;
                    }
                }))
                    cb(null);
            });
        });
    };

      // Move a file to a new location
      // -------

      this.move = function(branch, path, newPath, cb) {
        updateTree(branch, function(err, latestCommit) {
          that.getTree(latestCommit+"?recursive=true", function(err, tree) {
            // Update Tree
            _.each(tree, function(ref) {
              if (ref.path === path) ref.path = newPath;
              if (ref.type === "tree") delete ref.sha;
            });

            that.postTree(tree, function(err, rootTree) {
              that.commit(latestCommit, rootTree, 'Deleted '+path , function(err, commit) {
                that.updateHead(branch, commit, function(err) {
                  cb(err);
                });
              });
            });
          });
        });
      };

      // Write file contents to a given branch and path
      // -------

      this.write = function(branch, path, content, message, cb) {
        updateTree(branch, function(err, latestCommit) {
          if (err) return cb(err);
          that.postBlob(content, function(err, blob) {
            if (err) return cb(err);
            that.updateTree(latestCommit, path, blob, function(err, tree) {
              if (err) return cb(err);
              that.commit(latestCommit, tree, message, function(err, commit) {
                if (err) return cb(err);
                that.updateHead(branch, commit, cb);
              });
            });
          });
        });
      };

      // List commits on a repository. Takes an object of optional paramaters:
      // sha: SHA or branch to start listing commits from
      // path: Only commits containing this file path will be returned
      // since: ISO 8601 date - only commits after this date will be returned
      // until: ISO 8601 date - only commits before this date will be returned
      // -------

      this.getCommits = function(options, cb) {
          options = options || {};
          var url = repoPath + "/commits";
          var params = [];
          if (options.sha) {
              params.push("sha=" + encodeURIComponent(options.sha));
          }
          if (options.path) {
              params.push("path=" + encodeURIComponent(options.path));
          }
          if (options.since) {
              var since = options.since;
              if (since.constructor === Date) {
                  since = since.toISOString();
              }
              params.push("since=" + encodeURIComponent(since));
          }
          if (options.until) {
              var until = options.until;
              if (until.constructor === Date) {
                  until = until.toISOString();
              }
              params.push("until=" + encodeURIComponent(until));
          }
          if (params.length > 0) {
              url += "?" + params.join("&");
          }
          _request("GET", url, null, cb);
      };
    };


    // Top Level API
    // -------

    this.getRepo = function(user, repo) {
      return new Github.Repository({user: user, name: repo});
    };

    this.getUser = function() {
      return new Github.User();
    };

  };

    window.github_api = Github;
})();
