const Commando = require('discord-akairo');
const ms = require('ms');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('mute', {
			aliases: ['mute', 'timeout'],
			category: 'moderation',
			channel: 'guild',
			description: 'Mutes (timeouts) some annoying users.',
			args: [
				{
					id: 'member',
					prompt: {
						start: 'Which user do you want to mute?'
					},
					type: 'member',
				},
				{
					id: 'timeout',
					type: 'string',
					default: '3d 2h',
				},
				{
					id: 'reason',
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

	async exec(message, { member, timeout, reason }) {
		if (message.member.roles.highest.position <= member.roles.highest.position) {
			return message.reply(`${this.client.emotes.error} -${await this.client.language("You can't mute that user because you either have the same role or your role is lower than that user!", message)}`);
		}

		member
			.timeout(ms(timeout), reason)
			.then(async () => {
				return message.reply(`${this.client.emotes.success} - ${await this.client.language(`Muted **${member.user.tag}** for:`, message)}\n\`\`\`js\n${reason}\n\`\`\``);
			})
			.catch((err) => {
				return message.channel.send(`${this.client.emotes.error} - **ERROR**\n\`\`\`js\n${err}\n\`\`\``);
			});
	}
};
