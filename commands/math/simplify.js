const { MessageEmbed } = require('discord.js');
const mathjs = require('mathjs');

const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('simplify', {
			aliases: ['simplify', 'simp'],
			category: 'math',
			description: 'Simplifies expressions.',
			args: [
				{
					id: 'expression',
					prompt: {
						start: 'Provide a valid expression.',
						retry: 'Invalid expression!'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { expression }) {
		let solution;

		const rules = [
			{ l: 'n1*n3 + n2*n3', r: '(n1+n2)*n3' },
			{ l: 'n1*n3 - n2*n3', r: '(n1-n2)*n3' },
		];

		try {
			solution = mathjs.simplify(expression, rules);
		} catch {
			return message.channel.send(`${this.client.emotes.error} - Invalid expression!`);
		}

		const embed = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setTitle((await this.client.language('Simplify Expressions', message)))
			.addFields(
				{
					name: 'Input',
					value: '```js\n' + `${expression}` + '\n```',
					inline: false,
				},
				{
					name: 'Output',
					value: `\`\`\`js\n${solution}\n\`\`\``,
					inline: false,
				}
			)
			.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return message.reply({ embeds: [embed] });
	}
};
