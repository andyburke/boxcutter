#!/usr/bin/env node
'use strict';

const help = require( './help.json' );

const argv = require( 'yargs' )
    .usage( help.usage.join( '\n' ) )
    .demand( 1 )
    .argv;

const Boxcutter = require( './index.js' );
const path = require( 'path' );

let boxcutter = Object.assign( {}, Boxcutter.Boxcutter );

const directory = process.cwd();
let directoryElements = directory.split( path.sep );
let loaded = false;

let packageFile = null;

do {
    packageFile = path.sep + path.join.apply( path, directoryElements.concat( [ 'package.json' ] ) );

    try {
        boxcutter.load( packageFile );
        loaded = true;
    }
    catch( ex ) {
        continue;
    }

} while( !loaded && directoryElements.pop() );

const command = argv._.shift();

const commands = {
    get: function() {
        const key = argv._.shift();
        if ( !key ) {
            console.error( 'You must specify a key to get.' );
            process.exit( 1 );
        }

        const value = boxcutter.get( key );
        console.log( typeof value === 'object' ? JSON.stringify( value, null, argv.indent || 2 ) : value );
        process.exit( 0 );
    },

    set: function() {
        const key = argv._.shift();
        if ( !key ) {
            console.error( 'You must specify a key to set.' );
            process.exit( 1 );
        }

        const value = argv._.shift();

        boxcutter.set( key, value );
        boxcutter.save( packageFile, function( error ) {
            if ( error ) {
                console.error( error );
                process.exit( 1 );
            }

            process.exit( 0 );
        } );
    },

    help: function() {
        const subject = argv._.shift();
        const helpOutput = help.commands[ subject ];

        if ( !subject ) {
            console.log( help.commands[ 'unknown command' ].join( '\n' ) );
        }
        else if ( !helpOutput ) {
            console.error( 'Unknown command: ' + subject );
            console.error( help.commands[ 'unknown command' ].join( '\n' ) );
        }
        else {
            console.log( helpOutput.join( '\n' ) );
        }

        process.exit( 0 );
    },

    undefined: function() {
        console.error( 'Unknown command: ' + command );
        process.exit( 1 );
    }
};

const action = commands[ command ] || commands[ undefined ];
action();
