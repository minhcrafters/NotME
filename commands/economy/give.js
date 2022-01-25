const Commando = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('give', {
			aliases: ['give', 'transfer'],
			category: 'economy',
			channel: 'guild',
			description: 'Give your money to someone else. (Notes are optional)',
			args: [
				{
					id: 'user',
					prompt: {
						start: 'Which user would you like to give?',
						retry: "That's an invalid user, try again."
					},
					type: 'member'
				},
				{
					id: 'amount',
					prompt: {
						start: 'How much money would you like to give to?',
						retry: "That's an invalid amount, try again."
					},
					type: 'integer'
				},
				{
					id: 'note_title',
					type: 'string',
					default: ''
				},
				{
					id: 'note_content',
					type: 'string',
					default: ''
				}
			]
		})
	}

	async exec(message, args) {
		var currentAmount = await this.client.economy.get(message.author.id, "bank");
		const transferAmount = args.amount;
		const transferTarget = args.user.user;

		currentAmount = parseInt(currentAmount);

		const embed = new MessageEmbed();

		if (!transferAmount || isNaN(transferAmount)) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`That's an invalid amount. Check your number and see if it's a number.`);

			return message.reply({ embeds: [embed] });
		}

		if (transferAmount <= 0) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Have you studied positive numbers yet?`);

			return message.reply({ embeds: [embed] });
		}

		if (transferAmount > currentAmount) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`You don't have enough money. Go work and get some.`);

			return message.reply({ embeds: [embed] });
		}

		const given = await this.client.economy.give(transferTarget.id, transferAmount, "bank");

		if (given == 'bank_limit') {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like the amount of money you trying to give is larger than the bank limit. Try again with a lower amount.`);
		}

		if (!given) {
			embed.setColor('RED');
			embed.setTitle('Uh oh!');
			embed.setDescription(`Looks like you don't have enough money. Work and get some.`);

			return message.reply({ embeds: [embed] });
		} else {
			embed.setColor('GREEN')
			embed.setTitle('Success!')
			embed.setDescription(`Successfully gave **${await this.client.economy.format(transferAmount)}** to **${transferTarget.tag}**. Their current bank balance is now **${await this.client.economy.format(given.bank)}**.`)
		}

		message.reply({ embeds: [embed] });

		if (given && given !== 'bank_limit') {
			if (args.note_title && typeof args.note_title == 'string') {
				const embed1 = new MessageEmbed();
				embed1.setColor(this.client.config.discord.accentColor);
				embed1.setAuthor(`${message.author.tag} gave you ${await this.client.economy.format(transferAmount)} with this little note...`);
				embed1.setTitle(args.note_title);
				embed1.setFooter(this.client.user.username);
				embed1.setTimestamp();
				if (args.note_content && typeof args.note_content == 'string') {
					embed1.setDescription(args.note_content);
				}

				transferTarget.send({ embeds: [embed1] });
			}
		}
	}
}