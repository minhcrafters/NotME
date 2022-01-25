const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('unmute', {
			aliases: ['unmute', 'untimeout'],
			category: 'moderation',
			channel: 'guild',
			description: 'Unmutes muted users.',
			argsType: 'multiple',
			args: [
				{
					id: 'member',
					prompt: {
						start: 'Which user do you want to unmute?'
					},
					type: 'member',
				},
			],
			clientPermissions: ['KICK_MEMBERS'],
			userPermissions: ['KICK_MEMBERS'],
		});
	}

	async exec(message, { member }) {
		if (message.member.roles.highest.position <= member.roles.highest.position) {
			return message.reply(`${this.client.emotes.error} -${await this.client.language("You can't unmute that user because you either have the same role or your role is lower than that user!", message)}`);
		}

		member
			.timeout(null)
			.then(async () => {
				message.reply(`${this.client.emotes.success} - ${await this.client.language(`Successfully unmuted **${member.user.tag}**!`, message)}`);
			})
			.catch((err) => {
				return message.reply(`${this.client.emotes.error} - **ERROR**\n\`\`\`js\n${err}\n\`\`\``);
			});
	}
};
