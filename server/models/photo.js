var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new mongoose.Schema ({
	name: String,
	height: Number,
	width: Number,
	edit_height: Number,
	edit_width: Number,
	edited: { type: Boolean, default: false },
	created_at: Date
});

module.exports = mongoose.model('Photo', PhotoSchema);