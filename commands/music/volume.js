const Commando = require('discord-akairo');
const db = require('quick.db');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('volume', {
			aliases: ['volume'],
			category: 'music',
			channel: 'guild',
			description: 'Sets volume of a queue.',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{
					id: 'volume',
					prompt: 'What volume do you like to set?',
					type: Commando.Argument.range('integer', 1, 100),
				},
			],
		});
	}

	async exec(message, { volume }) {
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

		const success = queue.setVolume(volume);

		if (success) message.channel.send(`${this.client.emotes.success} - ${await this.client.language(`Volume set to **${volume}%**!`, message)}`);
	}
};
