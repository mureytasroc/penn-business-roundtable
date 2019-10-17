var GoogleSpreadsheet = require('google-spreadsheet')
var creds = require('./client_secret_sheets.json')
var doc = new GoogleSpreadsheet('1l7IqdEJAQD0vQggBKl_grAm2k-N-QgNs9TWGhSm9hQE');
const ipInfo = require("ipinfo");
var moment = require('moment-timezone');
moment().format();

const membersFP = __dirname +'/members.csv'
const eventsFP = __dirname +'/events.csv'
const speakersFP = __dirname +'/speakers.csv'

const csv=require('csvtojson')

exports.log = function (logo, ipcurrent, callback) {
	doc.useServiceAccountAuth(creds, function (err) {
    var timestamp=logo["Timestamp"]
    logo["Date"]=""+timestamp.format("MM/DD/YYYY");
    logo["Hour"]=""+timestamp.hour();
		ipInfo(logo["IP"], (err, cLoc) => {
        if(!err){
					if(cLoc){
						if(cLoc.country && cLoc.region && cLoc.city && cLoc.postal){
							logo["Location"] = cLoc.country + "," + cLoc.region + "," + cLoc.city+","+cLoc.postal;
						} else{ logo["Location"]="";}
						if(cLoc.loc){
			      	logo["LatLong"] = cLoc.loc.split(",")[0]+"/"+cLoc.loc.split(",")[1];
						}
						else{ logo["LatitudeLongitude"]="";}
						if(cLoc.org){
							logo["Organization"]=cLoc.org
						} else{logo["Organization"]="";}
					}
				}
				if(!cLoc || logo["IP"] != ipcurrent){
					logo["Timestamp"]=""+timestamp.format()
					doc.addRow(1, logo, callback)
				}
				else{
					callback();
				}
			});
	});
}

exports.getMembers = function (callback) {
	csv()
	.fromFile(membersFP)
	.then((jsonObj)=>{
	    callback(jsonObj)
	})
}

exports.getEvents = function (callback) {
	csv()
	.fromFile(eventsFP)
	.then((jsonObj)=>{
	    callback(jsonObj)
	})
}

exports.getSpeakers = function (callback) {
	csv()
	.fromFile(speakersFP)
	.then((jsonObj)=>{
	    callback(jsonObj)
	})
}
