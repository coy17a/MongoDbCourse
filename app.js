const express = require('express'),
	app = express(),
	engines = require('consolidate'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

MongoClient.connect(
	'mongodb://localhost:27017',
	{ useNewUrlParser: true },
	(err, client) => {
		let db = client.db('races');
		assert.equal(null, err);
		console.log('Successfully connected to MongoDb');
		app.get('/', (req, res) => {
			db.collection('tri')
				.find({})
				.toArray((err, docs) => {
					res.render('home', {'tri': docs});
					// res.send(docs)
				});
		});

		app.use((req, res) => {
			res.sendStatus(404);
		});

		var server = app.listen(3000, () => {
			var port = server.address().port;
			console.log(`Express server listening on port ${port}`);
		});
	}
);
