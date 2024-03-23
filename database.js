const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://rokmc1256:hoseo19@cluster0.ljpssec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const connectDB = new MongoClient(url).connect()

module.exports = connectDB