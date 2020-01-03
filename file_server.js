var express = require('express');
var favicon = require('serve-favicon');

const ipInfo = require("ipinfo");
const requestIp = require('request-ip');
var moment = require('moment');
moment().format();

BLACKLISTED_ORGS = ["Amazon", "Google", "Microsoft", "Facebook"]



var https = require("https");


var app = express();


var request = require('request');
var Admin = require(__dirname + '/models/Admin')
var Members = require(__dirname + '/models/Members')


app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use('/member', express.static('public'));
app.use('/member', favicon(__dirname + '/public/images/favicon.png'));
app.use('/speaker', express.static('public'));
app.use('/speaker', favicon(__dirname + '/public/images/favicon.png'));


app.use(express.urlencoded());




var methodOverride = require('method-override');
app.use(methodOverride('_method'));


//app.use(require('./controllers/user'));


var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server started at ' + new Date() + ', on port ' + port + '!');
});



//////////////////////////////////////////////////////////////////////////////////////
///////////////////////GET request handling (largely uncommented)/////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {
		const ip = requestIp.getClientIp(request);
		ipInfo(ip, (err, cloc) => {
			if(!request.query.wakeup && (err || !cloc || !BLACKLISTED_ORGS.reduce((t,c)=>{t||c.includes(cloc.org)},false))){
		    var log = {
		      'Timestamp': moment().tz('America/New_York'),
					'IP': ip,
		      'Verb': "GET",
		      'Route': "/",
					'Page': "Home",
		    }
		    console.log(log);
				Admin.log(log, function(){});
			}
			else{
				var log = {
		      'Timestamp': moment().tz('America/New_York'),
					'IP': ip,
		      'Verb': "GET",
		      'Route': "/",
					'Page': "Home (Self-Request)",
		    }
		    console.log(log);
			}

			response.render('index')
		})
});

app.get('/about', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/about",
			'Page': "About"
    }
    console.log(log);
		Admin.log(log, function(){});

		response.status(200);
		response.setHeader('Content-Type', 'text/html')
		response.render('about');
});

app.get('/speakers', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/speakers",
			'Page': "Speakers"
    }
    console.log(log);
		Admin.log(log, function(){});
		Admin.getSpeakers(function(speakers){
			response.status(200);
	    response.setHeader('Content-Type', 'text/html')
	    response.render('speakers', {speakers: speakers});
		})

});

app.get('/speaker/:namec', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/speaker/:namec",
			'Page': "Speaker: " + request.params.namec
    }
    console.log(log);
		Admin.log(log, function(){})
		Admin.getSpeakers(function(speakers){
			var foundSpeaker=null;
			speakers.map(function(m){
				var namec = m.name.toLowerCase().replace(/ /g,"")
				if(namec == request.params.namec){
					foundSpeaker=m;
				}
			})
			if(foundSpeaker){
				response.status(200);
		    response.setHeader('Content-Type', 'text/html')
		    response.render('speaker', {speaker: foundSpeaker});
			}
			else{
				response.status(404);
		    response.send("No matching speaker found.")
			}
		})

});

app.get('/roundtables', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/roundtables",
			'Page': "Roundtables"
    }
    console.log(log);
		Admin.log(log, function(){});
		Admin.getRoundtables(function(roundtables){
			response.status(200);
	    response.setHeader('Content-Type', 'text/html')
	    response.render('roundtables', {roundtables: roundtables});
		})

});

app.get('/members', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/members",
			'Page': "Members"
    }
    console.log(log);
		Admin.log(log, function(){});
		Admin.getMembers(function(members){
			members.map(function(m){
				var school = m.school.replace(/ /g,"").replace(/,/g,"");
				var year = "'"+m.gradyear.slice(-2);
				var gradclass="";
				if(school.includes("Wharton")){gradclass+=("W"+year); school.replace("Wharton","");}
				if(school.includes("SAS")){gradclass+=("C"+year); school.replace("SAS","");}
				if(school.includes("SEAS")){gradclass+=("E"+year); school.replace("SEAS","");}
				if(school!="" && gradclass==""){gradclass=year;}
				var newM=m;
				newM.gradclass=gradclass;
				return newM;
			})
			response.status(200);
	    response.setHeader('Content-Type', 'text/html')
	    response.render('members', {members: members});
		})

});

app.get('/member/:namec', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/member/:namec",
			'Page': "Member: " + request.params.namec
    }
    console.log(log);
		Admin.log(log, function(){})
		Admin.getMembers(function(members){
			var foundMember=null;
			members.map(function(m){
				var namec = m.name.toLowerCase().replace(/ /g,"")
				if(namec == request.params.namec){
					var school = m.school.replace(/ /g,"").replace(/,/g,"");
					var year = "'"+m.gradyear.slice(-2);
					var gradclass="";
					if(school.includes("Wharton")){gradclass+=("W"+year); school.replace("Wharton","");}
					if(school.includes("SAS")){gradclass+=("C"+year); school.replace("SAS","");}
					if(school.includes("SEAS")){gradclass+=("E"+year); school.replace("SEAS","");}
					if(school!="" && gradclass==""){gradclass=year;}
					var newM=m;
					newM.gradclass=gradclass;
					foundMember=newM;
				}
			})
			if(foundMember){
				response.status(200);
		    response.setHeader('Content-Type', 'text/html')
		    response.render('member', {member: foundMember});
			}
			else{
				response.status(404);
		    response.send("No matching member found.")
			}
		})

});

app.get('/contact', function (request, response) {
		const ip = requestIp.getClientIp(request);
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
      'Route': "/contact",
			'Page': "Contact"
    }
    console.log(log);
		Admin.log(log, function(){});

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('contact');
});



setInterval(function() {
			https.get("https://www.pennbusinessroundtable.com/?wakeup=true");
}, 300000); // keeps Heroku website awake
