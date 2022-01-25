const Commando = require('discord-akairo');
const db = require('quick.db');

module.exports = class Command extends Commando.Command {
	constructor(client) {
		super('loop', {
			aliases: ['loop', 'lp', 'repeat'],
			category: 'music',
			channel: 'guild',
			description: 'Toggle between loop modes.',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{
					id: 'loopmode',
					prompt: {
						start: 'Which mode do you want to choose? Available modes are **track** and **queue**.'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { loopmode }) {		
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

		if (loopmode.toLowerCase() === 'queue') {
			if (queue.repeatMode) {
				queue.setRepeatMode(0);
				return message.channel.send(`${this.client.emotes.success} - Queue repeat mode **disabled**!`);
			} else {
				queue.setRepeatMode(2);
				return message.channel.send(`${this.client.emotes.success} - Queue repeat mode **enabled**!`);
			}
		} else if (loopmode.toLowerCase() === 'track') {
			if (queue.repeatMode) {
				queue.setRepeatMode(0);
				return message.channel.send(`${this.client.emotes.success} - Track repeat mode **disabled**!`);
			} else {
				queue.setRepeatMode(1);
				return message.channel.send(`${this.client.emotes.success} - Track repeat mode **enabled**!`);
			}
		} else if (loopmode.toLowerCase() === 'off') {
			if (queue.repeatMode == 1) {
				queue.setRepeatMode(0);
				return message.channel.send(`${this.client.emotes.success} - Track repeat mode **disabled**!`);
			}
			if (queue.repeatMode == 2) {
				queue.setRepeatMode(0);
				return message.channel.send(`${this.client.emotes.success} - Queue repeat mode **disabled**!`);
			}

			queue.setRepeatMode(0);
			return message.channel.send(`${this.client.emotes.success} - Repeat mode **disabled**!`);
		}
	}
};
