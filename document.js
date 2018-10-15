var $DOC,$ENV,$OPT = {
    userjs: "",
    icon: "",
    editable: true
};

/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.slice(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );






/*!
 * Bootstrap v3.0.3 (http://getbootstrap.com)
 * Copyright 2013 Twitter, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 */

if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);






// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function() {
	"use strict";

	var doT = {
		version: '1.0.1',
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	'it',
			strip:0,
			append:		true,
			selfcontained: false
		},
		template: undefined, //fn, compile template
		compile:  undefined  //fn, for express
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = doT;
	} else if (typeof define === 'function' && define.amd) {
		define(function(){return doT;});
	} else {
		(function(){ return this || (0,eval)('this'); }()).doT = doT;
	}

	function encodeHTMLSource() {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
			matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
		return function() {
			return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
		};
	}
	String.prototype.encodeHTML = encodeHTMLSource();

	var startend = {
		append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" },
		split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"}
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === 'string') ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf('def.') === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ':') {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return '';
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, '_');
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
			.replace(/'|\\/g, '\\$&')
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.start + unescape(code) + cse.endencode;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
			.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode && c.selfcontained) {
			str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());






/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());





//     controls.js
//     UI framework, code generation tool
//     status: proposal, example, valid prototype, under development
//     demo:   http://aplib.github.io/controls.js/
//     issues: https://github.com/aplib/controls.js/issues
//     (c) 2013 vadim b.
//     License: MIT

(function() { 'use strict';

    var controls = {
        VERSION: '0.7.04'/*#.#.##*/,
        id_generator: 53504,
        // assignable default template engine
        //template: function(templ) { return new Function('return \'' + templ.replace('\n', '\\\n').replace(/'/g, "\\'") + '\''); },
        template: function(templ) {
            return new Function('return \'' + templ.replace(/'|\n/g, function(substr) {
                return {"'":"\\'", "\n":"\\n\\\n"}[substr];
            }) + '\'');
        },
        subtypes: {} // Registered subtypes
    };
    
    var IDENTIFIERS = ',add,_add,attach,attr,_attr,attrs,attributes,class,controls,data,delete,each,element,findFirst,findLast,first,forEach,id,insert,_insert,__type,last,length,name,parameters,parent,refresh,remove,style,template,';
    var ENCODE_HTML_MATCH = /&(?!#?\w+;)|<|>|"|'|\//g;
    var ENCODE_HTML_PAIRS = { "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "&": "&#38;", "/": '&#47;' };
    var DECODE_HTML_MATCH = /&#(\d{1,8});/g;    
    
    /**
     * Initialize control object
     * 
     * @param {object} object Control object
     * @param {string} __type Base type of the control, in format namespace.control
     * @param {object} parameters Parameters hash object
     * @param {object} attributes Attributes hash object
     * @param {function} outer_template Outer template
     * @param {function} inner_template Inner template
     * @returns {object} Control object
     */
    controls.controlInitialize = function(object, __type, parameters, attributes, outer_template, inner_template) {
        
        if (attributes) {
            object.id = attributes.id || (attributes.id = (++controls.id_generator).toString(16)); // set per session uid
            object.name = attributes.$name;
            
            // default move $prime to $text
            if ('$prime' in attributes) {
                var prime = attributes.$prime;
                if (prime instanceof DataArray || prime instanceof DataObject)
                    this.bind(prime);
                else
                    attributes.$text = prime;
                delete attributes.$prime;
            }
            
            if ('$template' in attributes){
                if (!outer_template)
                    outer_template = attributes.$template;
                delete attributes.$template;
            }
            if ('outer_template' in attributes){
                if (!outer_template)
                    outer_template = attributes.outer_template;
                delete attributes.outer_template;
            }
            if ('inner_template' in attributes){
                if (!inner_template)
                    inner_template = attributes.inner_template;
                delete attributes.inner_template;
            }
            
            object.attributes = attributes;
        } else
            object.attributes = {id:(object.id = (++controls.id_generator).toString(16))}; // set per session uid
        
        object.__type       = (__type.indexOf('.') >= 0) ? __type : ('controls.' + __type);
        object.parameters   = parameters || {};
        object.controls     = [];   // Collection of child nodes
        
        if (outer_template) {
            outer_template.no_serialize = true;
            Object.defineProperty(object, 'outer_template', {
                enumerable: true, writable: true,
                value: outer_template
            });
        }
        if (inner_template) {
            inner_template.no_serialize = true;
            Object.defineProperty(object, 'inner_template', {
                enumerable: true, writable: true,
                value: inner_template
            });
        }
    
        return object;
    };
    
    /**
     * Register control constructor in the controls library
     * 
     * @param {string} type Type of the control
     * @param {function} constructor Control constructor function
     * @param {function} revive Control revive function
     * @returns {undefined}
     */
    controls.typeRegister = function(type, constructor, revive) {
        controls.factoryRegister(type, constructor);
        constructor.is_constructor = true;
        constructor.revive = revive;
    };
    
    /**
     * Register control factory function in the controls library
     * 
     * @param {string} type Type of the control
     * @param {function} factory Control factory function
     * @returns {undefined}
     */
    controls.factoryRegister = function(type, factory) {
        var key_parameters = {},
            __type = parse_type(type, key_parameters) .toLowerCase();
        
        // normalize prop name, remove lead '/'
        for(var prop in key_parameters)
        if (prop[0] === '/') {
            key_parameters[prop.slice(1)] = key_parameters[prop];
            delete key_parameters[prop];
        }
        
        if (__type.length < type.length || Object.keys(key_parameters).length) {
            // type is subtype with parameters, register to controls.subtypes
            key_parameters.__ctr = factory;
            var subtypes_array = controls.subtypes[__type] || (controls.subtypes[__type] = []);
            subtypes_array.push(key_parameters);
        } else {
            // register as standalone type
            // check name conflict
            if (controls[__type])
                throw new TypeError('Type ' + type + ' already registered!');
            
            controls[__type] = factory;
        }
    };
    
    /**
     * Register existing parameterized type as a standalone type
     * 
     * @param {string} alias New alias that will be registered, in format namespace.control
     * @param {string} type Existing base type + additional #parameters, in format existingtype#parameters
     * @returns {undefined}
     */
    controls.typeAlias = function(alias, type) {
        var parameters = {},
            __type = parse_type(type, parameters) .toLowerCase(),
            constructor = resolve_ctr(__type, parameters);
        if (!constructor)
            throw new TypeError('Type ' + __type + ' not registered!');
            
        controls[alias.toLowerCase()] = { __type: __type, parameters: parameters, isAlias: true };
    };
    
    controls.parse = function(text) {
        try {
            return JSON.parse(text) || {};
        } catch(e) { console.log(e); }
        return {};
    };
    
    
// >> Events
    
    /**
     * Force events collection and event object
     * 
     * @param {object} object Object owns a collection of events
     * @param {string} type Type of event
     * @param {boolean} capture Capture event flag
     * @returns {controls.Event} Collection of a specified type
     */
    function force_event(object, type, capture) {
        var events = object.events || (object.events = {}),
            key = (capture) ? ('#'/*capture*/ + type) : type,
            event = events[key];
        if (!event) {
            events[key] = event = new controls.Event(object, type, capture);

            // add DOM listener if attached
            if (event.is_dom_event) {
                var element = object._element;
                if (element)
                    element.addEventListener(type, event.raise, capture);
            }
        }
        return event;
    };

    var dom_events =
',change,DOMActivate,load,unload,abort,error,select,resize,scroll,blur,DOMFocusIn,DOMFocusOut,focus,focusin,focusout,\
click,dblclick,mousedown,mouseenter,mouseleave,mousemove,mouseover,mouseout,mouseup,wheel,keydown,keypress,keyup,oncontextmenu,\
compositionstart,compositionupdate,compositionend,DOMAttrModified,DOMCharacterDataModified,DOMNodeInserted,\
DOMNodeInsertedIntoDocument,DOMNodeRemoved,DOMNodeRemovedFromDocument,DOMSubtreeModified,';
    
    controls.Event = function(default_call_this, type, capture, listeners_data) {
        var listeners = this.listeners = [],
            call_this = this.call_this = default_call_this; // owner of the event object
        this.type = type;
        this.capture = capture;
        this.is_dom_event = (dom_events.indexOf(',' + type + ',') >= 0);
        
        // revive from JSON data
        if (listeners_data)
        for(var i = 0, c = listeners_data.length; i < c; i+=2) {
            listeners.push(listeners_data[i]);
            var c_this =  listeners_data[i+1];
            listeners.push((c_this === call_this) ? null : call_this);
        }

        this.raise = function() {
            for(var i = 0, c = listeners.length; i < c; i+=2)
                listeners[i].apply(listeners[i+1] || call_this, arguments);
        };
    };
    controls.Event.prototype = {
        addListener: function(call_this/*optional*/, listener) {
            if (arguments.length > 1)
                this.listeners.push(listener, (call_this === this.call_this) ? null : call_this);
            else
                this.listeners.push(call_this, null);
        },

        removeListener: function(listener) {
            var listeners = this.listeners,
                index = listeners.indexOf(listener);
            if (index >= 0)
                listeners.splice(index, 2);
        },
        clear: function() {
            this.listeners.length = 0;
        },
        toJSON: function() {
            var jsonlisteners = [],
                listeners = this.listeners;
            // Serialize listeners
            for(var i = 0, c = listeners.length; i < c; i+=2) {
                var event_func = listeners[i];
                if (!event_func.no_serialize) {
                    jsonlisteners.push(extract_func_code(event_func));
                    // call_this not serialize
                    jsonlisteners.push(null);
                }
            }
            return {type:this.type, capture:this.capture, listeners:jsonlisteners};
        }
    };
    
    // Post processing
    var post_events = [];
    setInterval(function() {
        if (post_events.length > 0)
        for(var i = 0, c = post_events.length; i < c; i++) {
            try {
                post_events[i].post_event.raise();
            }
            catch(e) { console.log(e); }
            
            post_events.length = 0;
        };
    }, 30);
    
// >> Data objects
    
    var data_object_common = {
        listen: function(call_this/*optional*/, listener) {
            var event = this.event || (this.event = new controls.Event(this));
            event.addListener.apply(event, arguments);
            return this;
        },
        listen_: function(call_this/*optional*/, listener) {
            if (typeof listener === 'function')
                listener.no_serialize = true;
            else
                call_this.no_serialize = true;
            return this.listen.apply(this, arguments);
        },
        removeListener: function(listener) {
            var event = this.event;
            if (event)
                event.removeListener(listener);
            return this;
        },
        subscribe: function(call_this/*optional*/, listener) {
            if (typeof(call_this) === 'function') {
                listener = call_this;
                call_this = this;
            }
            
            if (!listener)
                return this;
            
            var post_event = this.post_event || (this.post_event = new controls.Event(this));
            post_event.addListener.apply(post_event, arguments);
            
            return this;
        },
        unsubscribe: function(listener) {
            var post_event = this.post_event;
            if (post_event)
                post_event.removeListener(listener);
            return this;
        },
        raise: function() {
            var event = this.event;
            if (event)
                event.raise.apply(this, arguments);
            
            var post_event = this.post_event;
            if (post_event) {
                var index = post_events.indexOf(this);
                if (index < 0 || index !== post_events.length - 1) {
                    if (index >= 0)
                        post_events.splice(index, 1);
                    post_events.push(this);
                }
            }
        },
        set: function(name, value) {
            this.state_id++;
            this[name] = value;
            this.last_name = name;
            this.raise();
        },
        setx: function(collection) {
            var modified;
            for(var prop in collection)
            if (collection.hasOwnProperty(prop)) {
                modified = true;
                this.state_id++;
                this[prop] = collection[prop];
                this.last_name = collection;
            }
            if (modified)
                this.raise();
        }
    };
    
    function DataObject(parameters, attributes) {
        this.state_id = Number.MIN_VALUE;
    }
    DataObject.prototype = data_object_common;
    controls.typeRegister('DataObject', DataObject);
    
    var data_array_common = {
        // ops: 1 - insert, 2 - remove, ...
        push: function(item) {
            var proto = Object.getPrototypeOf(this);
            for(var i = 0, c = arguments.length; i < c; i++)
                proto.push.call(this, arguments[i]);
            this.state_id += c;
            this.last_operation = 1;
            this.last_index = this.length - 1;
            this.raise(this);
        }
        // TODO
    };
        
    function LocalStorageAdapter(parameters, attributes) {
    };
    LocalStorageAdapter.prototype = {
        raise: function(type) {}
    };
    controls.typeRegister('LocalStorage', LocalStorageAdapter);
    
    // DataArray
    // 
    // Parameters:
    // adapter {string} - registered type
    // Attributes:
    // data - an array of values for the initial filling of the data array
    //
    // No!Brrr! TODO this
    function DataArray(parameters, attributes) { // factory method
        var array = [];
        
        if (attributes) {
            // $data
            var data = attributes.$data;
            if (data)
                for(var i = 0, c = data.length; i < c; i++)
                    array[i] = data[i];
        }
        
        for(var prop in data_object_common)
        if (data_object_common.hasOwnProperty(prop))
            array[prop] = data_object_common[prop];
    
        for(var prop in data_array_common)
        if (data_array_common.hasOwnProperty(prop))
            array[prop] = data_array_common[prop];
        
        array.state_id       = Number.MIN_VALUE;   // Value identifying the state of the object is incremented each state-changing operation
        array.last_operation = 0;                  // Last state-changing operation
        array.last_changed   = undefined;          // Last changed property name or index
        
        if (parameters && parameters.adapter)
        if (!(this.adapter = controls.create(parameters.adapter)))
            throw new TypeError('Invalid data adapter type "' + parameters.adapter + '"!');
        
        return array;
    }
    controls.factoryRegister('DataArray', DataArray);
    
// >> Controls prototype
    
    controls.control_prototype = new function() {
        
        this.initialize = function(__type, parameters, _attributes, outer_template, inner_template) {
            return controls.controlInitialize(this, __type, parameters, _attributes, outer_template, inner_template);
        };
        
        function setParent(value, index) {
            var parent = this._parent;
            if (value !== parent) {
                this._parent = value;
                var name = this._name;
                
                if (parent) {
                    var parent_controls = parent.controls,
                        index = parent_controls.indexOf(this);
                    if (index >= 0)
                        parent_controls.splice(index, 1);
                    
                    if (name && parent.hasOwnProperty(name) && parent[name] === this)
                        delete parent[name];
                }
                
                if (value) {
                    var value_controls = value.controls;

// profiling: very expensive operation
//                    var index = value_controls.indexOf(this);
//                    if (index >= 0)
//                        parent_controls.splice(index, 1);
                    if (index === undefined)
                        value_controls.push(this);
                    else
                        value_controls.splice(index, 0, this);
                    
                    if (name)
                        value[name] = this;
                }
                
                this.raise('parent', value);
            }
        }
        
        Object.defineProperties(this, {
            // name of the control in parent collection
            name: {
                enumerable: true, 
                get: function() { return this._name; },
                set: function(value) {
                    if (IDENTIFIERS.indexOf(',' + value + ',') >= 0)
                        throw new SyntaxError('Invalid name "' + value + '"!');

                    var name = this._name;
                    if (value !== name) {
                        this._name = value;

                        var parent = this._parent;
                        if (parent) {
                            if (name && parent.hasOwnProperty(name) && parent[name] === this)
                                delete parent[name];

                            if (value)
                                parent[value] = this;
                        }
                    }
                }
            },
            // The associated DOM node
            element: {
                enumerable: true,
                get: function() { return this._element; },
                set: function(attach_to_element) {
                    var element = this._element;
                    if (attach_to_element !== element) {
                        this._element = attach_to_element;

                        var events = this.events;
                        if (events)
                        for(var event_type in events) {
                            var event = events[event_type];
                            if (event.is_dom_event) {
                                // remove event raiser from detached element
                                if (element)
                                    element.removeEventListener(event.type, event.raise, event.capture);
                                // add event raiser as listener for attached element
                                if (attach_to_element)
                                    attach_to_element.addEventListener(event.type, event.raise, event.capture);
                            }
                        }
                        this.raise('element', attach_to_element);
                    }
                }
            },
            parent: {
                enumerable: true,
                get: function() { return this._parent; },
                set: setParent
            },
            wrapper: {
                enumerable: true,
                get: function() { return this._wrapper; },
                set: function(value) {
                    var wrapper = this._wrapper;
                    if (value !== wrapper) {
                        this._wrapper = value;

                        if (wrapper) {
                            var wrapper_controls = wrapper.controls;
                            var index = wrapper_controls.indexOf(this);
                            if (index >= 0)
                                wrapper_controls.splice(index, 1);
                        }

                        if (value) {
                            var value_controls = value.controls;

        // profiling: indexOf very expensive operation
        //                    var index = value_controls.indexOf(this);
        //                    if (index >= 0)
        //                        wrapper_controls.splice(index, 1);

                            value_controls.push(this);
                        }
                    }
                }
            },
            length: {
                enumerable: true,
                get: function() {
                    return this.controls.length;
                }
            }
        });
        
        this.find = function(selector, by_attrs, recursive) {
            if (arguments.length < 3)
                recursive = true;
            var controls = this.controls,
                result = [];
            if (typeof selector === 'object' || typeof by_attrs === 'object') {
                for(var i = 0, c = controls.length; i < c; i++) {
                    var control = controls[i];
                    
                    // by properties
                    if (selector)
                    for(var prop in selector)
                    if (selector.hasOwnProperty(prop)) {
                        if (control[prop] === selector[prop])
                            result.push(control);
                        // by attributes
                        else if (by_attrs) {
                            var attributes = control.attributes;
                            for(var prop in by_attrs)
                            if (by_attrs.hasOwnProperty(prop) && attributes[prop] === by_attrs[prop])
                                result.push(control);
                        } else if (recursive) {
                        // find recursively
                            var finded = control.find(selector, by_attrs, recursive);
                            if (finded.length)
                                result.push.apply(result, finded);
                        }
                    }
                }
            } else if (!selector) {
                return controls[0];
            } else if (typeof selector === 'string') {
                return callWithSelector.call(this, this.find, selector);
            } else if (typeof selector === 'function') {
                for(var i = 0, c = controls.length; i < c; i++) {
                    var control = controls[i];
                    if (selector(control))
                        result.push(control);
                    // find recursively
                    else if (recursive) {
                        var finded = control.find(selector, by_attrs, recursive);
                        if (finded.length)
                            result.push.apply(result, finded);
                    }
                }
            }
        };
        
        this.select = function(selector, by_attrs) {
            return this.find(selector, by_attrs, false);
        };
                
        this.first = function(selector, by_attrs) {
            return this.findFirst(selector, by_attrs, false);
        };
        
        /**
         * 
         * @param {string,function} selector (string) format name:type`class#id, (object) Control property values for comparing
         * @param {type} attrs Control attribute values for comparing
         * @returns {object} matched control
         */
        this.findFirst = function(selector, by_attrs, recursive) {
            if (arguments.length < 3)
                recursive = true;
            var controls = this.controls;
            if (typeof selector === 'object' || typeof by_attrs === 'object') {
                for(var i = 0, c = controls.length; i < c; i++) {
                    var control = controls[i];
                    
                    // by properties
                    if (selector)
                    for(var prop in selector)
                    if (selector.hasOwnProperty(prop) && control[prop] === selector[prop])
                        return control;
            
                    // by attributes
                    if (by_attrs) {
                        var attributes = control.attributes;
                        for(var prop in by_attrs)
                        if (by_attrs.hasOwnProperty(prop) && attributes[prop] === by_attrs[prop])
                            return control;
                    }
                    
                    // find recursively
                    if (recursive) {
                        var finded = control.findFirst(selector, by_attrs, recursive);
                        if (finded)
                            return finded;
                    }
                }
            } else if (!selector) {
                return controls[0];
            } else if (typeof selector === 'string') {
                return callWithSelector.call(this, this.findFirst, selector);
            } else if (typeof selector === 'function') {
                for(var i = 0, c = controls.length; i < c; i++) {
                    var control = controls[i];
                    if (selector(control))
                        return control;
                    // find recursively
                    if (recursive) {
                        var finded = control.findFirst(selector, by_attrs, recursive);
                        if (finded)
                            return finded;
                    }
                }
            }
        };
        
        this.last = function(selector, by_attrs) {
            return this.findLast(selector, by_attrs, false);
        };
        
        this.findLast = function(selector, by_attrs, recursive) {
            if (arguments.length < 3)
                recursive = true;
            var controls = this.controls;
            if (typeof selector === 'object' || typeof by_attrs === 'object') {
                for(var i = controls.length - 1; i >= 0; i--) {
                    var control = controls[i];
                    
                    // by properties
                    if (selector)
                    for(var prop in selector)
                    if (selector.hasOwnProperty(prop) && control[prop] === selector[prop])
                        return control;
                
                    // by attributes
                    if (by_attrs) {
                        var attributes = control.attributes;
                        for(var prop in by_attrs)
                        if (by_attrs.hasOwnProperty(prop) && attributes[prop] === by_attrs[prop])
                            return control;
                    }
                    
                    // find recursively
                    if (recursive) {
                        var finded = control.findLast(selector, by_attrs, recursive);
                        if (finded)
                            return finded;
                    }
                }
            } else if (!selector) {
                return controls[0];
            } else if (typeof selector === 'string') {
                return callWithSelector.call(this, this.findLast, selector);
            } else if (typeof selector === 'function') {
                for(var i = controls.length - 1; i >= 0; i--) {
                    var control = controls[i];
                    if (selector(control))
                        return control;
                    // find recursively
                    if (recursive) {
                        var finded = control.findLast(selector, by_attrs, recursive);
                        if (finded)
                            return finded;
                    }
                }
            }
        };
        
        function callWithSelector(method, selector) {
            // name:...
            var name, type = selector, colonpos = selector.indexOf(':');
            if (colonpos >= 0) {
                name = selector.substr(0, colonpos);
                type = selector.substr(colonpos + 1);
            }
            // `...
            var clss, gravepos = type.indexOf('`');
            if (gravepos >= 0) {
                type = selector.substr(0, gravepos);
                clss = selector.substr(gravepos + 1);
            }
            // #...
            var num, numpos = type.indexOf('#');
            if (numpos >= 0) {
                type = selector.substr(0, numpos);
                num = selector.substr(numpos + 1);
            }
            
            if (type && type.indexOf('.') < 0)
                type = 'controls.' + type;
            
            var by_props, by_attrs;
            if (type)   (by_props || (by_props = {})).__type = type;
            if (name)   (by_props || (by_props = {})).name = name;
            if (clss)   (by_attrs || (by_attrs = {})).class = clss;
            return method.call(this, by_props, by_attrs);
        }
        
        /**
         * Default html template accessable from this.
         * @member {function}
         */
        this.outer_template = function(it) {
            return '<div' + it.printAttributes() + '>' + (it.attributes.$text || '') + it.printControls() + '</div>';
        };
        
        /**
         * Default html template accessable from library context.
         * @member {function}
         */
        controls.default_outer_template = this.outer_template;

        /**
         * Default inner html template accessable from this.
         * @member {function}
         */
        this.inner_template = function(it) {
            return (it.attributes.$text || '') + it.printControls();
        };
        
        /**
         * Default inner html template accessable from library context.
         * @member {function}
         */
        controls.default_inner_template = this.inner_template;
        
        /**
         * Default inline html template accessable from library context.
         * @member {function}
         */
        controls.default_outer_inline_template = function(it) {
            return '<span' + it.printAttributes() + '>' + (it.attributes.$text || '') + it.printControls() + '</span>';
        };

        /**
         * Assemble inner HTML-code of the control. This value is obtained by calling this.inner_template(). That normally is the concatenation of results of .wrappedHTML() from all the child controls.
         * 
         * @returns {string} Returns inner HTML code string.
         */
        this.innerHTML = function() {
            return this.inner_template(this);
        };
        
        /**
         * Assemble HTML-code of the control. This value is obtained by calling this.outer_template(). That normally is the combination of the current control tags and results of .wrappedHTML() from all the child controls.
         * 
         * @returns {string} Returns inner HTML code string.
         */
        this.outerHTML = function() {
            return this.outer_template(this);
        };
        
        /**
         * Assemble wrapped html code of the control.
         * 
         * @returns {string} Returns inner HTML code string.
         */
        this.wrappedHTML = function() {
            var wrapper = this._wrapper;
            return (wrapper) ? wrapper.wrappedHTML() : this.outerHTML();
        };
        
        /**
         * Set control templates
         * 
         * @param {function} outer_template - template function to get the outer HTML code.
         * @param {function} [inner_template] - template function to get the inner HTML code.
         * @returns Returns this.
         */
        this.template = function(outer_template, inner_template) {
            if (outer_template) {
                if (typeof outer_template === 'string')
                    outer_template = controls.template(outer_template);
                if (!this.hasOwnProperty("outer_template"))
                    Object.defineProperty(this, "outer_template", { configurable:true, enumerable:true, writable:true, value:outer_template });
                else
                    this.outer_template = outer_template;
            }
            if (inner_template) {
                if (typeof outer_template === 'string')
                    inner_template = controls.template(inner_template);
                if (!this.hasOwnProperty("inner_template"))
                    Object.defineProperty(this, "inner_template", { configurable:true, enumerable:true, writable:true, value:inner_template });
                else
                    this.inner_template = inner_template;
            }
            return this;
        };
        
        this.toJSON = function() {
            var json = {
                __type: this.type(),
                attributes: this.attributes
            };
            
            var name = this.name;
            if (name)
                json.name = name;
            
            var ctrls = this.controls;
            if (ctrls.length)
                json.controls = ctrls;
            
            if (this.hasOwnProperty('outer_template')) {
                var outer_template = this.outer_template;
                if (!outer_template.no_serialize)
                    json.outer_template = extract_func_code(this.outer_template);
            }
            if (this.hasOwnProperty('inner_template')) {
                var inner_template = this.outer_template;
                if (!inner_template.no_serialize)
                    json.inner_template = extract_func_code(this.inner_template);
            }
            
            var events = this.events;
            if (events) {
                var jevents = [];
                for(var prop in events)
                if (events.hasOwnProperty(prop)) {
                    var event = events[prop],
                        listeners = event.listeners,
                        serialize = false;
                    for(var i = 0, c = listeners.length; i < c; i+=2)
                        if (!listeners[i].no_serialize) {
                            serialize = true;
                            break;
                        }
                    if (serialize)
                        jevents.push(event);
                }
                if (jevents.length)
                    json.events = jevents;
            }
            return json;
        };
        
        /**
         * Refresh DOM element.
         */
        this.refresh = function() {
            var element = this._element;
            if (element) {
                if (!element.parentNode) {
                    // orphaned element
                    this._element = undefined;
                } else {
                    try {
                        // Setting .outerHTML breaks hierarchy DOM, so you need a complete re-initialisation bindings to DOM objects.
                        // Remove wherever possible unnecessary calls .refresh()

                        var html = this.outerHTML();
                        if (html !== element.outerHTML) {
                            this.detachAll();
                            element.outerHTML = html;
                            this.attachAll();
                        }
                    }
                    catch (e) {
                        // Uncaught Error: NoModificationAllowedError: DOM Exception 7
                        //  1. ? xml document
                        //  2. ? "If the element is the root node" ec orphaned element
                        this._element = undefined;
                    }
                }
            }
            return this;
        };
        
        /**
         * Refresh child DOM elements.
         */
        this.refreshInner = function() {
            var element = this._element;
            if (element)
                element.innerHTML = this.innerHTML();
            return this;
        };
        
        /**
         * Attach control to an existing DOM element.
         * 
         * @param {object|string} [selector] DOM element or CSS selector string.
         * @returns Returns this.
         */
        this.attach = function(selector) {
            if (typeof selector === 'object')
                this.element = selector;
            else if (typeof selector === 'string')
            this.element = document.querySelector(selector);
            return this;
        };
        
        /**
         * Attach this and all nested controls to DOM by id.
         */
        this.attachAll = function() {
            if (!this._element)
                this.element = document.getElementById(this.id);
            for(var ctrls = this.controls, i = 0, c = ctrls.length; i < c; i++)
                ctrls[i].attachAll();
            return this;
        };
        
        /**
         * Detach control from DOM.
         */
        this.detach = function() {
            this.element = undefined;
            return this;
        };
        
        /**
         * Detach this and all nested controls from DOM.
         */
        this.detachAll = function() {
            this.element = undefined;
            for(var ctrls = this.controls, i = 0, c = ctrls.length; i < c; i++)
                ctrls[i].detachAll();
            return this;
        };
        
        /**
         * Replace control in hierarchy tree.
         * 
         * @param {object} control A new control.
         * @returns Returns this.
         */
        this.replaceItself = function(control) {
            var controls = this.controls;

            // .controls may be a DataArray
            for(var i = controls.length - 1; i >= 0; i--)
                control.add(controls.shift());
            
            var parent = this.parent;
            if (!parent)
                control.parent = undefined;
            else {
                var index = parent.controls.indexOf(this);
                this.parent = undefined;
                setParent.call(control, parent, index);
            }
            var element = this._element;
            if (!element)
                control.element = undefined;
            else {
                control.element = element;
                control.refresh(); // rewrite dom
            }
            return this;
        };
        
        /**
         * Create DOM node.
         * 
         * @param {object} node DOM node for positioning newly created node.
         * @param {number} opcode 0 - insert before end, 1 - insert after begin, 2 - insert before, 3 - insert after
         * @returns Returns this.
         */
        this.createElement = function(node, opcode) {
            var element = this._element,
                parent = this.parent;
        
            if (element)
                throw new TypeError('Element already exists!');
            
            if (!node && parent) {
                node = parent.element;
                opcode = 0;
            }
            
            if (node && '__type' in node)
                node = node.element;
            
            if (!node)
                throw new TypeError('Failed to create element!');
            
            if (node.insertAdjacentHTML) {
                var pos;
                switch(opcode) {
                    case 1: pos = 'afterbegin'; break;
                    case 2: pos = 'beforebegin'; break;
                    case 3: pos = 'afterend'; break;
                    default: pos = 'beforeend';
                }
                // illegal invocation on call this method before element completed
                node.insertAdjacentHTML(pos, this.outerHTML());
                
            } else {

                var fragment = document.createDocumentFragment(),
                    el = document.createElement('div');
                el.innerHTML = this.outerHTML();
                var buf = Array.prototype.slice.call(el.childNodes);
                for(var i = 0, c = buf.length; i < c; i++)
                    fragment.appendChild(buf[i]);

                switch(opcode) {
                    case 1:
                        (node.childNodes.length === 0) ? node.appendChild(fragment) : node.insertBefore(node.firstChild, fragment);
                        break;
                    case 2:
                        var nodeparent = node.parentNode;
                        if (nodeparent)
                            nodeparent.insertBefore(fragment, node);
                        break;
                    case 3:
                        var nodeparent = node.parentNode;
                        if (nodeparent) {
                            var next_node = node.nextSibling;
                            if (next_node)
                                nodeparent.insertBefore(fragment, next_node);
                            else
                                nodeparent.appendChild(fragment);
                        }
                        break;
                    default:
                        node.appendChild(fragment);
                }
            }
            return this.attachAll();
        };
        
        /**
         * Delete attached DOM node.
         * @returns Returns this.
         */
        this.deleteElement = function() {
            var element = this._element;
            if (element) {
                this.detachAll();
                var parent_node = element.parentNode;
                if (parent_node)
                    parent_node.removeChild(element);
                this._element = undefined;
            }
            return this;
        };
        
        /**
         * Delete all child DOM nodes.
         * 
         * @returns Returns this.
         */
        this.deleteAll = function() {
            this.deleteElement();
            for(var ctrls = this.controls, i = ctrls.length - 1; i >= 0; i--)
                ctrls[i].deleteAll();
            return this;
        };
        
        /**
         * Add event listener.
         * 
         * @param {string} type Event type. Event type may be DOM event as "click" or special control event as "type".
         * @param {object} [call_this] The value to be passed as the this parameter to the target function when the event handler function is called.
         * @param {function} listener Event handler function.
         * @param {boolean} [capture] This argument will be passed to DOM.addEventListener(,, useCapture).
         * @returns Returns this.
         */
        this.on = this.listen = function(type, /*optional*/ call_this, listener, /*optional*/ capture) {
            if (typeof(call_this) === 'function') {
                capture = listener;
                listener = call_this;
                call_this = null;
            }
            if (type && listener)
                force_event(this, type, capture)
                    .addListener(call_this, listener);
            return this;
        };
        
        // set listener and check listener as no_serialize
        this.on_ = this.listen_ = function(type, call_this, listener, capture) {
            if (typeof(call_this) === 'function') {
                capture = listener;
                listener = call_this;
                call_this = null;
            }
            if (type && listener) {
                force_event(this, type, capture)
                    .addListener(call_this, listener);
                listener.no_serialize = true;
            }
            return this;
        };
        
        // Alias for listen()
        this.addListener = function(type, call_this/*optional*/, listener, capture) {
            return this.listen(type, call_this, listener, capture);
        };
        
        /**
         * Remove event listener.
         * 
         * @param {string} type Event type.
         * @param {function} listener Event handler function.
         * @param [capture] This argument will be passed to DOM.removeEventListener(,, useCapture).
         * @returns Returns this.
         */
        this.removeListener = function(type, listener, capture) {
            if (type && listener)
                force_event(this, type, capture).removeListener(listener);
            return this;
        };
        
        /**
         * Raise event.
         * 
         * @param {string} type Event type.
         * @param Arbitrary number of arguments to be passed to handlers.
         * @returns Returns this.
         */
        this.raise = function(type) {
            var events = this.events;
            if (type && events) {
                var capture_event = events['#' + type],
                    event = events[type],
                    args = Array.prototype.slice.call(arguments, 1);
            
                if (capture_event)
                    capture_event.raise.apply(this, args);

                if (event)
                    event.raise.apply(this, args);
            }
            return this;
        };
        
        this.raiseDOMEvent = function(event, options) {
            
            if (!this._element)
                throw new TypeError('Control not attached to DOM!');
            
            var event_object,
                event_default = {
                    // Event https://developer.mozilla.org/en-US/docs/Web/API/Event
                    target: this._element,
                    type: event,
                    bubbles: true,
                    cancelable: true
                };

            if (/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/.test(event)) {
                // MouseEvent https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
                ['button', 'buttons', 'clientX', 'clientY', 'movementX', 'movementY', 'screenX', 'screenY'].forEach(function(prop) { event_default[prop] = 0; });
                ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].forEach(function(prop) { event_default[prop] = false; });
                event_default.relatedTarget = null;
                // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent
                event_default.view = this._element.ownerDocument.defaultView;
                event_object = new MouseEvent(event, controls.extend(event_default, options));
            }

            if (event_object)
                this._element.dispatchEvent(event_object);
        };
        
        /**
         * Get or set parameter value.
         * 
         * @param {string} name Parameter name.
         * @param [value] value Parameter value.
         * @returns Returns parameter value or this.
         */
        this.parameter = function(name, value) {
            var parameters = this.parameters;
            
            if (arguments.length <= 1)
                return parameters[name] || parameters['/'+name];
            
            if (value !== parameters[name]) {
                parameters[name] = value;
                this.refresh();
            }
            return this;
        };
        
        /**
         * Set parameter value and return this.
         * 
         * @param {string} name Parameter name.
         * @param [value] value Parameter value.
         * @returns Returns this.
         */
        this._parameter = function(name, value) {
            this.parameter(name, value);
            return this;
        };
        
        /**
         * Get or set attribute value.
         * 
         * @param {string} name Attribute name.
         * @param [value] value Attribute value.
         * @returns Returns attribute value or this.
         */
        this.attr = function(name, value) {
            var attributes = this.attributes;
            
            if (arguments.length === 0)
                return undefined;
            
            if (arguments.length === 1)
                return attributes[name];
            
            if (value !== attributes[name]) {
                attributes[name] = value;
                
                if (this._element)
                    this.refresh();
            }
        };
        
        /**
         * Set attribute value and return this.
         * 
         * @param {string} name Attribute name.
         * @param [value] value Attribute value.
         * @returns Returns attribute value or this.
         */
        this._attr = function(name, value) {
            this.attr(name, value);
            return this;
        };
        
        // set attributes
        this.attrs = function(_attributes) {
            var attributes = this.attributes;
            
            if (arguments.length > 0) {
                var updated = false;

                for(var prop in _attributes)
                if (_attributes.hasOwnProperty(prop)) {
                    var value = _attributes[prop];
                    if (value !== attributes[prop]) {
                        attributes[prop] = value;
                        updated = true;
                    }
                }

                if (updated && this._element)
                    this.refresh();
            }
            return attributes;
        };
        
        this._attrs = function(_attributes) {
            this.attrs(_attributes);
            return this;
        };
        
        // get/set path.type/parameters
        this.type = function(type, apply_inherited) {
            // >> get type
            
            if (!arguments.length) {
                var inheritable = '', unheritable = '', parameters = this.parameters;
                for(var prop in parameters)
                if (parameters.hasOwnProperty(prop)) {
                    var value = parameters[prop];
                    if (typeof value === 'boolean' && value)
                        value = '';
                    else  {
                        if (typeof value !== 'string')
                            value = String(value);
                        value = ((value.indexOf(' ') >= 0) ? ('="' + value + '"') : ('=' + value));
                    }
                    if (prop[0] === '/') {
                        // inheritable parameters
                        if (inheritable) inheritable += ' ';
                        inheritable += prop.substr(1) + value;
                    } else {    
                        // not inheritable parameters
                        if (unheritable) unheritable += ' ';
                        unheritable += prop + value;
                    }
                }
                
                var type = this.__type;
                if (unheritable)
                    type += ' ' + unheritable;
                if (inheritable)
                    type += '/' + inheritable;

                return type;
            }
            
            // << get type
            
            // >> set type and parameters
            
            var parameters = this.parameters; // rebuild parameters
            for(var prop in parameters)
            if (parameters.hasOwnProperty(prop)) 
                delete parameters[prop];
                
            if (apply_inherited && this.parent) {
                // get inheritable parameters from this object for transfer to the created object

                var parent_parameters = parent.parameters;
                for(var prop in parent_parameters)
                if (parameters.hasOwnProperty(prop) && prop[0] === '/')
                    parameters[prop] = parent_parameters[prop];
            }
            
            this.__type = parse_type(type, parameters, this.attributes) || this.__type;

            this.raise('type');
            
            // no automatic refresh() calls
            
            // << set type and parameters
        };
        
        this._type = function(type, apply_inherited) {
            this.type(type, apply_inherited);
            return this;
        };
        
        // Get html code of the selected attributes
        // 
        // attributes (optional, string) - attributes, comma separated list
        // exclude (optional, bool) - use first argument as filter (false) or exclude list (true)
        // example: it.printAttributes("style") - result only one style attribute 'style="..."'
        // example: it.printAttributes("-id") - result attributes all exclude id
        //
        this.printAttributes = function(filter) {
            var result = '', attributes = this.attributes;
            
            if (filter) {
                // TODO: temporary inserted this checking:
                if (filter.indexOf(',') >= 0)
                    console.log('printAttributes() Use a space to separate of identifiers');
                
                if (filter[0] === '-') {
                    // exclusion defined
                    var exclude = filter.substr(1).split(' ');
                    for(var prop in attributes)
                    if (attributes.hasOwnProperty(prop) && prop[0] !== '$' && exclude.indexOf(prop) < 0) {
                        var value = attributes[prop];
                        if (value)
                            result += ' ' + prop + '="' + value + '"';
                    }
                }
                else {
                    // list of attributes
                    
                    var attrs = filter.split(' ');
                    for(var i = 0, c = attrs.length; i < c; i++) {
                        var key = attrs[i],
                            value = attributes[key];
                        if (value)
                            result += ' ' + key + '="' + value + '"';
                    }
                }
            }
            else {
                // unconditional out all attributes
                for(var prop in attributes)
                if (attributes.hasOwnProperty(prop) && prop[0] !== '$') {
                    var value = attributes[prop];
                    if (value)
                        result += ' ' + prop + '="' + value + '"';
                }
            }
            
            return result;
        };
        
        this.printControls = function() {
            var result = '', ctrls = this.controls;
            for(var i = 0, c = ctrls.length; i < c; i++)
                result += ctrls[i].wrappedHTML();
            return result;
        };
        
        // Set .$text attribute on this object and refresh DOM element.outerHTML
        this.text = function(text) {
            var attributes = this.attributes;
            if (arguments.length) {
                if (text !== attributes.$text) {
                    attributes.$text = text;
                    this.refresh();
                }
            }
            return attributes.$text;
        };
        
        this._text = function(text) {
            this.text(text);
            return this;
        };
        
        this.style = function(style) {
            var attributes = this.attributes;
            
            if (arguments.length) {
                if (style !== attributes.style) {
                    attributes.style = style;
                    
                    var element = this._element;
                    if (element)
                        element.style = style;
                    
                    this.raise('attributes', 'style', style);
                };
                return style;
            }
            
            return attributes.style;
        };
        
        this._style = function(style) {
            this.style(style);
            return this;
        };
        
        this.class = function(set, remove) {
            var attributes = this.attributes;
            
            if (set || remove) {
                var _class = attributes.class;
                var classes = (_class) ? _class.split(' ') : [];
                
                if (remove) {
                    remove = remove.split(' ');
                    for(var i = 0, c = remove.length; i < c; i++) {
                        var remove_class = remove[i];
                        var index = classes.indexOf(remove_class);
                        if (index >= 0)
                            classes.splice(index, 1);
                    }
                }
                
                if (set) {
                    set = set.split(' ');
                    for(var i = 0, c = set.length; i < c; i++) {
                        var set_class = set[i];
                        if (classes.indexOf(set_class) < 0)
                            classes.push(set_class);
                    }
                }
                
                _class = classes.join(' ');
                if (_class !== attributes.class) {
                    attributes.class = _class;
                    
                    var element = this._element;
                    if (element)
                        element.className = _class;
                    
                    this.raise('attributes', 'class', _class);
                }
            }
            
            return attributes.class;
        };
        
        this._class = function(set, remove) {
            this.class(set, remove);
            return this;
        };
        
        /**
         * Create a new component and insert to the component.controls collection at the specified index.
         * 
         * @param {number} index Index in component.controls collection.
         * @param {string} type Type containing the parameters attributes and styles.
         * @param $prime [prime] Prime value is a responsibility of the component. This parameter value can be of simple type or be derived from DataObject DataArray.
         * @param {object} [attributes] Attributes hash object to be passed to the component.
         * @param {function} [callback] The callback will be called each time after the creation of a new component.
         * @param {object} [this_arg] The value to be passed as the this parameter to the target function when the callback function is called. 
         * @returns {object} Returns newly created component object.
         */
        this.insert = function(index, type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
            
            if (!type)
                return;
            
            // normalize arguments
            if (typeof $prime === 'function') {
                this_arg = attributes;
                callback = $prime;
                $prime = undefined;
                attributes = undefined;
            } else {
                if (typeof $prime === 'object' && !Array.isArray($prime)) {
                    this_arg = callback;
                    callback = attributes;
                    attributes = $prime;
                    $prime = undefined;
                }
                if (typeof attributes === 'function') {
                    this_arg = callback;
                    callback = attributes;
                    attributes = undefined;
                }
            }
            
            if (Array.isArray(type)) {
                // collection detected
                var result;
                for(var i = index, c = index + type.length; i < c; i++)
                    result = this.insert(i, type[i], $prime, attributes, callback, this_arg);
                return result;
            }
            
            if (typeof type === 'object') {
                // it is a control?
                var add_control = type;
                if (add_control.hasOwnProperty('__type'))
                    setParent.call(type, this, index);
                return add_control;
            }
            
            var attrs = {class:''}, parameters = {};
            
            for(var prop in attributes)
            if (attributes.hasOwnProperty(prop)) 
                attrs[prop] = attributes[prop];
                
            // transfer inheritable parameters to the created object
            var this_parameters = this.parameters;
            for(var prop in this_parameters)
            if (this_parameters.hasOwnProperty(prop) && prop[0] === '/')
                parameters[prop] = this_parameters[prop];
            
            // resolve constructor
            var __type, constructor;
            
            if (typeof type === 'function') {
                // template function
                __type = 'controls.custom';
                constructor = Custom;
                attrs.$template = type;
            } else if (type.charAt(0) === '<') {
                // template
                __type = 'controls.custom';
                constructor = Custom;
                attrs.$template = controls.template(type);
            } else {
                __type = parse_type(type, parameters, attrs);
                constructor = resolve_ctr(__type, parameters);
            }

            if ($prime)
                attrs.$prime = $prime;
            
            // type error processing
            if (!constructor) {
                if (!type_error_mode)
                    throw new TypeError('Type ' + __type + ' not registered!');
                else {
                    // route to Stub
                    parameters['#{type}'] = type; // pass original type
                    parameters['#{__type}'] = __type;
                    parameters['#{callback}'] = callback;
                    parameters['#{this_arg}'] = this_arg;
                    constructor = resolve_ctr('controls.stub', parameters);
                }
            }
            
            // move $parameters to attributes (unsafe)
            for(var prop in parameters)
            if (parameters.hasOwnProperty(prop) && prop[0] === '$')
                attrs[prop.substr(1)] = parameters[prop];
            
            // create control

            var new_control = new constructor(parameters, attrs);

            // reflect after creation
            new_control.raise('type');

            // set parent property
            setParent.call(new_control, this, index);

            // callback
            if (callback)
                callback.call(this_arg || this, new_control);

            return new_control;
        };
        
        this.add = function(type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
            return this.insert(this.controls.length, type, $prime, attributes, callback, this_arg);
        };
        
        this.addOrStub = function(type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
            type_error_mode = 1;
            try {
                return this.add.apply(this, arguments);
            } catch (e) {}
            finally {
                type_error_mode = 0;
            }
        };
        
        this._add = function(type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
            this.insert(this.controls.length, type, $prime, attributes, callback, this_arg);
            return this;
        };
        
        this.unshift = function(type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
            return this.insert(0, type, $prime, attributes, callback, this_arg);
        };
        
        this._unshift = function(type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
            this.insert(0, type, $prime, attributes, callback, this_arg);
            return this;
        };
        
        // Remove subcontrol from .controls collection
        //
        this.remove = function(control) {
            if (!arguments.length) {
                // .remove() without arguments removes this control from parent .controls collection
                this.parent = undefined;
                return;
            }
            
            if (control)
                control.parent = undefined;
            return this;
        };
        
        // Remove all subcontrols from .controls collection
        //
        this.removeAll = function() {
            for(var ctrls = this.controls, i = ctrls.length - 1; i >= 0; i--)
                this.remove(ctrls[i]);
            return this;
        };
        
        function route_data_event() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('data');
            this.raise.apply(this, args);
        };
        
        this.bind = function(data_object, post_mode) {
            var this_data = this.data;
            if (data_object !== this_data) {
                this.data = data_object;

                if (this_data) {
                    this_data.removeListener(route_data_event);
                    this_data.unsubscribe(route_data_event);
                }

                if (data_object) {
                    if (post_mode)
                        data_object.subscribe(this, route_data_event);
                    else
                        data_object.listen_(this, route_data_event);
                }
                
                route_data_event.call(this);
            }
            return this;
        };
    
        this.every  = function(delegate, thisArg)   { return this.controls.every(delegate,   thisArg || this); };
        this.filter = function(delegate, thisArg)   { return this.controls.filter(delegate,  thisArg || this); };
        this.each   = this.forEach = function(delegate, thisArg)   { return this.controls.forEach(delegate, thisArg || this); };
        this.map    = function(delegate, thisArg)   { return this.controls.map(delegate,     thisArg || this); };
        this.some   = function(delegate, thisArg)   { return this.controls.some(delegate,    thisArg || this); };
    };
    
    function extract_func_code(func) {
        if (typeof func === 'function') {
            func = func.toString();
            var lbracket = func.indexOf('('),
                rbracket = func.indexOf(')');
            var first_par = func.indexOf('{'),
                last_par = func.lastIndexOf('}');
            // '@' - separator func argument names vs body
            return func.slice(lbracket + 1, rbracket) + '@' + func.substr(first_par + 1, last_par - first_par - 1);
        }
        return func;
    }
    
    /**
     * Parse type string, revision 2.0
     * 
     * @param {string} type Type with parameters, in format name:namespace.control`class1 classN#parameters/inheritable_parameters
     * @param {object} parameters Object acceptor parsed parameters
     * @param {object} attributes Object acceptor parsed attributes ($name, class)
     * @returns {String} Base type string
     */
    function parse_type(type, parameters, attributes) {
        
        var match = type.match(/\S+?(?=#|\/|`|\s|$|@)/);
        if (!match)
            return '';
        var match = match[0],
            __type, commapos = match.indexOf(':');
        if (commapos >= 0) {
            attributes.$name = match.substr(0, commapos);
            __type = match.substr(commapos + 1);
        } else
            __type = match;
        if (!__type)
            __type = 'controls.container';
        else if (__type.indexOf('.') < 0)
            __type = 'controls.' + __type;
        
        // parse parameters
        var params = type.slice(match.length),
            pos = 0, paramslen = params.length, inheritable = false, style = false;
        while(pos < paramslen && !style) {
            switch(params.charAt(pos)) {
                case ' ':case '\n':case '\t':  // parameters separator
                    pos++;
                    break;
                case '/': // next parameters is inheritable
                    inheritable = true; pos++;
                    break;
                case '`': // reminder of the line is style
                    style = true; pos++;
                    break;
                case '#': // assign identifier
                    var id_regex = /#.*?(?=#|`|\/|\s|$|@)/g;
                    id_regex.lastIndex = pos;
                    var match_id = id_regex.exec(params)[0];
                    attributes.id = match_id.slice(1);
                    pos += match_id.length;
                    break;
                default:
                    var par_name_regex = /\S+?(?=(=|#|`|\/|\s|$|@))/g;
                    par_name_regex.lastIndex = pos;
                    var par_name_match = par_name_regex.exec(params);
                    if (!par_name_match)
                        pos++;
                    else {
                        var parname = par_name_match[0],
                        par_name_after = par_name_match.index + parname.length;
                        if (par_name_match[1] === '=') {
                            if (params.charAt(par_name_after + 1) === '"') {
                                // param="value with spaces"
                                var quotepos = params.indexOf('"', par_name_after + 2);
                                while(quotepos >= 0 && quotepos < paramslen - 1 && ' \n\t#/`'.indexOf(params.charAt(quotepos + 1)) < 0)
                                    quotepos = params.indexOf('"', quotepos + 1);
                                if (quotepos < 0) {
                                    // param=" may be \" and no "
                                    if (inheritable) parname = '/' + parname;
                                    parameters[parname] = params.substr(par_name_after + 2);
                                    pos = paramslen;
                                } else {
                                    if (inheritable) parname = '/' + parname;
                                    parameters[parname] = params.slice(par_name_after + 2, quotepos);
                                    pos = quotepos + 1;
                                }
                            } else {
                                // param=value
                                var value_regex = /\S*?(?=(#|`|\/|\s|$|@))/g;
                                value_regex.lastIndex = par_name_after + 1;
                                var value = value_regex.exec(params)[0];
                                pos = par_name_after + 1 + value.length;
                                if (inheritable) parname = '/' + parname;
                                parameters[parname] = value;
                            }
                        } else {
                            // param
                            if (inheritable) parname = '/' + parname;
                            parameters[parname] = true;
                            pos = par_name_after;
                        }
                    }
            }
        }
        
        if (style) {
            var classes = params.length,
                colonpos = params.indexOf(':', pos);
            if (colonpos >= 0) {
                while(' \n\t`'.indexOf(params.charAt(colonpos)) < 0 && colonpos > pos)
                    colonpos--;
                classes = colonpos;
            }
            attributes.class = params.slice(pos, classes);
            attributes.style = params.slice(classes).trim();
        }
    
        // TODO {href} syntax

        return __type;
    }
    
    /**
     *  Resolve __type and parameters to control constructor
     *  
     * @param {string} __type Base type, example "controls.custom"
     * @param {object} parameters Parameters parsed from original type
     * @returns {object} Control constructor
     */
    function resolve_ctr(__type, parameters) {
        // after parse and before ctr resolve apply alias
        
        var constructor;
        __type = __type.toLowerCase();
        
        // map __type -> subtypes array
        if (Object.keys(parameters).length) {
            var subtypes_array = controls.subtypes[__type]; 
            if (subtypes_array)
            for(var i = 0, c = subtypes_array.length; i < c; i++) { // iterate subtypes array
                // each subtypes array item is key parameters object and contains the constructor reference
                var key_parameters = subtypes_array[i];

                // check for matching all key params values
                var hit = true;
                
                for(var prop in parameters)
                if (parameters.hasOwnProperty(prop)) {
                    var par_value = parameters[prop];
                    if (prop[0] === '/')
                        prop = prop.slice(1);
                    if ('__ctr,??'.indexOf(prop) < 0
                    && key_parameters[prop] !== par_value) {
                        hit = false;
                        break;
                    }
                }
            
                if (hit) {
                    constructor = key_parameters.__ctr;
                    break;
                }
            }
        }
        
        if (!constructor) {
            constructor = controls[__type];
            
            // apply if alias
            if (constructor && constructor.isAlias && constructor.__type !== __type) {
                // apply alias parameters
                var alias_parameters = constructor.parameters;
                for(var prop in alias_parameters)
                if (alias_parameters.hasOwnProperty(prop)) 
                    parameters[prop] = alias_parameters[prop];
                
                constructor = resolve_ctr(constructor.__type, parameters);
            }
        }
        
        return constructor;
    }
    controls.resolveType = resolve_ctr;
    
    // Unresolved type error processing mode
    // 0 - throw TypeError, 1 - create Stub
    //
    var type_error_mode = 0;
    controls.createOrStub = function(type, /*optional*/ parameters, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {
        type_error_mode = 1;
        try {
            return controls.create.apply(this, arguments);
        } catch (e) {}
        finally {
            type_error_mode = 0;
        }
    };
    
    /**
     * Create control from parsed type, parameters and attributes
     * 
     * @param {string} type Base type [and parameters].
     * @param {object} parameters Parsed parameters.
     * @param {object} attributes Parsed attributes.
     * @returns {object} Returns newly created component object.
     */
    controls.createBase = function(type, parameters, attributes) {
        parameters = parameters || {};
        attributes = attributes || {};
        
        var __type = parse_type(type, parameters, attributes),
            constructor = resolve_ctr(__type, parameters);
            
        if (!constructor)
            throw new TypeError('Type ' + __type + ' not registered!');

        for(var prop in parameters)
        if (parameters.hasOwnProperty(prop) && prop[0] === '$')
            attributes[prop.substr(1)] = parameters[prop];
                
        // create object
        
        var new_control = (constructor.is_constructor) // constructor or factory method ?
            ? new constructor(parameters, attributes)
            : constructor(parameters, attributes);
        
        // reflect after creation if control only
        if (typeof new_control === 'object' && '__type' in new_control)
            new_control.raise('type');
        
        return new_control;
    };
    
    /**
     * Create control
     * 
     * @param {string} type Type containing the parameters attributes and styles.
     * @param $prime [prime] Prime value is a responsibility of the component. This parameter value can be of simple type or be derived from DataObject DataArray.
     * @param {object} [attributes] Attributes hash object to be passed to the component.
     * @param {function} [callback] The callback will be called each time after the creation of a new component.
     * @param {object} [this_arg] The value to be passed as the this parameter to the target function when the callback function is called. 
     * @returns {object} Returns newly created component object.
     */
    controls.create = function(type, /*optional*/ $prime, /*optional*/ attributes, /*optional*/ callback, /*optional*/ this_arg) {

        // normalize arguments
        if (typeof $prime === 'function') {
            this_arg = attributes;
            callback = $prime;
            $prime = undefined;
            attributes = undefined;
        } else {
            if (typeof $prime === 'object' && !Array.isArray($prime)) {
                this_arg = callback;
                callback = attributes;
                attributes = $prime;
                $prime = undefined;
            }
            if (typeof attributes === 'function') {
                this_arg = callback;
                callback = attributes;
                attributes = undefined;
            }
        }
            
        var parameters = {};
        attributes = attributes || {};
        
        var __type, constructor;
            
        if (typeof type === 'function') {
            // template function
            __type = 'controls.custom';
            constructor = Custom;
            attributes.$template = type;
        } else if (type.charAt(0) === '<') {
            // html template
            __type = 'controls.custom';
            constructor = Custom;
            attributes.$template = controls.template(type);
        } else {
            __type = parse_type(type, parameters, attributes);
            constructor = resolve_ctr(__type, parameters);
        }
        
        if ($prime !== undefined)
            attributes.$prime = $prime;
            
        if (!constructor) {
            if (!type_error_mode)
                throw new TypeError('Type ' + __type + ' not registered!');
            else {
                // route to Stub
                parameters['#{type}'] = type; // pass original type
                parameters['#{__type}'] = __type;
                parameters['#{callback}'] = callback;
                parameters['#{this_arg}'] = this_arg;
                constructor = resolve_ctr('controls.stub', parameters);
            }
        }    

        for(var prop in parameters)
        if (parameters.hasOwnProperty(prop) && prop[0] === '$')
            attributes[prop.substr(1)] = parameters[prop];
                
        // create object
        
        var new_control = (constructor.is_constructor) // constructor or factory method ?
            ? new constructor(parameters, attributes)
            : constructor(parameters, attributes);
        
        // reflect after creation if control only
        if (typeof new_control === 'object' && '__type' in new_control)
            new_control.raise('type');
        
        return new_control;
    };

    // controls.reviverJSON()
    // 
    // use with JSON.parse(json, controls.reviverJSON), this function restores controls
    //
    controls.reviverJSON = function reviverJSON(key, value) {
        if (typeof(value) === 'object' && value !== null && value.hasOwnProperty('__type')) {
            var parameters = {},
                __type = parse_type(value.__type, parameters),
                constructor = resolve_ctr(__type, parameters);
            
            if (!constructor) {
                //throw new TypeError('controls.reviverJSON(): ' + __type + ' constructor not registered!');
                console.log('controls.reviverJSON(): ' + __type + ' constructor not registered!');
                // route to Stub
                parameters['#{type}'] = value.__type; // pass original type
                parameters['#{__type}'] = __type;
//                parameters['#{callback}'] = callback;
//                parameters['#{this_arg}'] = this_arg;
                constructor = resolve_ctr('controls.stub', parameters);
            }
            
            var new_control;
            
            var revive_func = constructor.revive;
            if (revive_func)
                new_control = revive_func(constructor, parameters, value);
            else
                new_control = controls.reviveControl(constructor, parameters, value);
            
            // reflect after creation
            new_control.raise('type');

            return new_control;
        }
        return value;
    };
    
    // revive json object recursively
    controls.revive = function revive(json_object) {
        if (json_object) {
            for (var prop in json_object)
            if (json_object.hasOwnProperty(prop))
            { 
                var item = json_object[prop];
                if (Array.isArray(item) || (typeof(item) === 'object' && item.hasOwnProperty('__type')))
                    json_object[prop] = revive(item);
            }
            
            if (typeof(json_object) === 'object' && json_object.hasOwnProperty('__type'))
                json_object = reviverJSON(null, json_object);
        }
        return json_object;
    };
    
    // Default control revive function
    controls.reviveControl = function(constructor, parameters, data) {
        if (data) {
            var control = constructor.is_constructor ? new constructor(parameters, data.attributes) : constructor(parameters, data.attributes);
            if (data.controls)
                control.controls = data.controls;
            
            var outer_template = data.outer_template;
            if (outer_template) {
                // '@' - separator func argument names vs body
                var atpos = outer_template.indexOf('@');
                control.template(new Function(outer_template.substr(0, atpos), outer_template.substr(atpos + 1)));
            }
            
            var inner_template = data.inner_template;
            if (inner_template) {
                var atpos = inner_template.indexOf('@');
                control.template(null, new Function(inner_template.substr(0, atpos), inner_template.substr(atpos + 1)));
            }
            
            // Deserialize events
            var data_events = data.events; // json object collection of serialized controls.Event
            if (data_events) {
                var events = control.events = {};
                for(var i = 0, c = data_events.length; i < c; i++) {
                    var item = data_events[i],
                        listeners = item.listeners;
                    for(var i = 0, c = listeners.length; i < c; i+=2) {
                        var listener = listeners[i];
                        if (typeof listener === 'string') {
                            var atpos = listener.indexOf('@');
                            listeners[i] = new Function(listener.substr(0, atpos), listener.substr(atpos + 1));
                        }
                    }
                    events[item.capture ? ('#' + item.type) : item.type] = new controls.Event(control, item.type, item.capture, listeners);
                }
            }
            return control;
        }
    };
    
    controls.decodeHTML = function(text) {
        return text ? text.replace(DECODE_HTML_MATCH, function(match) { return String.fromCharCode(parseInt(match.slice(2))); }) : text;
    };
    
    controls.encodeHTML = function(text) {
        return text ? text.replace(ENCODE_HTML_MATCH, function(match) { return ENCODE_HTML_PAIRS[match] || match; }) : text;
    };
    
    controls.extend = function(object) {
        for(var i = 1, c = arguments.length; i < c; i++) {
            var src = arguments[i];
            if (typeof src === 'object')
            for(var prop in src)
            if (src.hasOwnProperty(prop))
                object[prop] = src[prop];
        }
        return object;
    };
    
    controls.delay = function(func, delay) {
        return setTimeout(function() { return func.apply(null, Array.prototype.slice.call(arguments, 2)); }, delay);
    };
    
    
    // Elementals //////////////////////////////////////////////////////////////
    
    
    (function(){
        function gencode(tagname, closetag) {
            return '\nfunction c' + tagname + '(p, a) { controls.controlInitialize(this, \'controls.' + tagname + '\', p, a, c' + tagname + '.outer_template); }\n\
c' + tagname + '.prototype = controls.control_prototype;\n'
+ (closetag
    ? 'c' + tagname + '.outer_template = function(it) { return \'<' + tagname + '\' + it.printAttributes() + \'>\' + (it.attributes.$text || \'\') + it.printControls() + \'</' + tagname + '>\'; };\n'
    : 'c' + tagname + '.outer_template = function(it) { return \'<' + tagname + '\' + it.printAttributes() + \'>\'; };\n')
+ 'controls.typeRegister(\'' + tagname + '\', c' + tagname + ');\n';
        }
        
        Function('controls', 'a,abbr,address,article,aside,b,base,bdi,bdo,blockquote,button,canvas,cite,code,col,colgroup,command,datalist,dd,del,details,\
dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,g,gnome,h1,h2,h3,h4,h5,h6,header,i,iframe,img,ins,kbd,keygen,label,legend,li,link,map,mark,menu,meter,nav,\
noscript,object,ol,optgroup,option,output,p,pre,progress,ruby,rt,rp,s,samp,script,section,small,span,strong,style,sub,summary,sup,svg,\
table,tbody,td,textarea,tfoot,th,thead,time,title,tr,u,ul,var,video,wbr'
            .split(',').map(function(tagname) { return gencode(tagname.toLowerCase(), true); }).join(''))(controls);
    
        Function('controls', 'area,br,hr,meta,param,source,track'
            .split(',').map(function(tagname) { return gencode(tagname.toLowerCase(), false); }).join(''))(controls);
    })();
    
    
    // Special /////////////////////////////////////////////////////////////////

            
    // Container
    // 
    // without own html
    // 
    function Container(parameters, attributes) {
        controls.controlInitialize(this, 'controls.container', parameters, attributes, controls.default_inner_template);
    };
    Container.prototype = controls.control_prototype;
    controls.typeRegister('container', Container);
    
    // Custom
    // 
    // set template after creating the control
    // 
    function Custom(parameters, attributes) {
        controls.controlInitialize(this, 'controls.custom', parameters, attributes);
    };
    Custom.prototype = controls.control_prototype;
    controls.typeRegister('custom', Custom);

    // Stub
    // 
    // Stub control created on type error if type_error_mode
    // 
    function Stub(parameters, attributes) {
        this.isStub = true;
        
//        var original_type = parameters['#{type}'];
//        var original__type = parameters['#{__type}'];
//        var callback = parameters['#{callback}'];
//        var this_arg = parameters['#{this_arg}'];
//        var hrefs = parameters['#{href}'];
//        if (hrefs)
//            hrefs = hrefs.split(/,| |;/g);
        
//        var save_attributes = {};
//        for(var prop in attributes)
//        if (attributes.hasOwnProperty(prop))
//            save_attributes[prop] = attributes[prop];
        
        controls.controlInitialize(this, 'controls.stub', parameters, attributes, function(it) { return '<div' + it.printAttributes() + '>' + it.printControls() + '</div>'; } );
        this.class('stub');
        
        var state = 0; // 0 - stub, > 0 - resources loaded, < 0 - load error
        Object.defineProperty(this, "state", {
            enumerable: true, 
            get: function() { return state; },
            set: function(value) {
                if (value !== state) {
                    state = value;
                    if (value === 0)    this.class(null, 'stub-loading stub-error');
                    else if (value < 0) this.class('stub-error', 'stub-loading');
                    else                this.class('stub-loading', 'stub-error');
                    
                    this.raise('state');
                    
                    if (this.state > 0)
                        this.tryReplace();
                }
            }
        });
        
        // try create control and replace stub on success
        this.tryReplace = function() {
            var parameters = this.parameters,
                params = {},
                attrs = {},
                attributes = this.attributes;
        
            for(var prop in parameters)
            if (parameters.hasOwnProperty(prop) && prop[0] !== '#' && prop[1] !== '{')
                params[prop] = parameters[prop];
            
            for(var prop in attributes)
            if (attributes.hasOwnProperty(prop))
                attrs[prop] = attributes[prop];
        
            var control = controls.createBase(parameters['#{type}'], params, attrs);
            if (control) {
                control.class(null, 'stub stub-loading stub-error');
                this.replaceItself(control);
                // raise event
                this.raise('control', control);
            }
        };
    };
    Stub.prototype = controls.control_prototype;
    controls.typeRegister('stub', Stub);
    
    // Head
    function Head(parameters, attributes) {
        controls.controlInitialize(this, 'controls.head', parameters, attributes, Head.outer_template);
        this.attach    = function() { this.element = document.head; return this; };
        this.attachAll = function() { this.element = document.head; return Head.prototype.attachAll.call(this); return this; };
    };
    Head.prototype = controls.control_prototype;
    Head.outer_template = function(it) { return '<head>' + (it.attributes.$text || '') + it.printControls() + '</head>'; };
    controls.typeRegister('head', Head);
    
    // Body
    function Body(parameters, attributes) {
        controls.controlInitialize(this, 'controls.body', parameters, attributes, Body.outer_template);
        this.attach    = function() { this.element = document.body; return this; };
        this.attachAll = function() { this.element = document.body; return Body.prototype.attachAll.call(this); return this; };
    };
    Body.prototype = controls.control_prototype;
    Body.outer_template = function(it) { return '<body' + it.printAttributes('-id') + '>' + (it.attributes.$text || '') + it.printControls() + '</body>'; };
    controls.typeRegister('body', Body);
    

    // Layouts /////////////////////////////////////////////////////////////////


    // Layout
    // Parameters:
    // float=left, float=right
    // 
    // var layout = controls.create('controls.Layout#float=left');
    // layout.cellSet.class(...);
    // 
    function Layout(parameters, attributes) {
        this.initialize('controls.layout', parameters, attributes, Layout.outer_template);
        var clearfix = false; // use clearfix if float
        
        this.cellSet = new Container();
        this.cellSet.listen_('attributes', this, function(event) {
            var attr_name = event.name,
                attr_value = event.value,
                remove = (attr_value === undefined || attr_value === null);
            
            var element = this._element;
            if (element) {
                var nodes = element.childNodes; // element.querySelectorAll('[data-type=layout-item]');
                for(var i = nodes.length - 1; i>=0; i--) {
                    var node = nodes[i];
                    if (remove)
                        node.removeAttribute(attr_name);
                    else
                        node.setAttribute(attr_name, attr_value);
                }
            }
        });
        
        this.listen_('type', function() {
            var parameters = this.parameters,
                floatvalue;
            
            for(var prop in parameters)
            if (parameters.hasOwnProperty(prop) && prop === 'float' || prop === '/float')
                floatvalue = parameters[prop];
            
            if (floatvalue)
                this.cellSet.style('float:' + floatvalue);
            
            clearfix = floatvalue;
        });
    };
    Layout.prototype = controls.control_prototype;
    Layout.outer_template = function(it) {
        var out = '<div' + it.printAttributes() + '>',
            ctrls = it.controls, cell = '<div data-type="layout-item"' + it.cellSet.printAttributes("-id") + '>';
        for(var i = 0, c = ctrls.length; i < c; i++)
            out += cell + ctrls[i].wrappedHTML() + '</div>';
        return out + (it.clearfix) ? '<div style="clear:both;"></div></div>' : '</div>';
    };
    controls.typeRegister('layout', Layout);

    
    function List(parameters, attributes) {
        this.initialize('controls.list', parameters, attributes, List.outer_template);
        
        this.itemSet = new Container();
        this.itemSet.listen_('attributes', this, function(event) {
            var attr_name = event.name;
            var attr_value = event.value;
            var remove = (attr_value === undefined || attr_value === null);
            
            var element = this._element;
            if (element) {
                var nodes = element.childNodes; // element.querySelectorAll('[data-type=layout-item]');
                for(var i = nodes.length - 1; i>=0; i--) {
                    var node = nodes[i];
                    if (remove)
                        node.removeAttribute(attr_name);
                    else
                        node.setAttribute(attr_name, attr_value);
                }
            }
        });
    };
    List.prototype = controls.control_prototype;
    List.outer_template = function(it) {
        var out ='<ul' + it.printAttributes() + '>',
            ctrls = it.controls, item = '<li' + it.itemSet.printAttributes("-id") + '>';
        for(var i = 0, c = ctrls.length; i < c; i++)
            out += item + ctrls[i].wrappedHTML() + '</li>';
        return out + '</ul>';
    };
    controls.typeRegister('list', List);
    
    
    // Input
    // 
    function Input(parameters, attributes) {
        this.initialize('controls.input', parameters, attributes, Input.outer_template)
        .listen_('change', function() {
            this.attributes.value = this.element.value;
        }, true)
        .listen_('element', function(element) {
            if (element)
                element.value = this.attributes.value || '';
        });
        Object.defineProperty(this, 'value', {
            get: function() { return this.attributes.value; },
            set: function(value) {
                var element = this._element;
                this.attributes.value = value;
                if (element)
                    element.value = value;
            }
        });
    };
    Input.prototype = controls.control_prototype;
    Input.outer_template = function(it) { return '<input' + it.printAttributes() + '>' + (it.attributes.$text || '') + '</input>'; };
    controls.typeRegister('input', Input);
    
    
    // Select
    // 
    // Attributes:
    //  $data {DataArray}
    //
    function Select(parameters, attributes) {
        this.initialize('controls.select', parameters, attributes, Select.outer_template, Select.inner_template)
        .bind(attributes.hasOwnProperty('$data')
            ? controls.create('DataArray', {$data: attributes.$data})
            : controls.create('DataArray'))
        .listen_('data', this.refreshInner) // event routed from data object
        .listen_('change', function() {
            this.attributes.value = this.element.value;
        }, true)
        .listen_('element', function(element) {
            if (element)
                element.value = this.attributes.value;
        });
        
        Object.defineProperty(this, 'value', {
            get: function() { return this.attributes.value; },
            set: function(value) {
                var element = this._element;
                this.attributes.value = value;
                if (element)
                    element.value = value;
            }
        });
    };
    Select.prototype = controls.control_prototype;
    Select.outer_template = function(it) { return '<select' + it.printAttributes() + '>' + (it.attributes.$text || '') + it.data.map(function(item){ return '<option value=' + item + '>' + item + '</option>'; }).join('') + '</select>'; };
    Select.inner_template = function(it) { return (it.attributes.$text || '') + it.data.map(function(item){ return '<option value=' + item + '>' + item + '</option>'; }).join(''); };
    controls.typeRegister('select', Select);
    
    
    
    // exports
    if (typeof module !== 'undefined' && module.exports) module.exports = controls;
    if (typeof define === 'function' && define.amd) define(controls);
    if (typeof window !== 'undefined' && (!window.controls || window.controls.VERSION < controls.VERSION))
        window.controls = controls;
})();






//     controls.bootstrap.js
//     purpose: twitter bootstrap VCL for using with controls.js
//     http://aplib.github.io/controls.js/bootstrap.controls-demo.html
//     (c) 2013 vadim b.
//     License: MIT
//
// require controls.js


(function() { "use strict";

function Bootstrap(controls) {
    var bootstrap = this;
    bootstrap.VERSION = '0.7.04'/*#.#.##*/;
    if (!controls)
        throw new TypeError('controls.bootstrap.js: controls.js not found!');
    if (controls.bootstrap && controls.bootstrap.VERSION >= bootstrap.VERSION)
        return controls.bootstrap;
    controls.bootstrap = this;
    
    var control_prototype = (function() {
        function bootstrap_proto() { }
        bootstrap_proto.prototype = controls.control_prototype;
        return new bootstrap_proto();
    })();
    bootstrap.control_prototype = control_prototype;
    
    // icon()
    control_prototype.icon = function(icon_class) {
        if (arguments.length === 0)
            return this.attributes.$icon;
            
        this.attributes.$icon = icon_class;
        
        if (this._element)
            this.refresh();
        
        return icon_class;
    };
    
    control_prototype._icon = function(icon_class) {
        this.icon(icon_class);
        return this;
    };
    
    control_prototype.getControlStyle = function() {
        var parameters = this.parameters;
        return parameters.style || parameters['/style'] || (parameters.info && 'info') || (parameters.link && 'link') || (parameters.success && 'success')
            || (parameters.primary && 'primary') || (parameters.warning && 'warning') || (parameters.danger && 'danger') || 'default';
    };
    
    var CONTROL_SIZE = {
        'xtra-small':'xtra-small', 'xs':'xtra-small', 'btn-xs':'xtra-small', '-2':'xtra-small',
        'small':'small', 'sm':'small', 'btn-sm':'small', '-1':'small',
        'default':'', '':'', '0':'',
        'large':'large', 'lg':'large', 'btn-lg':'large', '1':'large',
        'xtra-large':'xtra-large', 'xl':'xtra-large', '2':'xtra-large'
    };
    control_prototype.getControlSize = function() {
        var parameters = this.parameters,
            csize = CONTROL_SIZE[parameters.size || parameters['/size']];
        
        if (!csize)
        for(var prop in parameters)
        if (!csize)
            csize = CONTROL_SIZE[prop];
        
        return csize || '';
    };
    
    
    // Label
    // 
    function Label(parameters, attributes) {
        this.initialize('bootstrap.Label', parameters, attributes, Label.template)
            .listen_('type', function() {
                this.class('label label-' + this.getControlStyle(), 'label-default label-link label-primary label-success label-info label-warning label-danger');
            });
    };
    Label.prototype = control_prototype;
    Label.template = function(it) { return '<span' + it.printAttributes() + '>' + (it.attributes.$text || '') + '</span>'; };
    controls.typeRegister('bootstrap.Label', Label);
    
    
    // Panel
    // 
    function Panel(parameters, attributes) {
        this.initialize('bootstrap.Panel', parameters, attributes)
            .add('body:div`panel-body', attributes.$text);
        attributes.$text = undefined;
    
        if (parameters.header) {
            if (typeof parameters.header === 'string')
                this.insert(0, 'header:div`panel-heading panel-title', parameters.header);
            else
                this.insert(0, 'header:div`panel-heading panel-title');
        }
        
        if (parameters.footer) {
            if (typeof parameters.footer === 'string')
                this.add('footer:div`panel-footer', parameters.footer);
            else
                this.add('footer:div`panel-footer');
        }
    
        this.listen_('type', function() {
            this.class('panel panel-' + this.getControlStyle(), 'panel-default panel-link panel-primary panel-success panel-info panel-warning panel-danger');
        });

        this.text = function(_text) {
            return this.body.text(_text);
        };
    };
    Panel.prototype = control_prototype;
    controls.typeRegister('bootstrap.Panel', Panel);
    
    
    // Dropdowns
    
    // DropdownItem
    // 
    // Attributes:
    // href, $icon, $text
    // 
    //
    function DropdownItem(parameters, attributes /*href $icon $text*/) {
        this.initialize('bootstrap.DropdownItem', parameters, attributes, DropdownItem.template);
    };
    DropdownItem.prototype = control_prototype;
    DropdownItem.template = function(it) {
        var out = '<li id="' + it.id + '"><a' + it.printAttributes('-id') + '>',
            attrs = it.attributes;
        if (attrs.$icon) out += '<span class="glyphicon glyphicon-' + attrs.$icon + '"></span>&nbsp;';
        return out + (it.attributes.$text || '') + '</a></li>';
    };
    controls.typeRegister('bootstrap.DropdownItem', DropdownItem);
    
    
    // DividerItem
    // 
    //
    function DividerItem(parameters, attributes) {
        this.initialize('bootstrap.DividerItem', parameters, attributes, DividerItem.template)
            .class('divider');
    };
    DividerItem.prototype = control_prototype;
    DividerItem.template = function(it) { return '<li' + it.printAttributes() + '></li>'; };
    controls.typeRegister('bootstrap.DividerItem', DividerItem);
    
    
    // DropdownLink
    // 
    // 
    function DropdownLink(parameters, attributes) {
        this.initialize('bootstrap.DropdownLink', parameters, attributes, DropdownLink.template)
            .class('dropdown');
    };
    DropdownLink.prototype = control_prototype;
    DropdownLink.template = function(it) {
        var out = '<div' + it.printAttributes() + '><a class="dropdown-toggle" data-toggle="dropdown" href="#">',
            attrs = it.attributes, ctrls = it.controls;
        if (attrs.$icon) out += '<span class="glyphicon glyphicon-' + attrs.$icon + '"></span>&nbsp;';
        out += (it.attributes.$text || '') + '</a>';
        if (ctrls.length) {
            out += '<ul class="dropdown-menu">';
            for (var i = 0, c = ctrls.length; i < c; i++)
                out += ctrls[i].wrappedHTML();
            out += '</ul>';
        }
        return out + '</div>';
    };
    controls.typeRegister('bootstrap.DropdownLink', DropdownLink);


    //
    function ToggleBtn(parameters, attributes) {
        this.initialize('bootstrap.ToggleBtn', parameters, attributes, ToggleBtn.template)
            .class('btn dropdown-toggle');
    };
    ToggleBtn.prototype = control_prototype;
    ToggleBtn.template = function(it) {
        var out = '<a' + it.printAttributes() + ' data-toggle="dropdown" href="#">',
            attrs = it.attributes, ctrls = it.controls;
        if (attrs.$icon) out += '<span class="glyphicon glyphicon-' + attrs.$icon + '"></span>&nbsp;';
        if (attrs.caret || attrs.Caret) out += '<span class="caret"></span>';
        out += (it.attributes.$text || '') + '</a>';
        if (ctrls.length) {
            out += '<ul class="dropdown-menu">';
            for (var i = 0, c = ctrls.length; i < c; i++)
                out += ctrls[i].wrappedHTML();
            out += '</ul>';
        }
        return out;
    };
    controls.typeRegister('bootstrap.ToggleBtn', ToggleBtn);
    
    
    // bootstrap@Button
    // 
    // Parameters:
    //  style {'default','primary','success','info','warning','danger','link'} - one of the predefined style of button from bootstrap
    //  size {0..3, 'xtra-small', 'small', 'default', 'large'}
    // Attributes:
    //  $text {string} - text
    //  $icon {string) - the name of one of the available bootstrap glyphicon, glass music search etc. See http://glyphicons.getbootstrap.com
    // Example:
    //  controls.create('bootstrap.Button/style=success', {$icon: "glass"});
    //
    var BUTTON_SIZES = { 'xtra-small':'btn-xs', small:'btn-sm', large:'btn-lg' };
    function buttonTypeHandler() {
        this.class('btn btn-' + ((this.getControlStyle() || '') + ' ' + (BUTTON_SIZES[this.getControlSize()] || '')).trim(),
            this.attributes.class ? 'btn-default btn-primary btn-success btn-info btn-warning btn-danger btn-link btn-xs btn-sm btn-lg' : null);
    }
    function Button(parameters, attributes) {
        this.initialize('bootstrap.Button', parameters, attributes, Button.template)
            .listen_('type', buttonTypeHandler);
    };
    Button.prototype = control_prototype;
    Button.template = function(it) {
        var attrs = it.attributes;
        return '<button type="button"' + it.printAttributes() + '>'
            + (attrs.$icon ? ('<span class="glyphicon glyphicon-' + attrs.$icon + '"></span>') : '')
            + ((attrs.$icon && attrs.$text) ? '&nbsp;' : '')
            + (attrs.$text || '')
            + '</button>';
    };
    controls.typeRegister('bootstrap.Button', Button);
    
    
    // Splitbutton
    //
    function Splitbutton(parameters, attributes) {
        this.initialize('bootstrap.SplitButton', parameters, attributes, Splitbutton.template)
            ._class('btn-group')
            ._add('button:bootstrap.Button', {$icon:attributes.$icon})
            ._add('toggle:bootstrap.Button', {class:'dropdown-toggle', 'data-toggle':'dropdown', $text:'<span class="caret"></span>'})
            ._add('items:ul', {class:'dropdown-menu'})
            .listen_('type', function() {
                var btn_class = 'btn btn-' + ((this.getControlStyle() || '') + ' ' + (BUTTON_SIZES[this.getControlStyle()] || '')).trim();
                this.button.class(btn_class);
                this.toggle.class(btn_class);
            });
    };
    Splitbutton.prototype = control_prototype;
    controls.typeRegister('bootstrap.SplitButton', Splitbutton);
    
    
    // BtnGroup
    // 
    //
    function BtnGroup(parameters, attributes) {
        this.initialize('bootstrap.BtnGroup', parameters, attributes, BtnGroup.template)
            .class('btn-group');
    };
    BtnGroup.prototype = control_prototype;
    controls.typeRegister('bootstrap.BtnGroup', BtnGroup);
    
    
    // TabPanelHeader
    // 
    function TabPanelHeader(parameters, attributes) {
        this.initialize('bootstrap.TabPanelHeader', parameters, attributes, TabPanelHeader.template)
            .class('nav nav-tabs tabpanel-header');
    };
    TabPanelHeader.prototype = control_prototype;
    TabPanelHeader.template = function(it) { return '<ul' + it.printAttributes() + '>' + (it.attributes.$text || '') + it.printControls() + '</ul>'; };
    controls.typeRegister('bootstrap.TabPanelHeader', TabPanelHeader);
    
    
    // TabHeader
    // 
    function TabHeader(parameters, attributes) {
        this.initialize('bootstrap.TabHeader', parameters, attributes, TabHeader.template)
            .class('tab-header');
    };
    TabHeader.prototype = control_prototype;
    TabHeader.template = function(it) {
        var attrs = it.attributes;
        return '<li' + it.printAttributes() + '><a href="' + (attrs.$href || '') + '" data-toggle="tab">'
            + (attrs.$icon ? ('<span class="glyphicon glyphicon-' + attrs.$icon + '"></span>' + ((attrs.$text) ? '&nbsp;' : '')) : '')
            + (attrs.$text || '')
            + '</a></li>';
    };
    controls.typeRegister('bootstrap.TabHeader', TabHeader);
    
    
    // TabPanelBody
    // 
    function TabPanelBody(parameters, attributes) {
        this.initialize('bootstrap.TabPanelBody', parameters, attributes)
            .class('tab-content tabpanel-body');
    };
    TabPanelBody.prototype = control_prototype;
    controls.typeRegister('bootstrap.TabPanelBody', TabPanelBody);
    
    
    // TabPage
    // 
    function TabPage(parameters, attributes) {
        this.initialize('bootstrap.TabPage', parameters, attributes)
            .class('tab-pane fade');
    };
    TabPage.prototype = control_prototype;
    controls.typeRegister('bootstrap.TabPage', TabPage);
    
    
    // Form
    // 
    function Form(parameters, attributes) {
        this.initialize('bootstrap.Form', parameters, attributes, Form.template)
            .attr('role', 'form');
    };
    Form.prototype = control_prototype;
    Form.template = function(it) { return '<form' + it.printAttributes() + '>' + it.printControls() + '</form>'; };
    controls.typeRegister('bootstrap.Form', Form);
    
    
    // FormGroup
    // 
    function FormGroup(parameters, attributes) {
        this.initialize('bootstrap.FormGroup', parameters, attributes)
            .class('form-group');
    };
    FormGroup.prototype = control_prototype;
    controls.typeRegister('bootstrap.FormGroup', FormGroup);
    
    
    // Modal
    // 
    function Modal(parameters, attributes) {
        this.initialize('bootstrap.Modal', parameters, attributes, Modal.template)
            ._class('modal fade')
            ._attr('role', 'dialog')
            ._add('header:div', {class:'modal-header'})
            ._add('body:div', {class:'modal-body'})
            ._add('footer:div', {class:'modal-footer'});
        if (!attributes.hasOwnProperty('tabindex'))    attributes.tabindex = -1;
        if (!attributes.hasOwnProperty('aria-hidden')) attributes['aria-hidden'] = true;
    };
    Modal.prototype = control_prototype;
    Modal.template = function(it) {
        return '<div' + it.printAttributes() + '><div class="modal-dialog"><div class="modal-content">' + it.printControls() + '</div></div></div>';
    };
    controls.typeRegister('bootstrap.Modal', Modal);
    
    
    // ControlLabel
    // 
    function ControlLabel(parameters, attributes) {
        this.initialize('bootstrap.ControlLabel', parameters, attributes, ControlLabel.template)
            .class('control-label');
    };
    ControlLabel.prototype = control_prototype;
    ControlLabel.template = function(it) { return '<label' + it.printAttributes() + '>' + (it.attributes.$text || '') + '</label>'; };
    controls.typeRegister('bootstrap.ControlLabel', ControlLabel);
    
    
    // ControlCheckbox
    // 
    function ControlCheckbox(parameters, attributes) {
        this.initialize('bootstrap.ControlCheckbox', parameters, attributes, ControlCheckbox.template)
            ._class('checkbox')
            .add('input:input', attributes.$text, {type:'checkbox', checked:attributes.$checked})
                .listen_('change', function() {
                    this.attributes.checked = this.element.checked;
                }, true)
                .listen_('element', function(element) {
                    if (element)
                        element.checked = this.attributes.checked || '';
                });
        Object.defineProperty(this, 'checked', {
            get: function() { return this.input.attributes.checked; },
            set: function(value) {
                value = !!value;
                var element = this.input._element;
                this.input.attributes.checked = value;
                if (element)
                    element.checked = value;
            }
        });
        attributes.$checked = undefined;
        attributes.$text = undefined;
    };
    ControlCheckbox.prototype = control_prototype;
    ControlCheckbox.template = function(it) { return '<div' + it.printAttributes() + '><label>' + it.printControls() + '</label></div>'; };
    controls.typeRegister('bootstrap.ControlCheckbox', ControlCheckbox);
    
    
    // ControlInput
    // 
    function ControlInput(parameters, attributes) {
        var control = new controls['controls.input'](parameters, attributes)
            ._class('form-control');
        control.__type = 'bootstrap.ControlInput';
        return control;
    };
    controls.factoryRegister('bootstrap.ControlInput', ControlInput);
    
    
    // ControlSelect
    // 
    // Attributes:
    //  $data {DataArray}
    //
    function ControlSelect(parameters, attributes) {
        var control = new controls['controls.select'](parameters, attributes)
            ._class('form-control')
            ._style('display:inline-block;');
        control.__type = 'bootstrap.ControlSelect';
        return control;
    };
    controls.factoryRegister('bootstrap.ControlSelect', ControlSelect);
};


    // exports
    if (typeof module !== 'undefined' && module.exports) module.exports = new Bootstrap(require('controls'));
    if (typeof define === 'function' && define.amd) define(['controls'], function(c) { return new Bootstrap(c); });
    if (typeof window !== 'undefined') new Bootstrap(window.controls);
})();






(function() { 'use strict';

    // initialize $ENV
    
    $ENV = {
        dot: doT,
        controls: controls,
        marked: marked,
        'bootstrap.controls': controls.bootstrap
    };
    
    $ENV.controls.template = $ENV.dot.template; // default template engine
    var extend = $ENV.controls.extend;

    // Set default options except highlight which has no default
    $ENV.marked.setOptions({
      gfm: true, tables: true,  breaks: false,  pedantic: false,  sanitize: false,  smartLists: true,  smartypants: false,  langPrefix: 'lang-'
    });

    // get default control template
    var templatesHash = {};
    $ENV.getDefaultTemplate = function(tag) {
        return templatesHash[tag || ''] || (templatesHash[tag || ''] = new Function('it',
'var attributes = it.attributes, controls = it.controls, result = attributes.$text || "";\n\
for(var i = 0, c = controls.length; i < c; i++)\n\
 result += controls[i].wrappedHTML();\n\
return ' + (tag ? ('"<' + tag + '" + it.printAttributes()+ ">" + $ENV.marked(result) + "</' + tag + '>";') : '$ENV.marked(result);')) );
    };
        
    // initialize $DOC
    
    var url_params = {};
    window.location.search.substring(1).split('&').forEach(function(seg){ if (seg) {
        var pos = seg.indexOf('=');
        if (pos < 0)
            url_params[seg] = true;
        else
            url_params[seg.slice(0,pos)] = decodeURIComponent(seg.slice(pos+1).replace(/\+/g, ' '));
    }});
    
    var scripts_count = 0, scripts_stated = 0;
    $DOC = {
        initialize: function() {
            
            this.urlParams = extend({}, url_params);

            // "DOC" script element source for: root, script options

            var root = '', js_root_node = document.getElementById('DOC');
            if (js_root_node) {
                var attrs = js_root_node.attributes;
                if (attrs.hasOwnProperty('root'))
                    root = js_root_node.getAttribute('root');
                else {
                    var src = js_root_node.getAttribute('src');
                    if (src) {
                        var segs = src.split('/');
                        root = segs.slice(0, segs.length - 1).join('/');
                        if (root)
                            root += '/';
                    }
                }
            }
            this.root = root;
            
            // executing script element source for: codebase
            
            var executing = document.currentScript;
            if (!executing) {
                var scripts = document.getElementsByTagName('script');
                for(var i = scripts.length - 1; i >= 0; i--) {
                    var script = scripts[i];
                    if (script.src.indexOf('document.') >= 0 && (!script.readyState || ' complete interactive'.indexOf(script.readyState) > 0))
                        executing = script;
                }
            }
            if (executing) {
                var src = executing.getAttribute('src');
                if (src) {
                    // components is always loaded from path of the executing script
                    var origin = src.split('/').slice(0, -1).join('/');
                    this.codebase = origin;
                    this.components = origin + (origin ? '/' : '') + 'components/';
                }
                $OPT.userjs = executing.getAttribute('userjs') || $OPT.userjs;
                $OPT.icon = executing.getAttribute('icon') || $OPT.icon;
                var editable = executing.getAttribute('editable') || $OPT.editable;
                $OPT.editable = (editable === 'false' || editable === '0') ? false : !!editable;
            }

            // edit mode
            if ($OPT.editable) {
                if (url_params.edit && window.self === window.top)
                    $OPT.edit_mode = 1; // editor
                if (url_params.preview) {
                    $OPT.edit_mode = 2; // preview mode
                    // idgen shift in preview mode
                    // Preview mode is used for compiled html. Prevent conflict between already stored in html and newly created identifiers.
                    controls.id_generator = 200000;
                }
            }
            // prevent options changes 
//            Object.freeze($OPT);
            
            // State
            this.state = 0; // 0 - started, 1 - transformation started, 2 - loaded, -1 - broken
            
            // Events
            this.events = {};
                    
            // Sections
            this.sections = {};
            
            // Sections view order
            this.order = ['fixed-top-bar', 'fixed-top-panel',
                'header-bar', 'header-panel',
                'left-side-bar', 'left-side-panel',
                'content-bar', 'content-panel',
                'right-side-panel', 'right-side-bar',
                'footer-panel', 'footer-bar',
                'fixed-bottom-panel', 'fixed-bottom-bar'];
            
            this.columns = ['left-side-bar', 'left-side-panel', 'content-bar', 'content-panel', 'right-side-panel', 'right-side-bar'];
            
            // Texts and templates
            this.vars = {};
            
            this.filters = [];
            
            this.mods = {};
            
            // clear controls tree
            if (this.chead)
                this.chead.detachAll();
            this.chead = controls.create('head');
            this.chead.attach();
            
            if (this.cbody)
                this.cbody.detachAll();
            this.cbody = controls.create('body');
        },
        
        forceEvent: function(name) {
            var events = this.events;
            return events[name] || (events[name] = new controls.Event());
        },
        // on DOMContentLoaded or simulated if DOMContentLoaded is already raised
        onready: function(handler) {
            if (this.state === 2 || document.readyState === undefined || ' interactive complete'.indexOf(document.readyState) > 0)
                handler();
            else
                this.forceEvent('ready').addListener(handler);
        },
        // Document transformation completed event
        onload: function(handler) { if (this.state === 2) handler(); else this.forceEvent('load').addListener(handler); },
        // Section control created event
        listen: function(type, handler, capture) { this.forceEvent(type).addListener(handler); },
        raise: function(type, capture) { var event = this.events[type]; if (event) event.raise(); },
                
        addSection: function(name, value) {
            var sections = this.sections, exists = sections[name];
            if (exists) {
                if (exists._element)
                    exists.deleteElement();
            }
            sections[name] = value;
        },
        removeSection: function(name) {
            var sections = this.sections, exists = sections[name];
            if (exists) {
                if (exists._element)
                    exists.deleteElement();
                sections[name] = undefined;
            }
        },
        // move section to placeholder location
        sectionPlaceholder: function(name, text_node) {
            var sections = this.sections,
                exists = sections[name];
            // move exists node
            if (exists) {
                if (exists.__type) {
                    var element = exists.element;
                    if (element)
                        document.insertBefore(element, text_node);
                } else if (exists.nodeType) {
                    document.insertBefore(exists, text_node);
                }
            }
            sections[name] = {placeholder:text_node, content:exists};
        },
        // move section to other location
        sectionMover: function(text_node, oldname, newname) {
            var sections = this.sections, exists = sections[oldname];
            if (typeof exists === 'string') {
                sections[newname] = exists;
                delete sections[oldname];
            } else if (exists) {
                if (exists.__type) {
                    exists.class(newname, oldname);
                    var element = exists.element;
                    if (element)
                        document.insertBefore(element, text_node);
                } else if (exists.nodeType) {
                    document.insertBefore(exists, text_node);
                }
            }
        },
        // parse sections values from text or from function text
        parseContent: function(content) {
            if (content) {
                var frags = content.toString().split(/(<!--\S+\s+)|(-->)/gm);
                for(var i = 0, c = frags.length; i < c; i+=1) {
                    var test = frags[i];
                    if (test && test.substr(0,4) === '<!--') {
                        // first '$' - var else section
                        if (test[4] === '$') {
                            // as var
                            var varname = test.substr(4).trim();
                            this.vars[varname] = frags[i+2];
                        } else {
                            // as section
                            var section = test.substr(4).trim();
                            this.addSection(section, frags[i+2]);
                        }
                        i += 2;
                    }
                }
            }
        },
        
        // append to head
        appendElement: function(id, tag, attributes) {
            try {
                if (arguments.length < 3) { attributes = tag; tag = id; id = undefined; }
                var head = document.head;
                if (id) {
                    var element = document.getElementById(id);
                    if (element && element.parentNode === head)
                        return;
                }
                head.insertAdjacentHTML('beforeend',
                    '<' + tag + (id ? (' id="'+id+'"') : '') + Object.keys(attributes).map(function(prop){return' '+prop+'="'+attributes[prop]+'"';}).join('') + '></' + tag + '>');
                return head.lastChild;
            } catch(e) { console.log(e); }
        },
        // remove from head
        removeElement: function(id) {
            var element = document.getElementById(id);
            if (element && element.parentNode === document.head)
                document.head.removeChild(element);
        },
        
        appendScript: function(id, src, callback) {
            if (arguments.length === 1 || typeof src === 'function') { callback = src; src = id; id = undefined; }
            if (id && document.getElementById(id)) {
                // script already loaded
                if (callback)
                    callback(+1);
                return;
            }
            var script = document.createElement('script');
            if (id)
                script.id = id;
            if (src.indexOf('(') >= 0) {
                // raw script
                script.innerHTML = src;
            } else {
                // load external script
                script.src = src;
                scripts_count++;
                script.src = src;
                script.async = true;
                script.addEventListener('load', function() {
                    if (callback)
                        callback(+1);
                    scripts_stated++;
                    $DOC.checkAllScriptsReady();
                });
                script.addEventListener('error', function() {
                    if (callback)
                        callback(-1);
                    scripts_stated++;
                    $DOC.checkAllScriptsReady();
                });
            }
            document.head.appendChild(script);
        },
        // {id1:url1, id2:url2 ...}
        appendScripts: function(hash, callback) {
            var started = 0, loaded = 0;
            for(var prop in hash) {
                started++;
                this.appendScript(prop, hash[prop], function(state) {
                    if (state > 0)
                        loaded++;
                    if (callback) {
                        if (loaded >= started)
                            callback(1);
                        else if (state < 0)
                            callback(-1);
                    }
                });
            }
        },
        // get the url relative to the root
        getRootUrl: function(url) {
            if (url[0] === '/') {
                if (url[1] !== '/')
                    url = this.root + url;
            } else if (url.indexOf(':') < 0 && url[0] !== '.')
                url = this.root + url;
            return url.replace('{{=$DOC.root}}', this.root);
        },
        // load user.js scripts
        loadUserJS: function() {
            var userjs = $OPT.userjs;
            if (userjs) {
                userjs = userjs.split(',');
                for(var i = 0, c = userjs.length; i < c; i++)
                    this.appendScript('user.js/' + i, this.getRootUrl(userjs[i]));
            }
        },
        // document transformation start after all scripts loaded or failed
        checkAllScriptsReady: function() {
            /*this undefined*/
            if (scripts_count === scripts_stated && !$DOC.state && $DOC.finalTransformation)
                $DOC.finalTransformation();
        },
        
        appendCSS: function(id, css, callback, position) {
            if (arguments.length === 1 || typeof css === 'function') {
                position = callback;
                callback = css;
                css = id;
                id = '';
            }
            var head = document.head, exists = document.getElementById(id),
                israwcss = (css.indexOf('{') >= 0);
            if (!exists) {
                if (israwcss) {
                    head.insertAdjacentHTML(position || 'beforeend', '<style id="' + id + '" auto="true">' + css + '</style>');
                } else {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    id && (link.id = id);
                    link.auto = true;
                    link.href = css;
                    if (callback) {
                        link.addEventListener('load', function() { callback(1); });
                        link.addEventListener('error', function() { callback(-1); });
                    }
                    switch(position) {
                        case 'afterbegin':
                            if (head.firstChild)
                                head.insertBefore(link, head.firstChild);
                            else
                                head.appendChild(link);
                        break;
                        default:
                            head.appendChild(link);
                    }
                }
            } else if (israwcss) {
                if (exists.innerHTML !== css)
                    exists.innerHTML = css;
            } else if (exists.href !== css)
                exists.href = css;
        },
        
        mod: function(group, names) {
            if (arguments.length === 1)
                names = group;
            var mod_group = $DOC.mods[group];
            if (!mod_group) {
                mod_group = [];
                $DOC.mods[group] = mod_group;
            }
            names.split(/ ,;/g).forEach(function(name) {
                if (mod_group.indexOf(name) < 0) {
                    var path = $DOC.getRootUrl('mods/' + name + '/' + name);
                    $DOC.appendCSS(group + '-' + name + '-css', path + '.css');
                    $DOC.appendScript(group + '-' + name + '-js', path + '.js');
                    mod_group.push(name);
                }
            });
        },
        removeMod: function(group, names) {
            var mod_group = $DOC.mods[group];
            if (mod_group) {
                ((arguments.length === 1) ? mod_group : names.split(/ ,;/g)) .forEach(function(name) {
                    var index = mod_group.indexOf(name);
                    if (index >= 0) {
                        $DOC.removeElement(group + '-' + name + '-css');
                        $DOC.removeElement(group + '-' + name + '-js');
                        mod_group.splice(index, 1);
                    }
                });
            }
        }
    };
    $DOC.initialize();
    

    // selected theme
    var theme = '', theme_confirmed;
    // fix: case 1: localStorage undefined, case 2: access denied exception under 'data:' url
    try {
        
        theme = localStorage.getItem('primary-theme');
        theme_confirmed = localStorage.getItem('primary-theme-confirmed');
        
        // apply theme 'theme=' command
        var params_theme = url_params.theme;
        if (params_theme && params_theme !== theme) {
            theme = params_theme;
            theme_confirmed = '';
        }
        
        // switch theme 'settheme=' command
        var params_settheme = url_params.settheme;
        if (params_settheme) {
            if (params_settheme !== theme) {
                theme_confirmed = '';
                localStorage.setItem('primary-theme-confirmed', '');
            }
            localStorage.setItem('primary-theme', params_settheme);
            theme = params_settheme;
        }
    } catch (e) {}
    
    Object.defineProperty($DOC, 'theme', {
        get: function() { return theme; },
        set: function(value) {
            value = value || '';
            if (value !== theme && typeof localStorage !== 'undefined') {
                if (value)
                    localStorage.setItem('primary-theme', value); 
                else {
                    localStorage.removeItem('primary-theme');
                    localStorage.removeItem('primary-theme-confirmed');
                }
                window.location.reload();
            }
        }
    });
    
    // >> head transformation
    
    $DOC.headTransformation = function() {
        
        if ($DOC.mode = document.head.hasAttribute('generator'))
            return; // html
        else // mw document
            document.head.setAttribute('generator', 'markdown webdocs');

        this.appendElement('meta', {name:'viewport', content:'width=device-width, initial-scale=1.0'});
        if ($OPT.icon)
            this.appendElement('link', {rel:'shortcut icon', href:this.getRootUrl($OPT.icon)});

        // document style

        this.appendCSS('document.css',
'.fixed-top-bar, .fixed-top-panel\
    { display: block; margin: 0; padding: 0; position: fixed; top: 0; left: 0; right: 0; z-index: 1030; }\
.fixed-top-panel\
    { background-color: inherit; padding: 25px 37px 0px 37px; margin-bottom: 25px; }\
.fixed-top-panel > .navbar\
    { margin: 0; }\
.header-bar, .header-panel\
    { display: block; margin: 0; padding: 0; }\
.header-panel\
    { padding: 25px 37px; }\
.footer-bar, .footer-panel\
    { display: block; margin: 0; padding: 0; }\
.footer-panel\
    { padding: 25px 37px; }\
.fixed-bottom-bar, .fixed-bottom-panel\
    { display: block; margin: 0; padding: 0; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1030; }\
.fixed-bottom-panel\
    { padding: 0px 37px 0px 37px; margin-top: 25px; }\
.fixed-bottom-panel > .navbar\
    { margin: 0; }\
.text-box\
    { width:50%; padding:25px 37px 25px 37px; display: inline-block; }\
.fixed-left-side-bar, .fixed-left-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: auto; position: fixed; top: 0; right: 0; bottom: 0; z-index: 1030; }\
.fixed-left-side-panel\n\
    { width: auto; padding:25px 20px; }\
.left-side-bar, .left-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: 26%; min-width: 240px; }\
.left-side-panel\
    { padding:25px 9px 25px 37px; }\
.content-bar, .content-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: 60%; min-width: 250px; max-width: 73%; }\
.content-panel\
    { padding:25px 37px 25px 37px; }\
.fixed-right-side-bar, .fixed-right-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; width: auto; position: fixed; top: 0; right: 0; bottom: 0; z-index: 1030;}\
.fixed-right-side-panel\
    { width: auto; padding:25px 20px;}\
.right-side-bar, .right-side-panel\
    { display: table-cell; margin: 0; padding: 0; vertical-align: top; min-width: 240px; width: 28%;}\
.right-side-panel\
    { padding:25px 25px 25px 9px;}\
\
@media (max-width: 1024px) {\
.right-side-bar, .right-side-panel\
    { display: block; padding:25px 25px 25px 37px; width: 50%; }\
.right-side-panel\
    { padding:25px 25px 25px 37px; }\
}\
\
@media (max-width: 768px) {\
.left-side-bar, .left-side-panel\
    { display: block; margin: 0; padding: 0; width: auto; }\
.left-side-panel\
    { padding:25px 25px 25px 25px; }\
.content-bar, .content-panel\
    { display: block; margin: 0; padding: 0; max-width: 100%; width: auto; }\
.content-panel\
    { padding:25px 25px 25px 25px; }\
.right-side-bar, .right-side-panel\
    { display: block; margin: 0; padding: 0; width: auto; }\
.right-side-panel\
    { padding:25px 25px 25px 25px; }\
}\
.table-bordered {display:table-cell;}\
.stub {display:inline-block;}\
.stub-error {width:18px; height:18px; border:silver dotted 1px; border-radius:2px;}\
.stub-error:before {content:"?"; font-size:small; color:silver; margin:4px; position:relative; top:-2px;}\
\
.tabpanel-body {padding-bottom:5px; border-left:#DDD solid 1px; border-right:#DDD solid 1px; border-bottom:#DDD solid 1px;}\
.nav-tabs > li > a:focus {outline-color:silver;}\
\
.transparent {background-color:transparent;border-color:transparent;} .transparent:hover {text-decoration:none;}\
.rel {position:relative;} .abs {position:absolute;}\
.hidden {display:none;} .block {display:block;} .inline {display:inline;} .inlineblock {display:inline-block;} .tabcell {display:table-cell;} .tabcol {display:table-column;} .tabrow {display:table-row;}\
.bold {font-weight:bold;} .justify {text-align:justify;} .nowrap {white-space:nowrap;} .l {font-size:90%;} .ll {font-size:80%;}\
.fleft {float:left;} .fright {float:right;} .fnone {float:none;}\
.left {text-align:left;} .right {text-align:right;} .clear {clear:both;} .clearleft {clear:left;} .clearright {clear:right;}\
.center {text-align:center;vertical-align:middle;} .hcenter {text-align:center;} .vcenter {vertical-align:middle;} .bottom {vertical-align:bottom;}'
 + ['0','5','10','15','20'].map(function(val) { return '.mar' + val + '{margin:' + val + 'px}.martop' + val + '{margin-top:' + val + 'px}.marright' + val + '{margin-right:' + val + 'px}.marbottom' + val + '{margin-bottom:' + val + 'px}.marleft' + val + '{margin-left:' + val + 'px}.pad' + val + '{padding:' + val + 'px}.padtop' + val + '{padding-top:' + val + 'px}.padright' + val + '{padding-right:' + val + 'px}.padbottom' + val + '{padding-bottom:' + val + 'px}.padleft' + val + '{padding-left:' + val + 'px}'; }).join('')
);     
        
        if (theme && $OPT.edit_mode !== 1) {
            // theme loading and confirmed flag
            this.appendCSS('theme.css', this.getRootUrl('mods/' + theme + '/' + theme + '.css'), function(state) {
                if (state < 0 && theme_confirmed)
                    localStorage.setItem('primary-theme-confirmed', '');
                else if (state > 0 && !theme_confirmed)
                    localStorage.setItem('primary-theme-confirmed', true);
            }, 'afterbegin');
            this.appendScript('theme.js', this.getRootUrl('mods/' + theme + '/' + theme + '.js'));
        }
        // load bootstrap.css if not theme or previous load error
        if (!theme || !theme_confirmed || $OPT.edit_mode === 1) {
            var bcss = document.getElementById('bootstrap.css');
            if (!bcss) {
                // check boostrap.css load
                var links = document.getElementsByTagName('link');
                for(var i = links.length - 1; i >= 0; i--) {
                    var href = links[i].href;
                    if (href.indexOf('bootstrap.css') >= 0 || href.indexOf('bootstrap.min.css') >= 0) {
                        bcss = true;
                        break;
                    }
                }
                if (!bcss) {
                    var bootstrapcss_cdn = (window.location.protocol === 'file:' ? 'http:' : '') + '//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css';
                    this.appendCSS('bootstrap.css', (this.codebase.indexOf('aplib.github.io') >= 0) ? bootstrapcss_cdn : (this.codebase + (this.codebase ? '/' : '') + 'bootstrap.css'), function(state) {
                        if (state < 0) $DOC.appendCSS('bootstrap.css', bootstrapcss_cdn, null, 'afterbegin'); // load from CDN
                    }, 'afterbegin');
                }
            }
        }
    };
    
    $DOC.headTransformation();
    
    window.addEventListener('DOMContentLoaded', function() {
        var ready_event = $DOC.events.ready;
        if (ready_event) {
            ready_event.raise();
            ready_event.clear();
        }
        if (scripts_count === 0)
        window.addEventListener('load', function() {
            $DOC.finalTransformation();
        });
    });


    if ($OPT.editable) {
        if ($OPT.edit_mode === 1 && window.top === window.self)
            eval('!function(){"use strict";function t(){function t(){m=new c,$DOC.cbody.attachAll(),$DOC.appendCSS("document.editor.css",".tooltip, .popover { z-index:1200; }"),S=new r,$DOC.cbody.add(x=new i),x.createElement(),g=$DOC.cbody.add("div",{style:"overflow:hidden; border-radius:4px; position:fixed; top:20px;bottom:20px;right:20px; height:50%; width:50%; z-index:1101; border: silver solid 1px; background-color:white;"}),v=g.add("toolbar:div`clearfix",{style:"z-index:1111; background-color:#f0f0f0; line-height:32px; padding:0;"}).listen("element",function(t){t&&$(t).find("button,li,a").tooltip({placement:"bottom",container:"body",toggle:"tooltip"})}),v.add("save_group:bootstrap.BtnGroup`mar5",function(t){function e(){b.save(),t.download.element.href=(window.navigator.appName.indexOf("etscape")>0?"data:unknown":"data:application")+"/octet-stream;charset=utf-8,"+encodeURIComponent(b.buildHTML())}t.add("revert:bootstrap.Button",{$icon:"backward","data-original-title":"Revert"}).listen("click",function(){b.revert()});var n=m.fileName||"document.html";".html"!==n.toLowerCase().slice(-5)&&(n+=".html"),t.add("download:a`btn btn-default",\'<b class="glyphicon glyphicon-save"></b>\',{download:n,"data-original-title":"Download"}).listen("mousedown",e).listen("focus",e).listen("click",function(t){try{var e=new Blob([b.buildHTML()]);return window.navigator.msSaveOrOpenBlob(e,n),void t.preventDefault()}catch(o){}}),t.add("save:bootstrap.SplitButton",{$icon:"floppy-disk","data-original-title":"Save"},function(t){t.button._class("disabled").listen("click",function(){b.write()}),t.toggle._class("disabled"),t.items.add("bootstrap.DropdownItem",{$icon:"resize-small"}).listen("click",function(){b.write(0)}).text(".html"),t.items.add("bootstrap.DropdownItem",{$icon:"resize-full"}).listen("click",function(){b.write(1)}).text(".html + .mw.html"),t.items.add("bootstrap.DropdownItem",{$icon:"share-alt"}).listen("click",function(){b.copy()}).text("Copy")}),v.add("cpanel:bootstrap.Button`hide fleft martop5 marbottom5 marleft5 padleft15 padright15",{$icon:"cog","data-original-title":"Control panel"}).listen("click",function(){})}),v.add("bootstrap.Button`mar5 fright",{$icon:"remove","data-original-title":"Close editor (Ctrl-F12)"}).listen("click",function(){var t=location.href,e=t.indexOf("?edit");0>e&&(e=t.indexOf("&edit")),e>=0&&(window.location=t.slice(0,e)+t.slice(e+5))});var t=v.add("bootstrap.Splitbutton`martop5 fright",{$icon:"fullscreen"});t.button.listen("click",function(){b.mode=b.mode?0:1});var l=t.items;l.add("bootstrap.DropdownItem",{$icon:"chevron-left"}).listen("click",function(){b.position=1}),l.add("bootstrap.DropdownItem",{$icon:"chevron-right"}).listen("click",function(){b.position=0}),l.add("bootstrap.DropdownItem",{$icon:"chevron-up"}).listen("click",function(){b.position=2}),l.add("bootstrap.DropdownItem",{$icon:"chevron-down"}).listen("click",function(){b.position=3}),v.add("export_group:bootstrap.BtnGroup`mar5",function(t){t.add("github:bootstrap.Button",{"data-original-title":"Publish"})._icon("export")._text("GitHub").listen("click",function(){O.getSettings(!1,function(t){t&&O.publish()})})}),v.add(w=new o),g.add(T=new n),g.add(y=new e),g.createElement(),b=new a,O=new s,setInterval(function(){for(var t=0,e=k.length;e>t;t++)k[t]()},25),setInterval(function(){for(var t=0,e=C.length;e>t;t++)C[t]()},1e3)}function e(){var t=controls.create("div",{"class":"pad20"}),e=!0;Object.defineProperty(t,"visible",{get:function(){return e},set:function(n){e=n,t.element&&(t.element.style.display=e?"block":"none")}}),t.listen("element",function(t){t&&(t.style.display=e?"block":"none")});var n=t.add("bootstrap.FormGroup");return n.add("bootstrap.ControlLabel",{$text:"Title:"}),n.add("title_edit:bootstrap.ControlInput",{value:""}).listen("change",function(){S.title=n.title_edit.value}),S.listen(function(){S.title!==n.title_edit.value&&(n.title_edit.value=S.title)}),t.save=function(){},t}function n(){function t(){if(e.mode){var t=e._element;t&&t.value!==o&&(e.modified=25,o=t.value)}}var e=controls.create("textarea",{"class":"form-control",style:"font-family:Consolas,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace; display:none; border:0; border-radius:0; border-left:#f9f9f9 solid 6px; box-shadow:none; width:100%; height:100%; resize:none; "});e.code_edit_resize=function(){var t=e.element;t&&(t.style.height=$(g.element).height()-$(v.element).height()+"px")},$(window).on("resize",e.code_edit_resize),C.push(e.code_edit_resize);var n=0;Object.defineProperty(e,"mode",{get:function(){return n},set:function(t){t>2&&(t=2),t!==n&&(n=t,this.element&&(e.element.style.display=n?"block":"none"),e.code_edit_resize())}});var o;return e.listen("element",function(t){t&&(t.value=o),e.code_edit_resize()}),Object.defineProperty(e,"text",{get:function(){return this.element?this.element.value:o},set:function(t){o=t||"",this.element&&(this.element.value=o),this.modified=0}}),e.save=function(){t(),this.modified&&(this.modified=0,this.raise("text",o))},e.listen("change",t,!0),k.push(function(){t(),e.modified&&--e.modified<2&&(e.modified=0,e.raise("text",o))}),e}function o(){function t(){o.selectedIndex=o.controls.indexOf(this)}var e,n=-1,o=v.add("tabs_header:bootstrap.TabPanelHeader");return o.bind(controls.create("dataarray")),o.data.push({isoptions:!0,text:"",hint:"Page options",icon:"list-alt"},{ishtml:!0,text:"HTML",hint:"Edit as HTML"}),o.setTabs=function(t){var e=w.data;t.length+2<e.length&&e.splice(1,e.length-t.length-2);for(var n=e.length,o=t.length+2;o>n;n++)e.splice(1,0,{});for(var n=1,i=e.length-1;i>n;n++)e[n].text=t[n-1];e.raise()},o.listen("data",function(){for(var n=o.controls,i=this.data,r=n.length,a=i.length;a>r;r++)o.add("bootstrap.TabHeader").listen("click",t);for(var r=n.length-1,a=i.length;r>=a;r--){var s=n[r];s.deleteAll(),s.removeListener("click",t),o.remove(s)}for(var r=0,a=i.length;a>r;r++){var l=i[r];l.id=n[r].id;var s=n[r];s.attributes["data-original-title"]=l.hint,s.attributes.$icon=l.icon,s.text(l.text),l===e?s.class("active"):s.class(null,"active")}o.checkSelection(),o.element&&o.refresh()}),Object.defineProperty(o,"selectedIndex",{get:function(){return n},set:function(t){this.selected=t}}),Object.defineProperty(o,"selected",{get:function(){return e},set:function(t){var o=this.data;if("string"!=typeof t){if("number"==typeof t)return void(t>=0&&t<o.length&&t!==n?this.selected=o[t]:-1===t&&(this.selected=void 0));var i=o.indexOf(t);if(i>=0){var r=o[i];r!==e&&e&&(this.lastSelected=e)}if(t!==e||i!==n){for(var a=this.controls,s=0,l=a.length;l>s;s++)s===i?a[s].class("active"):a[s].class(null,"active");this.raise("selected",e=t?t:void 0,n=i)}}else{for(var s=0,l=o.length;l>s;s++){var r=o[s];if(r.id===t)return void(this.selected=r)}for(var s=0,l=o.length;l>s;s++){var r=o[s];if(r.text===t)return void(this.selected=r)}}}}),o.checkSelection=function(){var t=this.data;if(t.length){var n=t.indexOf(e);0>n&&(this.selected=this.lastSelected),this.selected||(this.selected=0)}else this.selected=-1},o}function i(){function t(t){var e=document.createElement("textarea");return e.innerHTML=t,e.value}var e,n,o=location.href;return o=o.slice(0,o.length-location.hash.length),o+=o.indexOf("?")>0?"&preview":"?preview",x=controls.create("iframe",{sandbox:"",src:o,style:"position:fixed; left:0; top:0; width:100%; height:100%; z-index:1100; border:none;"}),x.updateInnerHtml=function(t,o){e=t,n=o;var i=this.element,r=this.$DOC;if(i&&r){var a=i.contentDocument,s=i.contentWindow,l=a.getElementsByTagName("html")[0];l&&(r.initialize(),l.innerHTML=t,r.headTransformation(),s.$OPT.userjs?r.loadUserJS():setTimeout(function(){r.finalTransformation()},0))}},x.reload=function(){this.element&&this.deleteAll(),this.createElement()},x.listen("load",function(){setTimeout(function(){try{this.element.contentWindow.location.pathname!==window.location.pathname&&this.reload()}catch(t){this.reload()}this.$DOC=this.element&&x.element.contentWindow.$DOC,void 0!==e&&this.updateInnerHtml(e,n)}.bind(x),0)}),x.updateNamedSection=function(t,n,o){e=o;var i=this.$DOC,r=i.sections[t];"object"==typeof r&&r.source_node&&i.processTextNode(r.source_node,t+"\\n"+n)},x.grabHTML=function(){for(var e=this.element&&this.element.contentDocument,n=this.$DOC,o=e.documentElement.cloneNode(),i=e.createNodeIterator(o,128,null,!1),r=i.nextNode();r;)r.parentNode.removeChild(r),r=i.nextNode();var a="<!DOCTYPE html>"+o.outerHTML.replace(/<noscript>([\\s\\S]*?)<\\/noscript>/g,function(e,n){return"<noscript>"+t(n)+"</noscript>"}),s=a.lastIndexOf("</body>");return a.substr(0,s)+\'<script>$DOC.onready(function() { if ($OPT.edit_mode) return;$DOC.chead = JSON.parse(unescape("\'+escape(JSON.stringify(n.chead))+\'"), controls.reviverJSON);$DOC.cbody = JSON.parse(unescape("\'+escape(JSON.stringify(n.cbody))+\'"), controls.reviverJSON);$DOC.vars = JSON.parse(unescape("\'+escape(JSON.stringify(n.vars))+\'"), controls.reviverJSON);$DOC.onload(function(){ $DOC.chead.attachAll(); $DOC.cbody.attachAll(); for(var prop in $DOC.vars) { var v = $DOC.vars[prop]; if (v.__type) v.attachAll(); } });});</script>\'+a.substr(s)},x}function r(){function t(){return(this.opentag||"")+(this.attributes.$text||"")+this.controls.map(function(t){return t.outerHTML()}).join("")+(this.closetag||"")}var e,n,o,i;Object.defineProperty(this,"title",{get:function(){return o},set:function(r){if(o=r,!i){if(!n)return;i=n.add("div"),i.template(t)}i.controls.length=0,i.opentag="<title>"+r+"</title>",i.closetag="",e=this.buildHTML(),this.raise()}}),Object.defineProperty(this,"html",{get:function(){return e},set:function(r){if(r!==e){e=r;var a={},s={},l=document.implementation.createHTMLDocument(""),c=l.documentElement,d=/<html[\\s\\S]*?>([\\s\\S]*)<\\/html>/im.exec(e);d&&(c.innerHTML=d[1]);for(var u=controls.create("div"),h=[],f=[],p=l.createNodeIterator(c,65535,null,!1),m=p.nextNode();m;){var b=m===c?u:controls.create("div");b.template(t),h.push(m),f.push(b);var g=h.indexOf(m.parentNode);if(g>=0&&f[g].add(b),8===m.nodeType){var v=m.nodeValue,w=v[0];if(b.opentag="<!--"+m.nodeValue+"-->","%"===w);else if("!"===w);else{var y=v.indexOf(" "),T=v.indexOf("\\n"),S=v.indexOf("->");if(0>y&&0>T&&0>S);else if(0>y&&S>0);else if(T>0&&(0>y||y>T)&&(y=T),y>0&&128>y){var x=v.slice(0,y);a[x]=v.slice(y+1),s[x]=b}}}else if(m===c){var d=/(<html[\\s\\S]*?>)[\\s\\S]*?<head/im.exec(e);b.opentag="<!DOCTYPE html>\\n"+(d?d[1]:"<html>")+"\\n",b.closetag="\\n</html>"}else{var O=m.outerHTML,k=m.innerHTML;if(k){var C=O.lastIndexOf(k);0>C?b.opentag=O:(b.opentag=O.slice(0,C),b.closetag=O.slice(C+k.length))}else b.opentag=O?O:m.nodeValue}m=p.nextNode()}var N=l.getElementsByTagName("head")[0];n=N&&f[h.indexOf(N)];var E=l.getElementsByTagName("title")[0];E?(o=E.textContent,i=f[h.indexOf(E)]):(o="",i=null),this.chtml=u,this.sections=a,this.seccontrols=s,this.raise()}}}),this.updateNamedSection=function(t,n){var o=this.seccontrols[t];o&&(this.sections[t]=n,o.opentag="<!--"+t+"\\n"+n+"-->\\n",e=this.chtml.outerHTML())},this.buildHTML=function(){return this.chtml.outerHTML()}}function a(){function t(t,e,n,o,i,r,a,s,l,c,d,u){if(x.element){var h=x.element.style;h.top=t,h.right=e,h.bottom=n,h.left=o,h.width=i,h.height=r,h=g.element.style,h.top=a,h.right=s,h.bottom=l,h.left=c,h.width=d,h.height=u}}function e(){if(i)switch(r){case 1:t("0","0","0","0","100%","100%","auto","auto","20px","20px","50%","50%");break;case 2:t("0","0","0","0","100%","100%","20px","auto","auto","20px","50%","50%");break;case 3:t("0","0","0","0","100%","100%","auto","20px","20px","auto","50%","50%");break;default:t("0","0","0","0","100%","100%","20px","20px","auto","auto","50%","50%")}else switch(r){case 1:t("0","0","0","auto","50%","100%","0","auto","0","0","50%","100%");break;case 2:t("auto","0","0","0","100%","50%","0","0","auto","0","100%","50%");break;case 3:t("0","0","auto","0","100%","50%","auto","0","0","0","100%","50%");break;default:t("0","auto","0","0","50%","100%","0","0","0","auto","50%","100%")}T.code_edit_resize()}var n=this;S.listen(function(){n.edit_html=S.html,w.setTabs(Object.keys(S.sections)),x.updateInnerHtml(S.chtml.innerHTML(),Object.keys(S.sections))});var o;Object.defineProperty(this,"edit_html",{get:function(){return o},set:function(t){t!==o&&(o=t,S.html=o)}}),this.checkEdits=function(){var t=w.selected;t&&t.isoptions?y.save():t&&T.save()},w.listen("selected",this,function(){this.checkEdits(),this.updateCodeEdit(),this.modified=5,y.visible=0===w.selectedIndex}),this.updateCodeEdit=function(){var t=w.selected;switch(T.mode=!t||t.isoptions?0:t.ishtml?1:2,T.mode){case 1:T.text=n.edit_html;break;case 2:var e=w.selected;e?(T.section=e.text,T.text=S.sections[e.text]):T.text="";break;default:T.text=""}},T.listen("text",function(t){switch(T.mode){case 1:n.edit_html=t,n.modified=25;break;case 2:n.updateNamedSection(T.section,T.text),n.modified=25}}),this.updateNamedSection=function(t,e){S.updateNamedSection(t,e),o=S.buildHTML(),x.updateNamedSection(t,e,S.chtml.innerHTML())},this.save=function(){this.checkEdits(),f.selected=w.selected&&w.selected.text,f.editMw=this.edit_html,f.html===m.mwHtml&&(f.delete=!0),f.raise(),this.modified=0},this.write=function(){this.save(),arguments.length&&(m.fileMode=arguments[0]),m.fileMode?m.write(n.buildHTML(),x.grabHTML())&&h.onReady(function(){location.reload()}):m.write(n.buildHTML())&&h.onReady(function(){location.reload()})},this.copy=function(){this.save();var t=window.prompt("Enter file name",m.fileName);if(t&&t!==m.fileName)if(m.fileMode){var e=m.writeTo(t,n.buildHTML(),x.grabHTML());e&&h.onReady(function(){window.location=e})}else{var e=m.writeTo(t,n.buildHTML());e&&h.onReady(function(){window.location=e})}},this.revert=function(){this.edit_html=m.mwHtml,this.updateCodeEdit(),this.modified=2,setTimeout(function(){window.location.reload()},300)},this.buildHTML=function(){return T.save(),S.buildHTML()};var i=0,r=0,a=600,s=500;if(Object.defineProperty(this,"mode",{get:function(){return i},set:function(t){i=t,e(),n.saveLayout()}}),Object.defineProperty(this,"position",{get:function(){return r},set:function(t){r=t,e(),n.saveLayout()}}),this.saveLayout=function(){"undefined"!=typeof localStorage&&localStorage.setItem("editor layout",[i,r,a,s].join(";"))},"undefined"!=typeof localStorage){try{var l=localStorage.getItem("editor layout").split(";");i=parseInt(l[0]),r=parseInt(l[1]),a=parseInt(l[2]),s=parseInt(l[3])}catch(c){}e()}var d=localStorage&&localStorage.getItem("default selected page");w.lastSelected=f.selected||d||w.data[0],this.edit_html=f.editMw||m.mwHtml||"",w.checkSelection(),m.writable&&(v.save_group.save.button.class(null,"disabled"),v.save_group.save.toggle.class(null,"disabled")),k.push(function(){this.modified&&--this.modified<2&&(this.modified=0,this.save())}.bind(this))}function s(){function t(){var t=controls.create("bootstrap.modal",{style:"z-index:1200;",disabled:!0});t.close=t.header.add("button`close","&times;",{type:"button"}),t.header.add("h4`modal-title","Publish on GitHub");var e=t.body.add("form:bootstrap.Form");return e._add("bootstrap.FormGroup",function(e){e.add("bootstrap.ControlLabel","Username:"),t.user=e.add("bootstrap.ControlInput")})._add("bootstrap.FormGroup",function(e){e._add("bootstrap.ControlLabel","Repository:"),t.repo=e.add("bootstrap.ControlInput")})._add("bootstrap.FormGroup",function(e){e._add("bootstrap.ControlLabel","Branch:"),t.branch=e.add("bootstrap.ControlInput")})._add("bootstrap.FormGroup",function(e){e._add("bootstrap.ControlLabel","Path in repository:"),t.path=e.add("bootstrap.ControlInput")})._add("bootstrap.FormGroup",function(e){e._add("bootstrap.ControlLabel","Personal access token or password:"),t.apikey=e.add("bootstrap.ControlInput")}),t.OK=t.footer.add("bootstrap.Button#primary","OK"),t.Cancel=t.footer.add("bootstrap.Button","Cancel"),t.modeCheckbox=e.add("bootstrap.FormGroup").add("bootstrap.ControlCheckbox`martop20",{$text:"Compile to html"}),t.ref0=e.add("bootstrap.FormGroup").add("a`martop20",{target:"repo"}),setInterval(function(){var e=t.user.value,n=t.repo.value;if(e&&n){var o="https://github.com/"+e+"/"+n;t.ref0._text(o)._attr("href",o)}},977),t}this.getSettings=function(e,n){var o=p.github||(p.github={}),i=o.user,r=o.repo,a=o.branch,s=l({fileName:f.github_path}),c=sessionStorage.getItem("github-apikey")||"";s.fileName||(s=l({fileName:decodeURIComponent(location.pathname).split("/").slice(2).join("/")})),i=i||location.host.split(".")[0],r=r||decodeURIComponent(location.pathname).split("/")[1],a=a||"gh-pages";var d=$DOC.cbody.github_modal;d||(d=$DOC.cbody.github_modal=$DOC.cbody.add(t()),d.createElement(),d.close.listen("click",function(){$(d.element).modal("hide"),n&&n(!1)}),d.OK.listen("click",function(){var t=p.github||(p.github={});t.user=d.user.value||"",sessionStorage.setItem("github-apikey",d.apikey.value||""),t.repo=d.repo.value||"",t.branch=d.branch.value||"gh-pages",p.raise(),f.github_path=d.path.value||"",f.raise(),d.callback&&d.callback(t.user&&t.repo&&t.branch&&f.github_path&&d.apikey.value)}),d.Cancel.listen("click",function(){$(d.element).modal("hide"),d.callback&&d.callback(!1)})),d.user.value=i,d.apikey.value=c,d.repo.value=r,d.branch.value=a,d.path.value=s.fileName,d.modeCheckbox.checked=m.fileMode,d.callback=n,$(d.element).modal("show")},this.publish=function(){var t=p.github||(p.github={}),e=new window.github_api({username:t.user,password:sessionStorage.getItem("github-apikey"),auth:"basic"}),n=e.getRepo(t.user,t.repo),o=b.buildHTML(),i=l({fileName:f.github_path}),r=$DOC.cbody.github_modal;if(r.modeCheckbox.checked){var a=x.grabHTML();n.write(t.branch,i.mwFileName,o,"---",function(e){e?console.log(e):setTimeout(function(){n.write(t.branch,i.fileName,a,"---",function(e){e?setTimeout(function(){n.write(t.branch,i.fileName,a,"---",function(t){t?console.log(t):$(r&&r.element).modal("hide")})},3e3):$(r&&r.element).modal("hide")})},3e3)})}else n.write(t.branch,i.fileName,o,"---",function(e){e?console.log(e):setTimeout(function(){n.removeFile(t.branch,i.mwFileName,function(e){e&&404!==e?setTimeout(function(){n.removeFile(t.branch,i.mwFileName,function(t){t&&404!==t?console.log(t):$(r&&r.element).modal("hide")})},3e3):$(r&&r.element).modal("hide")})},3e3)})}}function l(t){var e=t.fileName,n=t.mwFileName;return e?".html"!==e.slice(-5)?(t.fileName+=".html",l(t)):(".mw.html"===e.slice(-8)?(e=e.slice(0,e.length-8),n=e+".mw.html",e+=".html"):n=e.slice(0,e.length-5)+".mw.html",t.fileName=e,t.mwFileName=n,t):t}function c(){this.environment=0,this.writable=0,this.errorState=-1,this.mwHtml="",this.fileMode=0;var t=location.url,e=t.lastIndexOf("/"),n=t.lastIndexOf("\\\\");e=n>e?n:e,this.path=t.slice(0,e+1),this.fileName=t.slice(e+1),l(this);var o=this;if("undefined"!=typeof nwDispatcher&&"file:"===location.protocol){this.environment=1,this.writable=!0;var i=require("fs"),r=this.path.slice(8)+this.mwFileName,a=this.path.slice(8)+this.fileName;try{i.existsSync(r)?(this.fileMode=1,this.mwHtml=i.readFileSync(r).toString().replace(/\\r/g,"")):this.mwHtml=i.readFileSync(a).toString().replace(/\\r/g,""),this.errorState=0}catch(s){this.errorState=1}this.write=function(t,e){if(this.writable&&!this.errorState)try{if(this.fileMode)i.writeFileSync(r,t),i.writeFileSync(a,e);else{i.writeFileSync(a,t);try{i.unlinkSync(r)}catch(n){}}return a}catch(n){console.log(n)}},this.writeTo=function(t,e,n){if(this.writable&&!this.errorState)try{var o=l({fileName:t}),r=this.path.slice(8)+o.mwFileName,a=this.path.slice(8)+o.fileName;if(this.fileMode)i.writeFileSync(r,e),i.writeFileSync(a,n);else{i.writeFileSync(a,e);try{i.unlinkSync(r)}catch(s){}}return a}catch(s){console.log(s)}}}else{"file:"===location.protocol&&(this.errorState=1);var c=this;$.ajax({url:o.path+o.mwFileName,type:"GET",dataType:"html",async:0}).done(function(t){c.mwHtml=t.replace(/\\r/g,""),c.fileMode=1}).fail(function(){$.ajax({url:o.path+o.fileName,type:"GET",dataType:"html",async:0}).done(function(t){c.mwHtml=t.replace(/\\r/g,"")}).fail(function(){this.errorState=1})})}}function d(t,e){function n(){u(\'<h4><b class="glyphicon glyphicon-warning-sign">&nbsp;</b>Editor loading error</h4>Your browser does not supported and can not be used to edit documents. Please use Firefox, Chrome, Opera or Safari.\')}var o,i,r=this;this.errorState=-1;for(var a in t){var s=t[a];s.listen(function(){this.modified=!0})}if(k.push(function(){for(var e in t){var n=t[e];n.modified&&r.write()}}),window.indexedDB){try{var l=window.indexedDB.open("markdown-webdocs.editor.db.1",1);l.onsuccess=function(t){o=t.target.result,e()},l.onupgradeneeded=function(n){o=n.target.result;for(var i in t)o.createObjectStore(i,{keyPath:"key"});e()},l.onerror=function(t){u(\'<h4><b class="glyphicon glyphicon-warning-sign">&nbsp;</b>Editor loading error</h4>Database error. Please try using another browser for editing the document.\'),console.log(t)},l.onblocked=function(t){u(\'<h4><b class="glyphicon glyphicon-warning-sign">&nbsp;</b>Editor loading error</h4>Database blocked\'),console.log(t)}}catch(c){return void n()}r.restore=function(e){try{var n=o.transaction(Object.keys(t),"readonly"),i=0,a=0;for(var s in t){var l=t[s],c=n.objectStore(s).get(l.key);i++,c.onsuccess=function(n){l=t[n.target.source.name],l.fromJSON(n.target.result),l.modified=!1,a++,a===i&&(r.errorState=0,e&&e())},c.onerror=function(t){console.log(t),this.errorState=1}}}catch(d){console.log(d),this.errorState=1}},r.write=function(){if(!this.errorState)try{var e=o.transaction(Object.keys(t),"readwrite");for(var n in t){var i=t[n];if(i.modified){var r=e.objectStore(n);if(i.delete)delete i.delete,r.delete(i.key);else{var a=r.put(i.toJSON());a.onsuccess=function(){},a.onerror=function(t){console.log(t)}}i.modified=!1,i.selected&&localStorage&&localStorage.setItem("default selected page",i.selected)}}}catch(s){console.log(s)}}}else{if(!window.openDatabase)return void n();try{if(i=window.openDatabase("markdown-webdocs.editor.db.1","1.0","markdow webdocs editor",0),!i)return void n();i.transaction(function(e){for(var o in t)e.executeSql("CREATE TABLE IF NOT EXISTS "+o+" (key TEXT NOT NULL PRIMARY KEY, value TEXT)",[],null,n)},n,e)}catch(c){return void n()}r.restore=function(e){try{i.transaction(function(n){var o=0,i=0;for(var a in t){var s=t[a];n.executeSql("SELECT value FROM "+a+" WHERE key = ? LIMIT 1",[s.key],function(t,n){if(n.rows.length){try{s.fromJSON(JSON.parse(n.rows.item(0).value))}catch(a){s.fromJSON({})}s.modified=!1}i++,i===o&&(r.errorState=0,e&&e())},function(t){console.log(t)})}},function(){console.log(event)},function(){})}catch(n){}},r.write=function(){if(!errorState)try{i.transaction(function(e){for(var n in t){var o=t[n];o.delete?(delete o.delete,e.executeSql("DELETE FROM "+n+" WHERE key = ?",[o.key],function(){},function(t){console.log(t)})):e.executeSql("INSERT OR REPLACE INTO "+n+" (key, value) VALUES (?, ?)",[o.key,JSON.stringify(o)],function(){},function(t){console.log(t)})}},function(){console.log(event)},function(){}),modified=!1}catch(e){console.log(e)}}}r.onReady=function(t){setTimeout(function(){t()},400)}}function u(t){$DOC.cbody.attachAll().add("div",{style:"position:fixed; left:0; top:0; width:100%; height:100%; background-color:white; opacity:0.9; z-index:1201;"}).createElement(),$DOC.cbody.add("alert:div`mar20 alert alert-warning col1-sm-offset-3 col-sm-6 position:fixed; left:25px; top:25px; z-index:1202;",t).createElement()}var h,f,p,m,b,g,v,w,y,T,S,x,O,k=[],C=[];$(window).load(function(){location.url=decodeURI(location.href.split("?")[0]),f=controls.create("DataObject"),f.key=location.url,f.fromJSON=function(t){this.selected=t&&t.selected,this.sourceMw=t&&t.sourceMw,this.editMw=t&&t.editMw,this.history=t&&t.history,this.github_path=t&&t.github_path,Array.isArray(this.history)||(this.history=[])},f.toJSON=function(){return{key:this.key,selected:this.selected,sourceMw:this.sourceMw,editMw:this.editMw,history:this.history,github_path:this.github_path}},p=controls.create("DataObject");var e=document.createElement("script");e.setAttribute("src",$DOC.root),p.key=e.src.split("?")[0],p.fromJSON=function(t){this.github=t&&t.github},p.toJSON=function(){return{key:this.key,github:this.github}},h=new d({drafts:f,settings:p},function(){h.restore(t)})}),r.prototype=controls.create("DataObject")}window.top!==window.self||window["mw-document-editor"]||(window["mw-document-editor"]=!0,"undefined"!=typeof $ENV?t():(window.defercqueue||(window.defercqueue=[])).push(t))}(),function(){function t(t){var e,n,o,i,r,a,s,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c="",d=0;do e=t.charCodeAt(d++),n=t.charCodeAt(d++),o=t.charCodeAt(d++),i=e>>2,r=(3&e)<<4|n>>4,a=(15&n)<<2|o>>6,s=63&o,isNaN(n)?a=s=64:isNaN(o)&&(s=64),c=c+l.charAt(i)+l.charAt(r)+l.charAt(a)+l.charAt(s);while(d<t.length);return c}var e="https://api.github.com",n=function(o){function i(n,i,r,a,s,l){function c(){var t=i.indexOf("//")>=0?i:e+i;return t+(/\\?/.test(t)?"&":"?")+(new Date).getTime()}var d=new XMLHttpRequest;return s||(d.dataType="json"),d.open(n,c(),!l),l||(d.onreadystatechange=function(){4===this.readyState&&(this.status>=200&&this.status<300||304===this.status?a(null,s?this.responseText:this.responseText?JSON.parse(this.responseText):!0,this):a({path:i,request:this,error:this.status}))}),d.setRequestHeader("Accept","application/vnd.github.raw+json"),d.setRequestHeader("Content-Type","application/json;charset=UTF-8"),(o.token||o.username&&o.password)&&d.setRequestHeader("Authorization",o.token?"token "+o.token:"Basic "+t(o.username+":"+o.password)),r?d.send(JSON.stringify(r)):d.send(),l?d.response:void 0}function r(t,e){var n=[];!function o(){i("GET",t,null,function(i,r,a){if(i)return e(i);n.push.apply(n,r);var s=(a.getResponseHeader("link")||"").split(/\\s*,\\s*/g),l=_.find(s,function(t){return/rel="next"/.test(t)});l&&(l=(/<(.*)>/.exec(l)||[])[1]),l?(t=l,o()):e(i,n)})}()}n.User=function(){this.repos=function(t){r("/user/repos?type=all&per_page=1000&sort=updated",function(e,n){t(e,n)})},this.userRepos=function(t,e){r("/users/"+t+"/repos?type=all&per_page=1000&sort=updated",function(t,n){e(t,n)})},this.orgRepos=function(t,e){r("/orgs/"+t+"/repos?type=all&&page_num=1000&sort=updated&direction=desc",function(t,n){e(t,n)})}},n.Repository=function(t){function e(t,e){return t===s.branch&&s.sha?e(null,s.sha):void r.getRef("heads/"+t,function(n,o){s.branch=t,s.sha=o,e(n,o)})}var n=t.name,o=t.user,r=this,a="/repos/"+o+"/"+n,s={branch:null,sha:null};this.getRef=function(t,e){i("GET",a+"/git/refs/"+t,null,function(t,n){return t?e(t):void e(null,n.object.sha)})},this.createRef=function(t,e){i("POST",a+"/git/refs",t,e)},this.deleteRef=function(e,n){i("DELETE",a+"/git/refs/"+e,t,n)},this.compare=function(t,e,n){i("GET",a+"/compare/"+t+"..."+e,null,function(t,e){return t?n(t):void n(null,e)})},this.listBranches=function(t){i("GET",a+"/git/refs/heads",null,function(e,n){return e?t(e):void t(null,_.map(n,function(t){return _.last(t.ref.split("/"))}))})},this.getBlob=function(t,e){i("GET",a+"/git/blobs/"+t,null,e,"raw")},this.getSha=function(t,e,n){return""===e?r.getRef("heads/"+t,n):void r.getTree(t+"?recursive=true",function(t,o){if(t)return n(t);var i=_.select(o,function(t){return t.path===e})[0];n(null,i?i.sha:null)})},this.getTree=function(t,e){i("GET",a+"/git/trees/"+t,null,function(t,n){return t?e(t):void e(null,n.tree)})},this.postBlob=function(t,e){"string"==typeof t&&(t={content:t,encoding:"utf-8"}),i("POST",a+"/git/blobs",t,function(t,n){return t?e(t):void e(null,n.sha)})},this.updateTree=function(t,e,n,o){var r={base_tree:t,tree:[{path:e,mode:"100644",type:"blob",sha:n}]};i("POST",a+"/git/trees",r,function(t,e){return t?o(t):void o(null,e.sha)})},this.postTree=function(t,e){i("POST",a+"/git/trees",{tree:t},function(t,n){return t?e(t):void e(null,n.sha)})},this.commit=function(e,n,o,r){var l={message:o,author:{name:t.username},parents:[e],tree:n};i("POST",a+"/git/commits",l,function(t,e){return s.sha=e&&e.sha,t?r(t):void r(null,e&&e.sha)})},this.updateHead=function(t,e,n){i("PATCH",a+"/git/refs/heads/"+t,{sha:e},function(t){n(t)})},this.show=function(t){i("GET",a,null,t)},this.contents=function(t,e,n,o){return i("GET",a+"/contents?ref="+t+(e?"&path="+e:""),null,n,"raw",o)},this.fork=function(t){i("POST",a+"/forks",null,t)},this.branch=function(t,e,n){2===arguments.length&&"function"==typeof arguments[1]&&(n=e,e=t,t="master"),this.getRef("heads/"+t,function(t,o){return t&&n?n(t):void r.createRef({ref:"refs/heads/"+e,sha:o},n)})},this.createPullRequest=function(t,e){i("POST",a+"/pulls",t,e)},this.listHooks=function(t){i("GET",a+"/hooks",null,t)},this.getHook=function(t,e){i("GET",a+"/hooks/"+t,null,e)},this.createHook=function(t,e){i("POST",a+"/hooks",t,e)},this.editHook=function(t,e,n){i("PATCH",a+"/hooks/"+t,e,n)},this.deleteHook=function(t,e){i("DELETE",a+"/hooks/"+t,null,e)},this.read=function(t,e,n){r.getSha(t,e,function(t,e){return e?void r.getBlob(e,function(t,o){n(t,o,e)}):n("not found",null)})},this.remove=function(t,n,o){e(t,function(e,i){r.getTree(i+"?recursive=true",function(e,a){var s=a.filter(function(t){return t.path!==n});s.forEach(function(t){"tree"===t.type&&delete t.sha}),a.length===s.length&&o(404),r.postTree(s,function(e,a){r.commit(i,a,"Deleted "+n,function(e,n){r.updateHead(t,n,function(t){o(t)})})})})})},this.removeFile=function(t,n,o){e(t,function(e,s){r.getTree(s+"?recursive=true",function(e,r){r&&r.some(function(e){if(e.path===n&&"blob"===e.type){var r={path:e.path,message:"---",sha:e.sha,branch:t};return i("DELETE",a+"/contents/"+n,r,function(t,e){return t?o(t):void o(null,e.sha)}),!0}})||o(null)})})},this.move=function(t,n,o,i){e(t,function(e,a){r.getTree(a+"?recursive=true",function(e,s){_.each(s,function(t){t.path===n&&(t.path=o),"tree"===t.type&&delete t.sha}),r.postTree(s,function(e,o){r.commit(a,o,"Deleted "+n,function(e,n){r.updateHead(t,n,function(t){i(t)})})})})})},this.write=function(t,n,o,i,a){e(t,function(e,s){return e?a(e):void r.postBlob(o,function(e,o){return e?a(e):void r.updateTree(s,n,o,function(e,n){return e?a(e):void r.commit(s,n,i,function(e,n){return e?a(e):void r.updateHead(t,n,a)})})})})},this.getCommits=function(t,e){t=t||{};var n=a+"/commits",o=[];if(t.sha&&o.push("sha="+encodeURIComponent(t.sha)),t.path&&o.push("path="+encodeURIComponent(t.path)),t.since){var r=t.since;r.constructor===Date&&(r=r.toISOString()),o.push("since="+encodeURIComponent(r))}if(t.until){var s=t.until;s.constructor===Date&&(s=s.toISOString()),o.push("until="+encodeURIComponent(s))}o.length>0&&(n+="?"+o.join("&")),i("GET",n,null,e)}},this.getRepo=function(t,e){return new n.Repository({user:t,name:e})},this.getUser=function(){return new n.User}};window.github_api=n}();');
            //$DOC.appendScript('document.editor.js', '/*include editor*/');

        window.addEventListener('keydown', function(event) {
            if (event.keyCode === 123 && !event.altKey && event.ctrlKey) {
                if ($OPT.edit_mode) {
                    var url = location.href, pos = url.indexOf('?edit'); if (pos < 0) pos = url.indexOf('&edit');
                    if (pos >= 0)
                        window.location = url.slice(0, pos) + url.slice(pos + 5);
                } else
                    window.location = (window.location.protocol || '') + '//' + window.location.host + window.location.pathname + '?' + window.location.search + ((window.location.search) ? '&edit' : 'edit');
            }
        });
    }
    
})();







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






//     controls.css.js
//     control (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {
    
    var transforms = ',matrix,translate,translateX,translateY,scale,scaleX,scaleY,rotate,skewX,skewY,matrix3d,translate3d,translateZ,scale3d,scaleZ,rotate3d,rotateX,rotateY,rotateZ,perspective,';
    
    // control + auto-css pair factory
    function  Felement(__type, parameters, attributes, css) {
        
        var control = controls.createBase(__type, parameters, attributes);
        
        // >> parse style from parameters 
        
        parameters = control.parameters;
        var style = control.attributes.style || '';
        var transform = '';
        for(var name in parameters) {
            if (name === 'origin' || name === 'transform-origin')
                style += 'transform-origin:' + parameters.origin + ';-webkit-transform-origin:' + parameters.origin + ';-moz-transform-origin:' + parameters.origin + ';';
            else if (transforms.indexOf(name.trim()) >= 0) {
                if (transform)
                    transform += ' ';
                // translate=1,2 -> translate(1,2)
                transform += name +'(' + parameters[name] + ')';
            } else  {
                if (name[0] !== '$')
                    style += name + ':' + parameters[name] + ';';
            }
        }
        if (transform) {
            if (style && style.slice(-1) !== ';')
                style += ';';
            style += 'transform:' + transform + ';-webkit-transform:' + transform + ';-moz-transform:' + transform + ';';
        }
        if (style) {
            control.attributes.style = style;
        }
        
        // << parse style from parameters
        
        return control;
    }
        
    function process_inner_text(control) {
        // process markup at this level
        var inner_text = control.attributes.$text;
        if (inner_text) {
            $DOC.processContent(control, inner_text);
            control.attributes.$text = undefined;
        }
    }


    // styled block div factory
    function Block(parameters, attributes) {
        var control = Felement('div', parameters, attributes);
        control.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        process_inner_text(control);
        return control;
    };
    controls.factoryRegister('block', Block);
    
    
    function IBlock(parameters, attributes) {
        var control = Block(parameters, attributes);
        control.style('display:inline-block;' + control.style());
        return control;
    };
    controls.factoryRegister('iblock', IBlock);

    function span_template(it) {
        return '<span' + it.printAttributes() + '>'
            + $ENV.marked( (it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("") )
            + '</span>';
    }
    function Text(parameters, attributes) {
        var control = Felement('span', parameters, attributes);
        control.template(span_template, $ENV.default_inner_template);
        process_inner_text(control);
        return control;
    };
    controls.factoryRegister('text', Text);
    
    
    function  Off(parameters, attributes) {
        var off_mode = $DOC.components_off;
        $DOC.components_off = true;
        var off_text = controls.createBase('container', parameters, attributes);
        $DOC.components_off = off_mode;
        return off_text;
    }
    controls.factoryRegister('off', Off);
    
    
    function  Encode(parameters, attributes) {
        var control = controls.createBase('container', parameters, attributes);
        control.template(html_encode, html_encode);
        process_inner_text(control);
        return control;
    }
    function html_encode(it) {
        return controls.encodeHTML((it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join(""));
    }
    controls.factoryRegister('encode', Encode);
    
    
    function  Decode(parameters, attributes) {
        var control = controls.createBase('container', parameters, attributes);
        control.template(html_decode, html_decode);
        process_inner_text(control);
        return control;
    }
    function html_decode(it) {
        return controls.decodeHTML((it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join(""));
    }
    controls.factoryRegister('decode', Decode);
    
    
    function  Escape(parameters, attributes) {
        var control = controls.createBase('container', parameters, attributes);
        control.template(escape_template, escape_template);
        process_inner_text(control);
        return control;
    }
    function escape_template(it) {
        return '<span>' + controls.encodeHTML((it.attributes.$text || "") + it.controls.map(function(control) { return control.wrappedHTML(); }).join("")) + '</span>';
    }
    controls.factoryRegister('escape', Escape);


}})();






//     controls.panels.js
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     License: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

var bootstrap = controls.bootstrap;
    
    // Panel
    
    function Panel(parameters, attributes) {
        
        var panel = controls.createBase('bootstrap.Panel', parameters, attributes);

        var body = panel.body;
        $DOC.processContent(body, body.attributes.$text);
        delete body.attributes.$text;
        body.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        
        return panel;
    };
    controls.factoryRegister('panel', Panel);
    
    
    // Collapse
    
    function Collapse(parameters, attributes) {
        
        var start_collapsed = parameters.collapse || parameters.collapsed,
            header = parameters.header;
        
        var body = 
        this.initialize('collapse', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate())
            ._class('collapse-panel panel panel-' + this.getControlStyle())
            ._add('header:div', {
                        class: 'panel-heading collapse-header',
                'data-toggle': 'collapse',
                        $text: '<a href="#" class="panel-title">' + (header || '') + '</a>'
            })
            .add('collapse:div', {class:'panel-collapse collapse collapse-body' + (start_collapsed ? '' : ' in')})
            .add('body:div', {class:'panel-body'});
        this.header.attributes['data-target'] = '#' + this.collapse.id;
        
        body.template($ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        $DOC.processContent(body, this.text());
        this.text('');
        
        // process markup template:
        
    };
    Collapse.prototype = bootstrap.control_prototype;
    controls.typeRegister('collapse', Collapse);
    
    
    // Alert
    
    function Alert(parameters, attributes) {
        
        this.initialize('alert', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate())
            .class('alert alert-' + this.getControlStyle() + ' fade in');
        
        // process markup at this level
        var this_text = this.text();
        this.text('');
        $DOC.processContent(this, this_text);
    };
    Alert.prototype = bootstrap.control_prototype;
    controls.typeRegister('alert', Alert);
    
    
    // Well
    
    function Well(parameters, attributes) {
        
        this.initialize('well', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate())
            .class('well');
        
        var size = this.getControlSize();
        if (size === 'small')
            this.class('well-sm');
        else if (size === 'large')
            this.class('well-lg');
        
        var this_text = this.text();
        this.text('');
        $DOC.processContent(this, this_text);
    };
    Well.prototype = bootstrap.control_prototype;
    controls.typeRegister('well', Well);
   
    
}})();






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






//     controls.page-layout.js Page layout manager
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
//     license: MIT
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    function PageLayout(parameters, attributes) {
        
        controls.controlInitialize(this, 'page-layout', parameters, attributes);
        
        // media selector
        var media = this.parameter('media'),
            visible_columns = [], columnset_hash = '', out = [],
            padding = this.parameter('padding'); // padding parameter

        switch(this.parameter('scheme')) {

            // >> horizontal centered
            case 'centered':

                // default horizontal padding for 'centered' scheme
                padding = padding || '16px';


                var width = this.parameter('width') || '90%',
                    min_width = this.parameter('min-width') || width,
                    max_width = this.parameter('max-width') || width;
                var _width_ = '';
                if (width) _width_ += 'width:' + width + ';';
                if (min_width) _width_ += 'min-width:' + min_width + ';';
                if (max_width) _width_ += 'max-width:' + max_width + ';';


                out.push((media) ? ('@media (' + media + '){') : '');
                out.push(
'', // placeholder for columns
this.text(), // additional css
'body{margin:0 auto;', _width_, '}\
.header-bar, .header-panel, .footer-bar, .footer-panel { padding-left:' + padding + '; padding-right:' + padding + '; }\
.left-side-panel, .left-side-bar, .content-panel, .content-bar, .right-side-panel , .right-side-bar { display: inline-block; }');
                if (media)
                    out.push('}');

            break;
            // << horizontal centered
        }
       
        
        
        var columns = this.parameter('columns');
        if (columns) {
            columns = columns.split(',');
            var handler = setColumnsWidths.bind(this);
            $(window).on('resize', handler);
            $DOC.onload(handler);
        }
        
        function setColumnsWidths() {
            visible_columns = [];
            var cbody = $DOC.cbody;
            $DOC.columns.forEach(function(column) {
                var ccol = cbody[column];
                if (ccol) {
                    var element = ccol._element;
                    
                    if (!element || (element && $(element).is(":visible")))
                        visible_columns.push(column);
                }
            });
            var hash = visible_columns.join(',');
            if (hash !== columnset_hash) {
                // changed the composition of visible columns
                columnset_hash = hash;
                var widths = '';
                for(var i = 0, c = visible_columns.length; i < c; i++)
                if (i < columns.length) {
                    
                    widths += '.' + visible_columns[i] + '{width:' + columns[i] + ';';
                    
                    // set horizontal padding
                    if (i === 0)
                        widths += 'padding-left:' + padding + ';';
                    else if (i === c-1)
                        widths += 'padding-right:' + padding + ';';
                    
                    widths += '}';
                }
                out[1] = widths;
                this.refresh();
            }
        }
        
        
        
        this.template(function(it) { 
            return '<style' + it.printAttributes() + '>' + out.join('') + '</style>'; });
    };
    PageLayout.prototype = controls.control_prototype;
    controls.typeRegister('page-layout', PageLayout);

}})();






//     controls.footer-layout
//     (c) 2013 vadim b. http://aplib.github.io/markdown-site-template
// built-in Markdown webdocs component

(function() { 'use strict';
(typeof $ENV !== 'undefined') ? initialize() : (window.defercqueue || (window.defercqueue = [])).push(initialize);
function initialize() {

    function FooterLayout(parameters, attributes) {
        
        this.initialize('footer-layout', parameters, attributes, $ENV.getDefaultTemplate('div'), $ENV.getDefaultTemplate());
        
        var media = this.parameter('media'),        // media selector
            padding = this.parameter('padding'),    // padding parameter
            scheme = this.parameter('scheme') || 'line';
            
        $DOC.processContent(this, this.text());
        this.text('');

        switch(this.parameter('scheme')) {

            // >> horizontal centered
            case 'line':

                this.listen('element', function() {
                    this.lineParseDOM();
                });
                
                $DOC.appendCSS('controls.footer-layout.line',
'.cfl-line-container { margin:0; padding:0; float:left; }\
.cfl-line-container > li { line-height:32px; list-style:none; float:left; padding:12px 24px 12px 0px; }\
.cfl-line-item { line-height:32px; list-style:none; float:left; padding:12px 24px 12px 0px; }\
.cfl-line-container:last-child, .cfl-line-item:last-child { float:right; padding-right:0; }\
.cfl-line-container:first-child, .cfl-line-item:first-child { float:left; }\
');
        
                this.lineParseDOM = function() {
                    var element = this._element;
                    if (element) {

                        var nodes = element.childNodes;
                        for(var i = nodes.length - 1; i >= 0; i--) {
                            var node = nodes[i];
                            if (node.nodeType === 1) {
                                var tag = node.tagName.toUpperCase();
                                switch(tag) {
                                    case 'UL':
                                        $(node).addClass('cfl-line-container');
                                    break;
                                    case 'HR':
                                        element.removeChild(node);
                                    break;
                                    default:
                                        $(node).addClass('cfl-line-item');
                                }
                            }
                        }
                    }
                };
            break;
        }
    };
    FooterLayout.prototype = controls.control_prototype;
    controls.typeRegister('footer-layout', FooterLayout);


}})();






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
