'use strict';
var Path = require('path'),
    hapi = require('hapi'),
    swagger         = require('hapi-swagger'),
    wreck = require('wreck'),
    pack    = require('../../package'),
    joi = require('joi'),
    logger=require('../utils/logger');


var serverOptions = {
     router: { isCaseSensitive: true },
    cors: true
};

var server = hapi.createServer('localhost', 3000, serverOptions);

var internals = {}
internals.serveWeather = function (request, reply) {
    wreck.get('http://weather.yahooapis.com/forecastrss?w=2502265', function (err, res, payload) {
            reply(err || payload); //return type is text/html but use JSON.parse() if you now the type is application/JSON
        });
};
server.route({
    method : 'GET',
    path : '/api/weather/{id}' ,
    config:{
        handler: internals.serveWeather,
        notes: 'Returns the weather as per the areacode',
        tags: ['api']
    }
})

server.route({
    method : 'GET',
    path: '/api/people/{id}',
    config:{
        handler : function(req,reply){
            reply('hello ' + req.params.id);
        },
        notes: 'Returns person with give id',
        tags: ['api'],
        validate: {
            params: {
                id: joi.number()
                        .required()
                        .description('the id for the person'),
            }
        }
    }
})

server.route({
    method:'GET',
    path:'/public/{param*}',
    handler:{
        directory:{
            path: 'client',
            listing:false
        }
    }
});

// setup swagger options
var swaggerOptions = {
    basePath: 'http://localhost:3000',
    apiVersion: pack.version
};

//add logging

// adds swagger self documentation plugin
server.pack.register({plugin: require('hapi-swagger'), options: swaggerOptions}, function (err) {
    if (err) {
        console.log(['error'], 'plugin "hapi-swagger" load error: ' + err)
    }else{
        console.log(['start'], 'swagger interface loaded')

        server.start(function(){
               logger.info(['start'], pack.name + ' - web interface: ' + server.info.uri);
        });
    }
});