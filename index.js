var Path = require('path'),
      Hapi = require('hapi'),
       swagger         = require('hapi-swagger'),
     Wreck = require('wreck'),
    pack    = require('./package');

//var server = new Hapi.Server('localhost',3000,{files:{relativeTo: Path.join(__dirname,'client')} });

var serverOptions = {
  router: { isCaseSensitive: true },
    cors: true
};
var server = new Hapi.Server('localhost',3000,serverOptions);

//??how to externalise the serverWeather in a difft file
var internals = {}
internals.serveWeather = function (request, reply) {
    Wreck.get('http://weather.yahooapis.com/forecastrss?w=2502265', function (err, res, payload) {
            reply(err || payload); //return type is text/html but use JSON.parse() if you now the type is application/JSON
        });
};

var todos = {
    "todos": [
        {
            "todo": "take a nap",
            "note": "note for nap"
        },
        {
            "todo": "buy a book",
            "note": "note for book"
        },
        {
            "todo": "read a blog",
            "note": "note for blog"
        }
    ]
}

/*
server.route({
    method:'GET',
    path:'/{param*}',
    handler:{
        directory:{
            path: 'client',
            listing:false
        }
    }
});
*/

server.route({
    method :'GET',
    path : '/hello',
    handler : function(request,reply){
         //reply ("this will response soon with weather api")
         reply(todos);
    }
})

server.route({
    method : 'GET',
    path : '/api/weather',
    handler: internals.serveWeather
})

server.route({
    method : 'GET',
    path : '/api/test/{name}',
    handler: function(request,reply){
        reply('Hello' + encodeURIComponent(request.params.name) + '!');
    }
})

server.route({
    method: 'GET',
    path: '/api/todo',
    handler: function (request, reply) {
        reply(JSON.parse(todos));
    }
});


// setup swagger options
var swaggerOptions = {
    basePath: 'http://localhost:3000',
    apiVersion: pack.version
};


// adds swagger self documentation plugin
server.pack.register({plugin: require('hapi-swagger'), options: swaggerOptions}, function (err) {
    if (err) {
        console.log(['error'], 'plugin "hapi-swagger" load error: ' + err)
    }else{
        console.log(['start'], 'swagger interface loaded')

        server.start(function(){
            console.log(['start'], pack.name + ' - web interface: ' + server.info.uri);
        });
    }
});



