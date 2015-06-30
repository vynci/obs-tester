'use strict';

var request = require( 'request' );
var config  = require( process.cwd() + '/config' );
var when    = require( 'when' );
var access;

var login = function () {

	return when.promise( function ( resolve, reject ) {

		if ( access ) {
			return resolve( access );
		}

		var data = {
			'loginName' : config.credentials.username,
			'password'  : config.credentials.password
		};

		// Run request
		request.post( {
			'uri'     : config.api.gateway + '/api/v1/legacy/authenticate',
			'headers' : {
				'X-Engine-Id'     : config.credentials.engineId,
				'X-Engine-Secret' : config.credentials.engineSecret,
				'Content-Type'    : 'application/json'
			},

			'body' : JSON.stringify( data )

		}, function ( error, load, body ) {
			if ( error ) {
				return reject( error );
			}
			var data = JSON.parse( body );
			access   = data.payload.sessionToken;
			return resolve( data.payload.sessionToken );
		} );
	} );

};

var fetch = function ( requestData, cb ) {

	// Authenticate
	login()
	.then( function ( authResult ) {

			request[ requestData.method ]( {
				'uri'     : config.api.gateway + requestData.path,
				'headers' : {
					'X-Engine-Id'     : config.credentials.engineId,
					'X-Engine-Secret' : config.credentials.engineSecret,
					'authorization'   : 'Bearer ' + authResult,
					'Content-Type'    : 'application/json'
				},
				'qs'   : requestData.qs || {},
				'body' : JSON.stringify( requestData.body || {} )

			}, cb );

		// fetch data using paylod
	} )
	.catch( function( authError ) {
		cb( authError );
	} );
};

module.exports = {
	'fetch' : fetch
};