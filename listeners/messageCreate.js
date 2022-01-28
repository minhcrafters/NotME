const { Listener } = require('discord-akairo');
const fetch = require('node-fetch');
const db = require('quick.db');
const functions = require('../utils/functions');

const startDelim = 'tex$';
const endDelim = '$';

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function Replacer(string) {
	return string.replace(/<br>/g, '').replace(/<i>/g, '**').replace(/<\/i>/g, '**').replace(/<i\/>/g, '**').replace(/<tip>/g, '_').replace(/<\/tip>/g, '_').replace(/<tip\/>/g, '_');
}

module.exports = class MessageListener extends Listener {
    constructor() {
        super('messageCreate', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

	async exec(message) {
		if (message.author.bot) return;

		const bankBalance = await this.client.economy.get(message.author.id, 'bank');
		const walletBalance = await this.client.economy.get(message.author.id, 'wallet');

		if (bankBalance <= 0 || Number(bankBalance) >= (await this.client.economy.getBankLimit(message.author.id))) await this.client.economy.reset(message.author.id, 'bank');
		if (walletBalance <= 0 || Number(walletBalance) >= (await this.client.economy.getBankLimit(message.author.id))) await this.client.economy.reset(message.author.id, 'wallet');

		if (message.guild) {	
			const key = `${message.guild.id}-${message.author.id}`;

			this.client.points.ensure(`${message.guild.id}-${message.author.id}`, {
				user: message.author.id,
				guild: message.guild.id,
				points: 0,
				level: 0,
			});

			this.client.points.inc(key, 'points');

			const curLevel = Math.floor(0.1 * Math.sqrt(this.client.points.get(key, 'points')));

			if (this.client.points.get(key, 'level') < curLevel) {
				message.channel.send((await this.client.language(`Congratulations ${message.author}, You've leveled up to level **${curLevel}**! (This message will be deleted in 5 seconds!)`, message))).then(m => setTimeout(() => m.delete(), 5000));
				this.client.points.set(key, curLevel, 'level');
			}

			// if (message.guild.id == '792416429198409738') {
			// 	// if (this.client.isOwner(message.author) || message.guild.members.cache.some(member => member.user.id == '723102789487820800')) {
			// 	if (message.member.roles.cache.some(role => role.id === '917318458360889394')) {
			// 		console.log('Prison detected. Trying to move out in 3 seconds...');
			// 		sleep(3000);
			// 		message.member.roles.remove(message.guild.roles.cache.find(role => role.id === '917318458360889394'));
			// 		message.member.roles.add(message.guild.roles.cache.find(role => role.id === '806070624573325313'));
			// 		console.log('Moved out successfully.');
			// 	}
			// 	// }
			// }

			if (!db.has(`${message.guild.id}`)) {
				db.set(`${message.guild.id}`, {});
			}

			if (!db.has(`${message.guild.id}.queueCreator`)) {
				db.set(`${message.guild.id}.queueCreator`, null);
			}

			if (!db.has(`${message.guild.id}.musicFilters`)) {
				db.set(`${message.guild.id}.musicFilters`, []);
			}

			const database = db.get(`${message.guild.id}`);

				if (message.content.includes(startDelim) && message.content.includes(endDelim)) {
					const texStrings = message.content.split(startDelim);

					if (texStrings.length !== 1) {
						texStrings.shift();

						const promises = texStrings.map((elem) => {
							const end = elem.indexOf(endDelim),
								tex = elem.slice(0, end);
							return functions.typeset(tex);
						});

						return Promise.all(promises)
							.then((images) => {
								functions.attachImages(message.channel, images, 'LaTeX:');
							})
							.catch((err) => {
								message.reply(`${this.client.emotes.error} - **LaTeX Error**\n\`\`\`js\n${err}\n\`\`\``);
							});
					}
				} else {
					if (message.content == '' || message.content.includes('hmm')) return;

					var options = {
						method: 'GET',
						url: 'https://random-stuff-api.p.rapidapi.com/ai',
						params: {
							msg: message.content,
							bot_name: 'NotME',
							bot_gender: 'male',
							bot_master: 'minhcrafters',
							bot_age: '10',
							bot_company: 'minhcrafters',
							bot_location: 'Vietnam',
							bot_build: 'Public',
							bot_birth_year: '2021',
							bot_birth_date: '8th August, 2021',
							bot_birth_place: 'Vietnam',
							bot_favorite_color: 'Old Discord Blurple',
							bot_favorite_book: 'Harry Potter',
							bot_favorite_band: 'Imagine Doggos',
							bot_favorite_artist: 'Eminem',
							bot_favorite_actress: 'Emma Watson',
							bot_favorite_actor: 'Jim Carrey',
							id: message.author.id,
						},
						headers: {
							authorization: process.env.RSA_KEY,
							'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
							'x-rapidapi-key': process.env.RAPID_KEY
						}
					};

					let channel;

					if (db.has(`${message.guild.id}.chatbotChannel`) && db.get(`${message.guild.id}.chatbotChannel`) !== '') {
						channel = message.guild.channels.cache.get(database.chatbotChannel);

						if (channel && message.channel.type !== 'dm') {
							if (channel.id !== message.channel.id) return;

							axios
								.request(options)
								.then(async (response) => {
									await message.channel.sendTyping();

									await sleep(functions.randint(500, 2500));

									console.log(response.data);

									const { AIResponse } = response.data;

									return message.reply(Replacer(AIResponse));
								})
								.catch((err) => {
									return console.error(err);
								});
						}
					}
				}
		}

		// const data = db.get(`${message.guild.id}`);

		// let prefix = prefix1.getPrefix(message.guild.id);
		// if (!prefix) prefix = this.client.config.discord.prefix;

		// this.client.prefix = prefix;

		// if (!message.content.startsWith(prefix)) {
		// 	if (message.mentions.has(this.client.user)) {
		// 		const args = functions.parseQuotes(message.content.slice((this.client.user.toString() + ' ').length).trim());

		// 		logger.log(args);

		// 		const command = args.shift().toLowerCase();

		// 		logger.log(command);

		// 		const cmd = this.client.commands.get(command) || this.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

		// 		if (cmd) {
		// 			if (cmd.ownerOnly === true && cmd.ownerOnly !== null && message.author.id !== this.client.config.discord.ownerID) {
		// 				return message.channel.send(`${message.this.client.emotes.error} - This command is for developers only!`);
		// 			}

		// 			cmd.async run(this.client, message, args);
		// 		}
		// 	} else {
		//		insert commands here
		// 	}
		// } else {
		// 	const args = functions.parseQuotes(message.content.slice(prefix.length).trim());

		// 	logger.log(args);

		// 	const command = args.shift().toLowerCase();

		// 	logger.log(command);

		// 	const cmd = this.client.commands.get(command) || this.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

		// 	if (cmd) {
		// 		if (cmd.ownerOnly === true && cmd.ownerOnly !== null && message.author.id !== this.client.config.discord.ownerID) {
		// 			return message.channel.send(`${message.this.client.emotes.error} - This command is for developers only!`);
		// 		}

		// 		cmd.async run(this.client, message, args);
		// 	}
		// }
	}
}