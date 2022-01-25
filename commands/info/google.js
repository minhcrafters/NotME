const googleIt = require('google-it');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('google', {
			aliases: ['google', 'gg'],
			category: 'info',
			description: 'Google it.',
			args: [
				{
					id: 'query',
					prompt: {
						start: "What do you want to search?"
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { query }) {
		const embed = new MessageEmbed().setTitle((await this.client.language('Google Search Results', message))).setColor(this.client.config.discord.accentColor).setTimestamp();

		googleIt({ query: query })
			.then((results) => {
				results.forEach(function (item, index) {
					embed.addField(index + 1 + ': ' + item.title, '<' + item.link + '>');
				});

				return message.reply({ embeds: [embed] });
			})
			.catch((e) => {
				return message.reply(`\`\`\`js\n${e}\n\`\`\``);
			});
	}
};
