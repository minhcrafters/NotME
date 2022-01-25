const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class EightBall extends Commando.Command {
	constructor() {
		super('8ball', {
			aliases: ['8ball'],
			category: 'fun',
			description: 'magik 8-balls',
			args: [
				{
					id: 'text',
					prompt: {
						start: 'What do you want to know?',
						retry: 'Invalid.'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { text }) {
		var encodedText = encodeURIComponent(text);
		
		const response = await fetch(`https://8ball.delegator.com/magic/JSON/${encodedText}`);
		const { magic } = await response.json();

		const embed = new MessageEmbed()
			.setAuthor((await this.client.language('Magic 8-Ball', message)), this.client.user.displayAvatarURL())
			.addField('Question', magic.question, false)
			.addField('Answer', magic.answer, false)
			.setColor(this.client.config.discord.accentColor)
			.setFooter((await this.client.language(`Asked by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.reply({ embeds: [embed] });
	}
};
