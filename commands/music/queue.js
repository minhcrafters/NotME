const Commando = require('discord-akairo');
const Pagination = require('discord-paginationembed');
const { MessageEmbed } = require('discord.js');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			category: 'music',
			channel: 'guild',
			description: 'Shows the guild queue list.',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
		});
	}

	async exec(message) {
		const queue = this.client.player.getQueue(message.guild.id);

		if (!message.member.voice.channel) return message.channel.send(`${this.client.emotes.error} - You're not connected in any voice channel!`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`${this.client.emotes.error} - You're not in the same voice channel!`);

		if (!queue) return message.channel.send(`${this.client.emotes.error} - No songs are currently playing!`);

		const embeds = [];

		let k = 10;

		for (let i = 0; i <= queue.songs.length; i += 10) {
			const current = queue.songs.slice(i, k);

			let j = i;
			k += 10;

			const info = current.map((track) => `**#${++j}** - [${track.name}](${track.url}) by [${track.uploader.name}](${track.uploader.url}) - \`[${track.formattedDuration}]\` (Requested by: ${track.user.tag})`).join('\n');

			const embed = new MessageEmbed()
				.setAuthor(`${message.guild.name} - ${queue.repeatMode ? 'Looped ' : ''}Guild Queue ${this.client.emotes.queue}`, message.guild.iconURL())
				.setDescription(`**Now Playing:**\n[${queue.songs[0].name}](${queue.songs[0].url}) by [${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})\n**Requested by:** ${queue.songs[0].user.tag}\n\n**Queue Size:** ${queue.songs.length} song(s)\n\n${info}`)
				.setColor(this.client.config.discord.accentColor)
				.setTimestamp();

			embeds.push(embed);
		}

		// `**${message.guild.name} - ${queue.repeatMode ? 'Looped ' : ''}Guild Queue ${this.client.emotes.queue}**\n\n` +
			// 	(queue.songs
			// 		.map((track, i) => {
			// 			return `**#${i + 1}** - __${track.name}__ by __${track.uploader.name}__ - \`[${track.formattedDuration}]\` (Requested by: ${track.user.tag})`;
			// 		})
			// 		.slice(0, 5)
			// 		.join('\n') +
			// 		`\n\n${
			// 			queue.songs.length > 5 ? `And **${queue.songs.length - 5}** other songs (In total of **${queue.songs.length}** songs)...` : `Total **${queue.songs.length}** song(s) queued...`
			// 		}`)

		const embed = new Pagination.Embeds()
			.setArray(embeds)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setPageIndicator('footer', 'hybrid')
			.setPage(1)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.build();

		return message.reply(embed);
	}
};
