var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new mongoose.Schema ({
	name: String,
	edited: { type: Boolean, default: false },
	created_at: Date
});

module.exports = mongoose.model('Photo', PhotoSchema);