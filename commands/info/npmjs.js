const fetch = require('node-fetch');
const Discord = require('discord.js');
const Commando = require('discord-akairo');
const Pagination = require('discord-paginationembed');
const moment = require('moment');

function isIsoDate(str) {
	if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
	var d = new Date(str);
	return d.toISOString() === str;
}

module.exports = class Command extends Commando.Command {
	constructor() {
		super('npmjs', {
			aliases: ['npmjs', 'npm'],
			category: 'info',
			description: 'Get a npm package\'s information.',
			args: [
				{
					id: 'npm_package',
					prompt: {
						start: 'What package do you like to search?'
					},
					type: 'string'
				}
			],
			// clientPermissions: ['MANAGE_MESSAGES']
		});
	}

	async exec(message, { npm_package }) {
		var npm_package1 = encodeURIComponent(npm_package.replace(' ', '+'));
		let data = await fetch(`https://www.npmjs.com/search/suggestions?q=${npm_package1}`);
		let responses = await data.json();

		const embeds = [];

		try {
			if (responses.length == 0) {
				return message.reply(`${this.client.emotes.error} - This package doesn\'t exist!`);
			} else if (responses.length >= 2) {
				responses.forEach((response) => {  
					const embed1 = new Discord.MessageEmbed()

					if (response.name) {
						embed1.setTitle(response.name);
					} else {
						embed1.setTitle(npm_package);
					}

					for (const [key, value] of Object.entries(response)) {
						if (typeof value == 'object' && isNaN(Object.keys(value))) {
							const keys = [];
							for (const [key1, value1] of Object.entries(value)) {
								if (value1.toString().startsWith('http')) {
									keys.push(`[${this.client.functions.toTitleCase(key1).replace('Npm', 'NPM')}](${value1})`);
								} else {
									if (typeof value1 == 'object' && isNaN(Object.keys(value1))) {
										for (const value2 of Object.keys(value1)) {
											if (typeof value2 == 'object' && isNaN(Object.keys(value2))) {
												for (const value3 of Object.keys(value2)) {
													keys.push(`${value3}`);
												}
											} else {
												keys.push(`${value2}`);
											}
										}
									} else {
										keys.push(`${value1}`);
									}
								}
							}
							embed1.addField(this.client.functions.toTitleCase(key), keys.join('\n'), false);
						} else {
							if (isIsoDate(value)) {
								embed1.addField(this.client.functions.toTitleCase(key), `<t:${moment(value).unix()}> (<t:${moment(value).unix()}:R>)`, false);
							} else {
								embed1.addField(this.client.functions.toTitleCase(key), value, true);
							}
						}
					}

					embeds.push(embed1);
				});
			} else {
				const embed1 = new Discord.MessageEmbed()

				if (responses[0].name) {
					embed1.setTitle(responses[0].name);
				} else {
					embed1.setTitle(npm_package);
				}

				for (const [key, value] of Object.entries(responses[0])) {
					if (typeof value == 'object' && isNaN(Object.keys(value))) {
						const keys = [];
						for (const [key1, value1] of Object.entries(value)) {
							if (value1.toString().startsWith('http')) {
								keys.push(`[${this.client.functions.toTitleCase(key1).replace('Npm', 'NPM')}](${value1})`);
							} else {
								if (typeof value1 == 'object' && isNaN(Object.keys(value1))) {
									for (const value2 of Object.keys(value1)) {
										if (typeof value2 == 'object' && isNaN(Object.keys(value2))) {
											for (const value3 of Object.keys(value2)) {
												keys.push(`${value3}`);
											}
										} else {
											keys.push(`${value2}`);
										}
									}
								} else {
									keys.push(`${value1}`);
								}
							}
						}
						embed1.addField(this.client.functions.toTitleCase(key), keys.join('\n'), false);
					} else {
						if (isIsoDate(value)) {
							embed1.addField(this.client.functions.toTitleCase(key), `<t:${moment(value).unix()}> (<t:${moment(value).unix()}:R>)`, false);
						} else {
							embed1.addField(this.client.functions.toTitleCase(key), value, true);
						}
					}
				}

				return message.reply({ embeds: [embed1] });
			}
		} catch (err) {
			return message.reply(`${this.client.emotes.error} - Something went wrong while trying to fetch data: \`\`\`js\n${err}\n\`\`\``);
		}

		const embed = new Pagination.Embeds()
			.setArray(embeds)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setPageIndicator('footer', 'hybrid')
			.setPage(1)
			.setColor(this.client.config.discord.accentColor)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setThumbnail('https://authy.com/wp-content/uploads/npm-logo.png')
			.build()
			.catch((err) => {
        		if (err) message.channel.send('I do not have the required permissions to create a paginated embed here.');
				console.log(err.message);
    		});

		return message.reply({ embeds: [embed] });
	}
};
