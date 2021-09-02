const discord = require('discord.js-selfbot');
const fs = require('fs');

const bot = new discord.Client();

var invites = {};

bot.on('ready', () => {
	console.log('Exporting invites');
	var cooldown = 1000;
	bot.guilds.cache.forEach(async (e, i) => {
		setTimeout(() => {
			cooldown = cooldown + 1000;
			let server = bot.guilds.cache.get(e.id);
			let channel = server.channels.cache.filter(c => c.type === 'text').find(x => x.position === 0);
			let invite = await channel.createInvite({ maxAge: 0 }).catch((e) => {
				console.log(`Invite in ${server.name} failed to create`);
			});
			invites[server.id] = `https://discord.gg/${invite.code}`;
			fs.writeFile('invites.json', JSON.stringify(invites), (err) => {
				if (err) throw err;
				console.log(`Success writing ${server.name}`);
			});
		}, cooldown);
	});
});

fs.readFile(__dirname + "/config.json", (err, data) => {
	if (err) throw err;
	if (data) {
		try {
			var a = JSON.parse(data);
			if (a.token) {
				bot.login(a.token);
			} else {
				throw 'Please add a token to config.json';
			}
		} catch (e) {
			throw 'Invalid JSON file';
		}
	}
});