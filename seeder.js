const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");

/**
 * constants
 */
const uri = "mongodb://localhost:27017/disneyFilms";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("reviews").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      console.info("deleting collection");
      await db.collection("reviews").drop();
      await db.collection("users").drop();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your wine 🍷!!").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "disney_movies.json"), "utf8");
    await db.collection("reviews").insertMany(JSON.parse(data));

    /**
     * This perhaps appears a little more complex than it is. Below, we are
     * grouping the wine tasters and summing their total tastings. Finally,
     * we tidy up the output so it represents the format we need for our new collection
     */

    const wineTastersRef = await db.collection("reviews").aggregate([
      { $match: { user_name: { $ne: null } } },
      {
        $group: {
          _id: "$user_name",
          total_reviews: { $sum: 1 },
        },
      },
      {
        $project: {
          name: { $first: "$name" },
          tastings: "$total_reviews",
        },
      },
      { $set: { name: "$_id", _id: "$total_reviews" } },
    ]);
    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */
    const wineUsers = await wineUsersRef.toArray();
    await db.collection("users").insertMany(wineUsers);

    /** Our final data manipulation is to reference each document in the
     * tastings collection to a taster id
     */

    const updatedWineUsersRef = db.collection("users").find({});
    const updatedWineUsers = await updatedWineUsersRef.toArray();
    updatedWineUsers.forEach(async ({ _id, name }) => {
      await db.collection("reviews").updateMany({ user_name: name }, [
        {
          $set: {
            user_id: _id,

          },
        },
      ]);

      /**
       * we can get rid of region_1/2 off our root document, since we've
       * placed them in an array
       */

      /**
       * Finally, we remove nulls regions from our collection of arrays
       * */

      load.stop();
      console.info(
        `Wine collection set up! 🍷🍷🍷🍷🍷🍷🍷 \n I've also created a tasters collection for you 🥴 🥴 🥴`
      );
      process.exit();
    });
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();