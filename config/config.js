var config = {};
config.aws = {};
config.mongodb = {};
config.web = {};

config.aws.access_key = process.env.AWS_ACCESS_KEY;
config.aws.secret_key = process.env.AWS_SECRET_KEY;
config.aws.s3_bucket = process.env.S3_BUCKET;
config.mongodb.uri = process.env.MONGOLAB_URI || 'mongodb://heroku_app34619736:gs8bnujp4th6dtllbsb69rsjkt@dbh15.mongolab.com:27157/heroku_app34619736';
config.web.port = process.env.PORT || 5000;

module.exports = config;