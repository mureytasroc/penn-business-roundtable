var express = require('express');
var router = express.Router();

var request = require('request');

const ics = require('ics')


var Members = require(__dirname + '/../models/Members');

var Admin = require(__dirname + '/../models/Admin')


var CLIENT_ID="1018817613137-hn5ovvld3e1jlh0su3kvqhu6phqk8vd3.apps.googleusercontent.com"
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);











module.exports = router;
