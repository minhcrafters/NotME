const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('will-you-press-the-button', {
			aliases: ['will-you-press-the-button', 'wyptb', 'button-press', 'yes-or-no'],
			category: 'games',
			channel: 'guild',
			description: 'Will you press the button?',
		});
	}

	async exec(message) {
		await this.client.weky.WillYouPressTheButton({
			message: message,
			embed: {
				title: (await this.client.language('Will you press the button?', message)),
				description: `\`\`\`{{statement1}}\`\`\`\n**${await this.client.language('BUT', message)}**\n\n\`\`\`{{statement2}}\`\`\``,
				color: this.client.config.discord.accentColor,
				footer: 'just a game',
				timestamp: true,
			},
			button: { yes: (await this.client.language('Yes', message)), no: (await this.client.language('No', message)) },
			thinkMessage: (await this.client.language("I'm thinking", message)),
			othersMessage: (await this.client.language('Only <@{{author}}> can use the buttons!', message)),
		});
	}
};
