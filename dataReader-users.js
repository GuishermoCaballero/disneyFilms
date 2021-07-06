const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const commaNumber = require("comma-number");

/**constants */
const url = "mongodb://localhost:27017";
const dbName = "disneyFilms";
const collectionName = "users";
const fileName = "users.json";
const client = new MongoClient(url, { useNewUrlParser: true });

async function main() {
    try {
        const start = Date.now();
        await client.connect();
        console.log("connected to database server");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        const filmsData = await fs.readFile(fileName, "utf-8");
        await collection.insertMany(JSON.parse(filmsData));
         const count =await collection.find().count();
         console.log(`there are ${commaNumber(count)} records. This tooks ${(Date.now()-start)/1000} seconds `);
        console.log(filmsData);

        process.exit();

    } catch (error) {
        console.log("juanito");
        print(error);
    }
}

main();