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
                //DISPLAY VALUES OF DB PUSHED IN THE ARRAY    
                //console.log(record._fields[0].properties);
            });
            res.render('index', { //passing it to display
                symptoms: symptomArr
            });
            var firstInteger = symptomArr[2].symptomID;
            //console.log(firstInteger);
            var firstString = symptomArr[0].name;
            
            //console.log(firstString);
            //const updateProps = mongoFucntions.updateValue(firstString,firstInteger);
        })
        .catch(function(err){
            console.log(err);
        });
    //res.send('It works');
});



app.get("/result", function (req, res) {

    var pName = req.query.patient_name;

    var symptom = req.query.symptom_name;
    var symptom1 = req.query.symptom_name1;
    var symptom2 = req.query.symptom_name2;
    var symptom3 = req.query.symptom_name3;
    var result3;
   // var pName = req.query.patient_name;
    //var pName = "Shardul Sawant";
    //console.log("pname", pName);
    session
      .run(
        "MATCH (s:symptom) - [:HASSYMPTOM] - (d:disease) where s.name = $NameParam1 RETURN d",
        {
          NameParam1: symptom,
        }
      )
      .then(function (result1) {
        var d1 = [];     //FIRST DISEASE
        result1.records.forEach(function (record) {
          d1.push(record._fields[0].properties.title);
          //console.log("temp1", d1);
        });
        session
          .run(
            "MATCH (s1:symptom) - [:HASSYMPTOM] - (d1:disease) where s1.name = $NameParam2 RETURN d1",
            {
              NameParam2: symptom1,
            }
          )
          .then(function (result2) {
            var d2 = [];
            //   console.log("result", resu1.records);
            result2.records.forEach(function (record) {
              d2.push(record._fields[0].properties.title);
              //console.log("temp2", d2);
            });
  
            let result_ = final_disease(d1, d2);
            //console.log("result1", result_);
  
            session
              .run(
                "MATCH (s2:symptom) - [:HASSYMPTOM] - (d2:disease) where s2.name = $NameParam3 RETURN d2",
                {
                  NameParam3: symptom2,
                }
              )
              .then(function (result3) {
                var d3 = [];
                //   console.log("result", resu1.records);
                result3.records.forEach(function (record) {
                  d3.push(record._fields[0].properties.title);
                  //console.log("temp3", d3);
                });
  
                let result_1 = final_disease(result_, d3);
                //console.log("result2", result_1);
  
                session
                  .run(
                    "MATCH (s3:symptom) - [:HASSYMPTOM] - (d3:disease) where s3.name = $NameParam3 RETURN d3",
                    {
                      NameParam3: symptom3,
                    }
                  )
                  .then(function (result4) {
                    var d4 = [];
                    //   console.log("result", resu1.records);
                    result4.records.forEach(function (record) {
                      d4.push(record._fields[0].properties.title);
                      console.log("temp4", d4);
                    });
  
                    result_2 = final_disease(result_1, d4);
                    console.log("result3", result3);
                    console.log("result", result_2);                                                        //FINAL RESULT
                    const updateMedicine = mongoFucntions.updateValue(                                      //MONGO FUNCTION
                        pName,
                      result_2
                    );
                    res.render("result", {
                      final_disease: result_2,
                    });
                    
                  });
              });
          });
      })
  
      .catch(function (err) {
        console.log("err");
      });
  });

  const final_disease = (arr1, arr2) => {
    let output = [];
    arr1.forEach((e) => {
      let checkMedicine = arr2.includes(e);
      checkMedicine && output.push(e);
    });
    return output;
  };

app.listen(3000);
console.log('Server started on 3000');

module.exports -app;