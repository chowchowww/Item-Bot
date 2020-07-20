const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
	appid: Number,
	bot_id: Number,
	custom_name: String,
	custom_price: Number,
	id: String,
	market_name: String,
	market_value: Number,
	name: String,
	stickers: Array,
	name_color: String,
	created: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Item', itemSchema);