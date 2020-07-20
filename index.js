const { Client } = require('discord.js');
const client = new Client();
const botConfig = require('./botConfig.json');
const mongoose = require('mongoose');
const itemModel = require('./models/item');
const fetch = require('node-fetch');

mongoose.connect(botConfig.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('Successful'))
	.catch(err => console.error('Error' + err));

mongoose.connection.on('connected', () => {
	console.log('Mongoose is connected !');
});


client.once('ready', () => {
	console.log(`${client.user.username} is online !`);

	client.user.setPresence({
		status: 'online',
		activity: {
			name: 'developing ...',
			type: 'LISTENING',
		},
	});
});

client.login(botConfig.token);

client.on('message', message => {
	if (message.content === 'start') {
		run(message);
	}
});
// itemModel.remove({}, () => console.log(true));

function run(message) {
	setInterval(function() {
		console.log('start fetching');
		fetch('https://csgoempire.com/api/v2/p2p/inventory/3', {
			method: 'GET',
			mode: 'cors',
			cache: 'default',
		})
			.then(res => res.json())
			.then(data => find(data, message))
			.catch(err => console.log(err));
	}, 8000);
}

function find(data = [], message) {
	for (let i = 0; i < data.length; i++) {
		itemModel.find({ id: data[i].id }, function(err, docs) {
			if (!docs.length) addNew(data[i], message);
		});
	}

	console.log(data.length);
	console.log('done fetching');
}

async function addNew(e, message) {
	const item = new itemModel({
		appid: e.appid,
		bot_id: e.bot_id,
		custom_name: e.custom_name,
		custom_price: e.custom_price,
		id: e.id,
		market_name: e.market_name,
		market_value: e.market_value,
		name: e.name,
		stickers: e.stickers,
		name_color: e.name_color,
	});

	item.save()
		.then(doc => {
			console.log(doc);
			doc[0].market_value > 10000 ? message.channel.send('```diff\n' + '- Name: ' + doc[0].name + ' | Price: ' + doc[0].market_value + '\n```') : message.channel.send(' Name: ' + doc[0].name + ' | Price: ' + doc[0].market_value);
		})
		.catch(err => console.error(err));
}
