'use strict';

const Delver = require( 'delver' );
const extend = require( 'extend' );
const fs = require( 'fs' );
const util = require( 'util' );

const async_write_file = util.promisify( fs.writeFile );

const Boxcutter = {
    read: function( json ) {
        this.__obj = JSON.parse( json );
        return this;
    },

    load: function( filename ) {
        this.__obj = extend( true, {}, require( filename ) );
        return this;
    },

    save: async function( filename, options ) {
        const output = this.serialize( options );
        await async_write_file( filename, output );
        return this;
    },

    get: function( key ) {
        this.__obj = this.__obj || {};
        return Delver.get( this.__obj, key );
    },

    set: function( key, value ) {
        this.__obj = this.__obj || {};
        return Delver.set( this.__obj, key, value );
    },

    serialize: function( _options ) {
        const options = extend( true, {
            replacer: null,
            index: 4
        }, _options );

        return JSON.stringify( this.__obj, options.replacer, options.indent );
    }
};

module.exports = {
    create: () => {
        return Object.assign( {}, Boxcutter );
    }
};
