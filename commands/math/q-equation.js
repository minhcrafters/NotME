const { MessageEmbed } = require('discord.js');
const mathjs = require('mathjs');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('q-equation', {
			aliases: ['q-equation', 'q-equ'],
			category: 'math',
			description: 'Calculates quadratic equations.',
			args: [
				{
					id: 'a',
					prompt: {
						start: 'Provide the first number.',
						retry: 'Invalid number!'
					},
					type: 'integer',
				},
				{
					id: 'b',
					prompt: {
						start: 'Provide the second number.',
						retry: 'Invalid number!'
					},
					type: 'integer',
				},
				{
					id: 'c',
					prompt: {
						start: 'Provide the third number.',
						retry: 'Invalid number!'
					},
					type: 'integer',
				},
			],
		});
	}

	async exec(message, { a, b, c }) {
		let root1, root2;

		let discriminant = b * b - 4 * a * c;

		if (discriminant > 0) {
			root1 = mathjs.round((-b + Math.sqrt(discriminant)) / (2 * a), 2);
			root2 = mathjs.round((-b - Math.sqrt(discriminant)) / (2 * a), 2);

			const embed = new MessageEmbed()
				.setColor(this.client.config.discord.accentColor)
				.setTitle((await this.client.language('Quadratic Equations Calculation', message)))
				.addFields(
					{ name: 'Input', value: '```js\n' + `${a}x^2 + ${b}x + ${c} = 0` + '\n```', inline: false },
					{ name: 'Output', value: `\`\`\`js\nx = {${root1}, ${root2}}\`\`\``, inline: false }
				)
				.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			return message.reply({ embeds: [embed] });
		} else if (discriminant == 0) {
			root1 = root2 = mathjs.round(-b / (2 * a), 2);

			const embed = new MessageEmbed()
				.setColor(this.client.config.discord.accentColor)
				.setTitle((await this.client.language('Quadratic Equations Calculation', message)))
				.addFields(
					{ name: 'Input', value: '```js\n' + `${a}x^2 + ${b}x + ${c} = 0` + '\n```', inline: false },
					{ name: 'Output', value: `\`\`\`js\nx = {${root1}, ${root2}}\`\`\``, inline: false }
				)
				.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			return message.reply({ embeds: [embed] });
		} else {
			let realPart = (-b / (2 * a)).toFixed(2);
			let imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);

			const embed = new MessageEmbed()
				.setColor(this.client.config.discord.accentColor)
				.setTitle((await this.client.language('Quadratic Equations Calculation', message)))
				.addFields(
					{ name: 'Input', value: '```js\n' + `${a}x^2 + ${b}x + ${c} = 0` + '\n```', inline: false },
					{ name: 'Output', value: `\`\`\`js\nx = {${realPart} + ${imagPart}i, ${realPart} - ${imagPart}i}\`\`\``, inline: false }
				)
				.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			return message.reply({ embeds: [embed] });
		}
	}
};
