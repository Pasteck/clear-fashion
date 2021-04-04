require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = `mongodb+srv://parth:eQBAE1gmfxnODEmN@clearcluster.egopx.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': 0
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.findByBrand = async brand => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({brand:brand}).toArray();
    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};
  

module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.findLimited = async (query,l) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).limit(l).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find.limited..', error);
    return null;
  }
};

module.exports.findByPrice = async price => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({"price":{$lte:price}}).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.filterByPrice = async () => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find().sort({"price":-1}).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.findByLease = async lease => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({"lease":{$lte:lease}}).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.filterByLease = async () => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find().sort({"lease":-1}).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.findById = async id => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({'_id':id}).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.filteredProducts = async (limit, brand, price) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({'brand':brand,'price':{$lt:price}}).limit(limit).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};



/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};