const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('geturl', {
			aliases: ['url', 'geturl'],
			category: 'music',
			channel: 'guild',
			description: 'Get the URL of a playing song.',
		});
	}

	async exec(message) {
		const queue = this.client.player.getQueue(message.guild.id);

		if (!message.member.voice.channel) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not connected in any voice channel!", message)}`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not in the same voice channel!", message)}`);

		if (!queue) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("No music is currently playing!", message)}`);

		const track = queue.songs[0];

		message.react(this.client.emotes.success);

		return message.reply(track.url);
	}
};
