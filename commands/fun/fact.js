const Random = require('srod-v2');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('fact', {
			aliases: ['fact'],
			category: 'fun',
			description: 'Get some fact.',
			args: [
				{
					id: 'today',
					match: 'flag',
                    flag: '--today'
				}
			]
		});
	}

	async exec(message, args) {
		const response = await fetch('https://uselessfacts.jsph.pl/today.json?language=en');
		const data = await response.json();
		const response1 = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
		const data1 = await response1.json();

		const embed = new MessageEmbed();

		if (!args) {
			embed
				.setTitle((await this.client.language('Random Fact', message)))
				.setDescription(data1.text)
				.setColor(this.client.config.discord.accentColor);
		} else if (args.today) {
			embed
				.setTitle((await this.client.language('Today\'s Fact', message)))
				.setDescription(data.text)
				.setColor(this.client.config.discord.accentColor);
		}

		message.channel.send({ embeds: [embed] });
	}
};
