const Commando = require('discord-akairo');
const db = require('quick.db');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('jump', {
			aliases: ['jump'],
			category: 'music',
			channel: 'guild',
			description: 'Jump to the song position in the queue. The next one is 1, 2,... The previous one is -1, -2,...',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{
					id: 'position',
					prompt: {
						start: 'Which song position in the queue do you want to jump to?'
					},
					type: 'integer',
				},
			],
		});
	}

	async exec(message, { position }) {		
		const queue = this.client.player.getQueue(message.guild.id);

		if (!message.member.voice.channel) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not connected in any voice channel!", message)}`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not in the same voice channel!", message)}`);

		if (!queue) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("No music is currently playing!", message)}`);

		if (db.get(`${message.guild.id}.queueCreator`) !== message.author.id) {
			if (!message.member.hasPermission("ADMINISTRATOR") || !message.member.roles.cache.some(role => role.name == 'DJ')) {
				return message.reply(`${this.client.emotes.error} - This command is for the user who created this queue or users who have the DJ role only.`);
			}

			return message.reply(`${this.client.emotes.error} - This command is for the user who created this queue or users who have the DJ role only.`);
		}

		const success = await queue.jump(position);

		if (success) message.reply(`${this.client.emotes.success} - Jumped to **${queue.songs[position].name}**!`);
	}
};
