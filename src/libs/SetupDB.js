var MongoClient = require('mongodb').MongoClient;

process.env.db_addy = 'mongodb://dataviz:dataviz498@ds231951.mlab.com:31951/heroku_m48pfz1g'

class SetupDB{
  constructor(){
    this._db_addy = process.env.db_addy;
    this._db = null;
  }

  async init() {
    if(this._db){
      this._db.close();
      this._db = null;
    } 

    let db = await Promise.all([this.connect(this._db_addy)]);
    this._db = db;
    
    return db;
  }

  connect(url) {
    return MongoClient.connect(url,{useNewUrlParser: true, poolSize: 10}).then(client => client.db())
  }

  get db(){ return this._db }
}

module.exports = SetupDB