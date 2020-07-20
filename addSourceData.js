const ItemModel = require('./models/item');

const data = require('./data.json');

data.map(e => {
	const item = new ItemModel({
		appid: e.appid,
		bot_id: e.bot_id,
		custom_name: e.custom_name,
		custom_price: e.custom_price,
		icon_url: e.icon_url,
		id: e.id,
		img: e.img,
		market_name: e.market_name,
		market_value: e.market_value,
		name: e.name,
		name_color: e.name_color,
		stickers: e.stickers,
		tradable: e.tradable,
		tradelock: e.tradelock,
		type: e.type,
		wear: e.wear,
	});

	item.save()
		.then(doc => console.log(doc))
		.catch(err => console.error(err));
});