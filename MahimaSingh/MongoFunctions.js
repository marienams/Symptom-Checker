//require('/MongoFunctions.js');
const uri = "mongodb+srv://teamblue:teamblue@cluster0.ezeqtyg.mongodb.net/?retryWrites=true&w=majority"
const {MongoClient}  = require('mongodb');


const client = new MongoClient(uri);


module.exports = {
    updateValue : async (NameString, TestArray) => {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("Hosp_management");
        const dbcol = db.collection("patients");
        
        const result = await dbcol.updateOne(
            {Fname: NameString}, 
            {$set:{test: TestArray}});
        
        
        console.log(`${result.matchedCount} documents were matched`);
        console.log(`${result.modifiedCount} document were updated`);
        
        const result1 = await dbcol.findOne(

            { Fname: NameString }
      
          );
        console.log(result1);
        //return result;
    }
}





