const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('calculate', {
			aliases: ['calculate', 'calc'],
			category: 'math',
			description: 'Calculates a non-algebra expression.',
		});
	}

	async exec(message, args) {
		if (!args) {
			return await this.client.weky.Calculator({
				message: message,
				embed: {
					title: (await this.client.language(`${message.author.username}'s Calculator`, message)),
					color: this.client.config.discord.accentColor,
					footer: (await this.client.language('a normal calculator', message)),
					timestamp: true,
				},
				disabledQuery: (await this.client.language('Calculator is disabled!', message)),
				invalidQuery: (await this.client.language('The provided equation is invalid!', message)),
				othersMessage: 'Only <@{{author}}> can use the buttons!',
			});
		}

		let response;

		try {
			response = math.round(math.evaluate(args), 2);
		} catch (err) {
			return message.channel.send(`${this.client.emotes.error} - **ERROR** \`\`\`js\n${err}\n\`\`\``);
		}

		const embed = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setTitle((await this.client.language('Math Expressions Calculation', message)))
			.addFields(
				{
					name: 'Input',
					value: `\`\`\`js\n${args}\n\`\`\``,
					inline: false,
				},
				{
					name: 'Output',
					value: `\`\`\`js\n${response}\`\`\``,
					inline: false,
				}
			)
			.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send({ embeds: [embed] });
	}
};
