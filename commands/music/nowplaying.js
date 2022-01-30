const { MessageEmbed } = require('discord.js');
const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');
const ms = require('ms');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('nowplaying', {
			aliases: ['now-playing', 'np'],
			category: 'music',
			channel: 'guild',
			description: 'Shows playing stats of a song as an embed.',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
		});
	}

	async exec(message) {
		const queue = this.client.player.getQueue(message.guild.id);

		if (!message.member.voice.channel) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not connected in any voice channel!", message)}`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not in the same voice channel!", message)}`);

		if (!queue) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("No music is currently playing!", message)}`);

		const track = queue.songs[0];

		let repeat_mode = '';

		console.log(track.name);
		console.log(track.uploader);
		console.log(track.user.username);
		console.log(track.views);
		console.log(track.duration);
		console.log(queue.volume);
		console.log(queue.repeatMode);

		if (queue.repeatMode === 0) {
			repeat_mode = await this.client.language('Off', message);
		} else if (queue.repeatMode === 1) {
			repeat_mode = await this.client.language('Track', message);
		} else if (queue.repeatMode === 2) {
			repeat_mode = await this.client.language('Queue', message);
		}

		if (queue.autoplay === true) {
			repeat_mode = await this.client.language('Auto-play', message);
		} else {
			repeat_mode = await this.client.language('Off', message);
		}

		const createProgressBar = (options = { timecodes: true, length: 15, indicator: '🔘', line: '▬' }) => {
			const length = typeof options.length === 'number' ? (options.length <= 0 || options.length === Infinity ? 15 : options.length) : 15;
			const index = Math.round(((queue.currentTime * 1000) / (track.duration * 1000)) * length);

			const indicator = typeof options.indicator === 'string' && options.indicator.length > 0 ? options.indicator : '🔘';
			const line = typeof options.line === 'string' && options.line.length > 0 ? options.line : '▬';

			// if (index >= 1 && index <= length) {
			const bar = line.repeat(length - 1).split('');
			bar.splice(index, 0, indicator);

			if (options.timecodes) {
				const timestamp = queue.formattedCurrentTime;
				const end = track.formattedDuration;

				return `${timestamp} ┃ ${bar.join('')} ┃ ${end}`;
			} else {
				return `${bar.join('')}`;
			}
			// } else {
			// 	if (options.timecodes) {
			// 		const timestamp = queue.formattedCurrentTime;
			// 		const end = track.formattedDuration;

			// 		return `${timestamp} ┃ ${indicator}${line.repeat(length - 1)} ┃ ${end}`;
			// 	} else {
			// 		return `${indicator}${line.repeat(length - 1)}`;
			// 	}
			// }
		};

		const embed = new MessageEmbed()
			.setAuthor((await this.client.language('Now Playing', message)), this.client.user.displayAvatarURL())
			.setColor(this.client.config.discord.accentColor)
			.setTitle(track.name)
			.setURL(track.url)
			.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setThumbnail(track.thumbnail)
			.addFields(
				{ name: (await this.client.language('Requested by', message)), value: track.user.tag, inline: true },
				{ name: (await this.client.language('Channel', message)), value: `[${track.uploader.name}](${track.uploader.url})`, inline: true },

				{ name: (await this.client.language('Views', message)), value: functions.numberWithCommas(track.views), inline: true },
				{ name: (await this.client.language('Duration', message)), value: '`' + track.formattedDuration + '`', inline: true },

				{ name: (await this.client.language('Volume', message)), value: queue.volume.toString(), inline: true },
				{ name: (await this.client.language('Loop mode', message)), value: repeat_mode, inline: true },

				{ name: (await this.client.language('Progress', message)), value: createProgressBar(), inline: false },
				{ name: (await this.client.language('Active Music Effects', message)), value: queue.filters.length > 0 ? queue.filters.map((x) => `\`${x}\``).join(', ') : 'None', inline: false }
			);

		message.channel.send({ embeds: [embed] });
	}
};
