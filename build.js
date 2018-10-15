var spawn = require('child_process').spawn;
var fs = require('fs');
var archiver = require('archiver');

// copy libs

// downloaded local copy
copy('libs/jquery.js',              'temp/jquery.js');
copy('libs/bootstrap.js',           'temp/bootstrap.js');
copy('libs/bootstrap.css',          'temp/bootstrap.css');
copy('libs/bootstrap.min.css',      'temp/bootstrap.min.css');
// patched local copy
copy('libs/marked.js',              'temp/marked.js');
// module from npm 
//copy('../node_modules/dot/doT.min.js',                 'temp/dot.js');
// Take an unpublished version of the latest fixes
copy('../tmp/bootstrap.controls.js','temp/bootstrap.controls.js');
copy('../tmp/controls.js',          'temp/controls.js');
// Locally update module
copy('../tmp/controls.js',          '../node_modules/controls/controls.js');


// -> DOCUMENT.API.JS
var bfy = spawn('browserify.cmd', ['document.init.part.js', '-o', 'document.api.js']);
bfy.stderr.on('data', function(data) { console.log('\n! 1>' + data); });
bfy.stdout.on('data', function(data) { console.log('1>' + data); });
bfy.on('exit', function()
{
    
    // --> BUG FIXES
    // Common 
    // doT.templateSettings  strip: !0, must be false
    replace('document.api.js', /strip:[\s]*true,/, 'strip:0,');

    // Safari bugs
    replace('document.api.js', /\(function\(\)\{ return this \|\| \(0,eval\)\('this'\); \}\(\)\).doT = doT;/, 'this.doT=doT;');
    // <-- BUG FIXES
    
   
    // -> DOCUMENT.LESS.JS
    concat([
        'document.api.js',
        // >> built-in components
        'components/controls/defl/controls.defl.js',
        'components/controls/navbar/controls.navbar.js',
        'components/controls/css/controls.css.js',
        'components/controls/panels/controls.panels.js',
        'components/controls/tabpanel/controls.tabpanel.js',
        'components/controls/page-layout/controls.page-layout.js',
        'components/controls/footer-layout/controls.footer-layout.js',
        // << built-in components
        'document.proc.part.js'],
    // >> output
        'document.less.js');
    // << output
    

    // Include editor.js
    replace('document.less.js', '/*include editor*/', fs.readFileSync('editor.min.js', 'utf-8')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\\'')
        .replace(/\r\n/g, '\\n\\\r\n'));
    
    
    
    // -> DOCUMENT.JS
    concat([
        'temp/jquery.js',
        'temp/bootstrap.js',
        'document.less.js'],
    // >> output    
        'document.js');
    // << output
    
    // patch remove #604
    replace('document.js', /\/\/ #604 >>[^>]*(?=\/\/ << #604)/g, 'var controls = $ENV.controls;');
    replace('document.js', /\/\/ << #604.*/g, '');    


    // -> DOCUMENT.MIN.JS
    var ufy = spawn('uglifyjs.cmd', ['document.js', '-o', 'document.min.js', '-cmb beautify=false']);
    ufy.stdout.on('data', function (data) { console.log('2>' + data); });
    ufy.on('exit', function ()
    {
        // add options to head files:
        // -> DOCUMENT.API.JS
        // -> DOCUMENT.LESS.JS
        // -> DOCUMENT.JS
        // -> DOCUMENT.MIN.JS
        var options = 
'var $DOC,$ENV,$OPT = {\n\
    userjs: "",\n\
    icon: "",\n\
    editable: true\n\
};\n\n';
        fs.writeFileSync('document.api.js',  options + fs.readFileSync('document.api.js'));
        fs.writeFileSync('document.less.js', options + fs.readFileSync('document.less.js'));
        fs.writeFileSync('document.js',      options + fs.readFileSync('document.js'));
        fs.writeFileSync('document.min.js',  options + fs.readFileSync('document.min.js'));
        

        // -> MARKDOWN-SITE-TEMPLATE.ZIP
        zip('markdown-site-template.zip', 'markdown-site-template',
        [
            'bootstrap.css',
            'fonts\\glyphicons-halflings-regular.eot',
            'fonts\\glyphicons-halflings-regular.svg',
            'fonts\\glyphicons-halflings-regular.ttf',
            'fonts\\glyphicons-halflings-regular.woff',
            'document.js',
            'document.min.js',
            'index.html',
            'blog.html',
            'docs\\CML.html',
            'docs\\layout.html',
            'docs\\api.html',
            'docs\\url-parameters.html',
            'sitemap.html',
            'page template.html',
            'user.js',
            'README.md',
            'LICENSE',
            
            'components\\controls.css.html',
            'components\\controls.navbar.html',
            'components\\controls.footer-layout.html',
            'components\\controls.alert.html',
            'components\\controls.panel.html',
            'components\\controls.collapse.html',
            'components\\controls.tabpanel.html',
            'components\\controls.carousel.html',
            'components\\controls.page-layout.html',
            
            'components\\controls.emoji.html',
            'components\\YouTube.Player.html',
            'components\\wiki.instaview.html',
            'components\\controls.math.html',
            
            'mods\\msdn-like-theme.html'
        ]);
    });
    

    // -> DOCUMENT.API.MIN.JS
    var ufy = spawn('uglifyjs.cmd', ['document.api.js', '-o', 'document.api.min.js', '-cmb beautify=false']);
    ufy.stdout.on('data', function (data) { console.log('3>' + data); });
    
    // -> DOCUMENT.LESS.MIN.JS
    var ufy = spawn('uglifyjs.cmd', ['document.less.js', '-o', 'document.less.min.js', '-cmb beautify=false']);
    ufy.stdout.on('data', function (data) { console.log('5>' + data); });

    // -> EDITOR.MIN.JS
    var ufy = spawn('uglifyjs.cmd', ['editor.js', '-o', 'editor.min.js', '-cmb beautify=false']);
    ufy.stdout.on('data', function (data) { console.log('6>' + data); });
});




function getfilename(path)
{
    return path.split(/\\\//g).slice(-1);
}
function concat(fileList, distPath)
{
    console.log('\nconcat>' + getfilename(distPath));
    
    var out = fileList.map(function(filepath)
    {
        console.log('concat>+' + getfilename(filepath));
        return fs.readFileSync(filepath, 'utf-8');
    });

    fs.writeFileSync(distPath, out.join('\r\n\r\n\r\n\r\n\r\n\r\n'), 'utf-8');
    console.log(' '+ distPath +' built.');
}
function replace(filepath, find, replace)
{
    var data = fs.readFileSync(filepath, 'utf-8');
    data = data.replace(find, replace);
    fs.writeFileSync(filepath, data, 'utf-8');
}
function copy(filepath, to)
{
    console.log('copy> ' + filepath + ' -> ' + to);
    fs.writeFileSync(to, fs.readFileSync(filepath, 'utf-8'), 'utf-8');
}
function zip(zipfile, subfolder, files)
{
    console.log('\zip>' + getfilename(zipfile));
    var output = fs.createWriteStream(zipfile);
    var archive = archiver('zip');

    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(output);

    var start = archive;
    files.forEach(function(file)
    {
        console.log('zip>' + file);
        start = start.append(fs.createReadStream(file), { name: subfolder + '\\' + file });
    });

    start.finalize(function(err, written) {
      if (err) {
        throw err;
      }

      console.log('zip>' + written + ' total bytes written');
    });
}
