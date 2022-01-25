const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor(client) {
		super('kick', {
			aliases: ['kick'],
			category: 'moderation',
			channel: 'guild',
			description: 'Kicks some rule-breakers.',
			args: [
				{
					id: 'member',
					prompt: {
						start: 'Which user do you want to kick?'
					},
					type: 'member',
				},
				{
					key: 'reason',
					prompt: {
						start: 'For what reason?'
					},
					type: 'rest',
					default: 'No reason provided',
				},
			],
			clientPermissions: ['KICK_MEMBERS'],
			userPermissions: ['KICK_MEMBERS'],
		});
	}

	async exec(message, { member, reason }) {
		if (message.member.roles.highest.position <= member.roles.highest.position) {
			return message.reply(`${this.client.emotes.error} -${await this.client.language("You can't ban that user because you either have the same role or your role is lower than that user!", message)}`);
		}

		member
			.kick(reason)
			.then(async () => {
				message.reply(`${this.client.emotes.success} - ${await this.client.language(`Kicked **${member.user.tag}** for:`, message)}\n\`\`\`js\n${reason}\n\`\`\``);
			})
			.catch((err) => {
				return message.channel.send(`${this.client.emotes.error} - **ERROR**\n\`\`\`js\n${err}\n\`\`\``);
			});
	}
};
