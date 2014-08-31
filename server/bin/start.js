'use strict';
//var Path    = require('path'),
var    hapi       = require('hapi'),
    swagger = require('hapi-swagger'),
    pack       = require('../../package'),
    logger    = require('../utils/logger'),
    routes          = require('../lib/routes.js');


var serverOptions = {
     router: { isCaseSensitive: true },
    cors: true
};

var server = hapi.createServer('localhost', 3000, serverOptions);
server.route(routes.routes);

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