const Commando = require('discord-akairo');
const db = require('quick.db');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('disconnect', {
			aliases: ['disconnect', 'dis', 'leave'],
			category: 'music',
			channel: 'guild',
			description: 'Disconnects from current voice channel.',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
		});
	}

	async exec(message) {		
		if (!message.guild.me.voice.channel)
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("I'm not in any voice channels!", message)}`);

		if (db.get(`${message.guild.id}.queueCreator`) !== message.author.id) {
			if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.roles.cache.some(role => role.name == 'DJ')) {
				return message.reply(`${this.client.emotes.error} - This command is for the user who created this queue or users who have the DJ role only.`);
			}

			return message.reply(`${this.client.emotes.error} - This command is for the user who created this queue or users who have the DJ role only.`);
		}

		const success = await message.guild.me.voice.channel.leave();

		if (success) message.channel.send(`${this.client.emotes.success} - I have been **disconnected** from this channel!`);
	}
};
