// const MongoClient = require("mongodb").MongoClient;
// let db = null;
// MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
//   if (err) {
//     console.log(err, "db connecting err");
//   }
//   console.log("db connect");
//   db = client.db("travelApp");
//   return db;
// });

// module.exports = db;

// async (module) => {
//   let db = null;
//   try {
//     client = await MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true });
//     db = client.db("travelApp");
//   } catch (err) {
//     console.log(err);
//   } finally {
//     module.exports = db;
//   }
// };
