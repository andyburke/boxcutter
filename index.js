'use strict';

const Delver = require( 'delver' );
const extend = require( 'extend' );
const fs = require( 'fs' );

let Boxcutter = {};

Boxcutter.load = function( filename ) {
    const self = this;
    self.package = extend( true, {}, require( filename ) );
};

Boxcutter.save = function( filename, _options, _callback ) {
    const self = this;

    const callback = typeof _callback === 'function' ? _callback : typeof _options === 'function' ? _options : null;

    _options = typeof _options === 'object' ? _options : null;
    const options = extend( true, {}, {
        json: {
            indent: 2
        }
    }, _options );

    self.package = self.package || {};
    const packageString = JSON.stringify( self.package, options.json.replacer, options.json.indent );

    if ( callback ) {
        fs.writeFile( filename, packageString, callback );
    }
    else {
        fs.writeFileSync( filename, packageString );
    }
};

Boxcutter.get = function( key ) {
    const self = this;
    self.package = self.package || {};
    return Delver.get( self.package, key );
};

Boxcutter.set = function( key, value ) {
    const self = this;
    self.package = self.package || {};
    return Delver.set( self.package, key, value );
};

module.exports = Object.assign( function() {}, {
    prototype: Boxcutter
} );

module.exports.Boxcutter = Boxcutter;
