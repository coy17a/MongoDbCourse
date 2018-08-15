const express = require('express'),
	MongoClient = require ('mongodb').MongoClient,
	engines = require ('consolidate'),
	assert = require ('assert'),
	bodyParser = require('body-parser');
      
const app = express();


//setup view engines using nunkucks 
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));

// Neeed to add bodyParser to get the body from the form
app.use(bodyParser.urlencoded({extended:true}));

const urldb='mongodb://localhost:27017'; 

MongoClient.connect(
	urldb,
	{useNewUrlParser: true},
	(err,client)=>{
		let db = client.db('races');
		assert.equal(null, err);
		console.log('Succesfully connected to MongoDb');
		app.get('/', (req,res)=>{
			db.collection('tri').find({}).toArray((err,docs)=>{
				assert.equal(null, err);
				res.render('home',{'tri':docs});
			});

		});
		app.get('/new',(req,res)=>{
			res.render('new');
		});
		app.post('/new',(req,res)=>{
			let title= req.body.title;
			let year= req.body.year;
			db.collection('tri').insertOne({'title':title, 'year':year});
			res.redirect('/');
		});
		let server = app.listen(8000, ()=>{
			var port = server.address().port;
			console.log(`express server listening on port ${port}`);
		});
	}
);


