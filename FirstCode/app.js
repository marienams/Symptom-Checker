//NEO4J
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');

//var MongoFunctions = require('MongoFunctions');
const mongoFucntions = require('./MongoFunctions');

var app = express();

//Viewing
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','qwertzuiop'));

var session = driver.session();

app.get('/', function(req,res){
    session
        .run('MATCH(n:symptom) RETURN n')
        .then(function(result){

            var symptomArr = [];

            result.records.forEach(function(record){

                symptomArr.push({ //array of symptoms
                    id: record._fields[0].identity.low,
                    symptomID: record._fields[0].properties.symptomID,
                    name: record._fields[0].properties.name
                })

                console.log(record._fields[0].properties);
            });
            res.render('index', { //passing it to display
                symptoms: symptomArr
            });
            var firstInteger = symptomArr[0].symptomID;
            console.log(firstInteger);
            var firstString = symptomArr[0].name;
            console.log(firstString);
            const updateProps = mongoFucntions.updateValue(firstString,firstInteger);
        })
        .catch(function(err){
            console.log(err);
        });
    //res.send('It works');
});

app.listen(3000);
console.log('Server started on 3000');

module.exports -app;