//require('/MongoFunctions.js');
const uri = "mongodb+srv://user:qwertzuiop@cluster0.lq45h8c.mongodb.net/?retryWrites=true&w=majority"
const {MongoClient}  = require('mongodb');


const client = new MongoClient(uri);


module.exports = {
    updateValue : async (valueString, valueInt) => {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("sample_airbnb");
        const dbcol = db.collection("listingsAndReviews");
        const result = await dbcol.updateOne({name: valueString}, {$set:{minimum_nights: valueInt}})
        //const result = await client.db("sample_airbnb").collection("listingsAndReviews").
        //updateOne({name : valueString}, { beds: valueInt});
        
        console.log(`${result.matchedCount} documents were matched`);
        console.log(`${result.modifiedCount} document were updated`);
        //return result;
    }
}



async function main(){

    try {
        await client.connect();

        //await listDatabases(client);

        //await updateListingByName("10006546",
        //{bedrooms: 2, beds: 2});


    }
    catch (e){
        console.error(e);
    }
    finally {
        await client.close();
    }

}

main().catch(console.error);

//UPDATE FUNCTION
async function updateListingByName( nameOfListing, updatedListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").
    updateOne({name : nameOfListing}, { beds: updatedListing});

    console.log(`${result.matchedCount} documents were matched`);
    console.log(`${result.modifiedCount} document were updated`);
    console.log(result);
}


/*async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}*/

