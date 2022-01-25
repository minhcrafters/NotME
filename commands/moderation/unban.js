const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('unban', {
			aliases: ['unban'],
			category: 'moderation',
			channel: 'guild',
			description: 'Unbans someone.',
			args: [
				{
					id: 'member',
					prompt: {
						start: 'Which user do you want to unban? (userID)'
					},
					type: 'rest',
				},
			],
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
		});
	}

	async exec(message, { member }) {
		const id = member;

		if (!id) {
			return message.reply(`${this.client.emotes.error} - ${await this.client.language('Unable to find this user!', message)}`);
		}

		const bannedMembers = await message.guild.fetchBans();

		if (!bannedMembers.find((user) => user.user.id === id)) {
			return message.reply(`${this.client.emotes.error} - ${await this.client.language('That user is already unbanned!', message)}`);
		}

		message.guild.members.unban(id);
		message.reply(`${this.client.emotes.success} - ${await this.client.language('Unbanned user!', message)}`);
	}
};
