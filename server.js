// server.js
const express        = require('express');
const bodyParser     = require('body-parser');
const MsTranslator   = require('mstranslator');
const app            = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();

});

var api_key = "e16ddb32f10845689ba1de8177af7403";
var client = new MsTranslator({api_key: api_key});

const port = 8081;
app.listen(port, () => {
  console.log('Server running on port ' + port);
});

// Translate 
app.post('/api/translate/', (req, res) => {	
	var params = {
		text: req.body.text,
		from: req.body.from,
		to: req.body.to
	};
	
	client.initialize_token(function(){
		client.translate(params, function(err, data) {
			if (err) console.log('error:' + err.message);
			console.log(data);
			res.send(data);
			// process.exit();
		});
	});

});

app.get('/api/language/', (req, res) => {
	client.initialize_token(function(){
		client.getLanguagesForTranslate(function(err, languageCodes) {
			if (err) console.log('error:' + err.message);
			// console.log(languageCodes);
			var params = {locale: 'en', languageCodes: languageCodes};
			client.getLanguageNames(params, function(err, languageNames) {
				var data = {
					names: languageNames,
					codes: languageCodes
				}
				console.log(data);
				res.json(data);
			});
			// process.exit();
		});
	});
});

app.post('/api/language/', (req, res) => {
	client.initialize_token(function(){
		var langauges = "[\"${req.body.code}\"]"
		var params = {locale: req.body.code, languageCodes: req.body.code};
		client.getLanguageNames(params, function(err, data) {
			console.log(data);
			res.json(data);
		});
		// process.exit();
	});
});