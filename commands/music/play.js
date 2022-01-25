const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');
const db = require('quick.db');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			category: 'music',
			channel: 'guild',
			description: 'Plays a song.',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{
					id: 'query',
					prompt: {
						start: 'What song do you want to play? (This can be a search string or an URL)'
					},
					type: 'string',
				},
				{
					id: 'voiceChannel',
					type: 'voiceChannel',
					default: message => message.member.voice.channel,
				},
			],
		});
	}

	async exec(message, { query, voiceChannel }) {
		if (!voiceChannel) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not connected in any voice channel!", message)}`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not in the same voice channel!", message)}`);

		// const queue = this.client.player.createQueue(message.guild, {
		// 	metadata: {
		// 		channel: message.channel,
		// 		message: message,
		// 	},
		// });

		// try {
		// 	if (!queue.connection) await queue.connect(message.member.voice.channel);
		// } catch (err) {
		// 	queue.destroy();
		// 	console.error(err);
		// 	return message.channel.send(`${this.client.emotes.error} - Could not join your voice channel!`);
		// }

		if (query.includes('http') && query.match(/^\<+|\>+$/g)) {
			query = query.replace(/^\<+|\>+$/g, '');
		}

		db.set(`${message.guild.id}.queueCreator`, message.author.id);
		
		message.reply(`${this.client.emotes.search} - ${await this.client.language(`Searching \`${query}\`...`, message)}`);

		return this.client.player.play(voiceChannel, query);

		/*
				const num1 = '1️⃣';
				const num2 = '2️⃣';
				const num3 = '3️⃣';
				const num4 = '4️⃣';
				const num5 = '5️⃣';

				msg.react(num1)
					.then(() => msg.react(num2))
					.then(() => msg.react(num3))
					.then(() => msg.react(num4))
					.then(() => msg.react(num5))

				
				const filter = (reaction, user) => {
					return [num1, num2, num3, num4, num5].includes(result.content.toLowerCase()) && user.id === message.author.id;
				};
				*/

		// const filter = (response) => {
		// 	return ['1', '2', '3', '4', '5', 'cancel'].some((answer) => answer.toLowerCase() === response.content.toLowerCase());
		// };

		// await msg.channel
		// 	.awaitMessages(filter, {
		// 		max: 1,
		// 		time: 30000,
		// 		errors: ['time'],
		// 	})
		// 	.then((collected) => {
		// 		const result = collected.first();

		// 		if (result.content === '1') {
		// 			result.react(this.client.emotes.success);
		// 			this.client.player.play(message, songs[0]);
		// 		} else if (result.content === '2') {
		// 			result.react(this.client.emotes.success);
		// 			this.client.player.play(message, songs[1]);
		// 		} else if (result.content === '3') {
		// 			result.react(this.client.emotes.success);
		// 			this.client.player.play(message, songs[2]);
		// 		} else if (result.content === '4') {
		// 			result.react(this.client.emotes.success);
		// 			this.client.player.play(message, songs[3]);
		// 		} else if (result.content === '5') {
		// 			result.react(this.client.emotes.success);
		// 			this.client.player.play(message, songs[4]);
		// 		} else if (result.content === 'cancel') {
		// 			result.react(this.client.emotes.success);
		// 			return message.channel.send(`${this.client.emotes.success} - Search **cancelled**!`);
		// 		} else {
		// 			return message.channel.send(`${this.client.emotes.error} - Invalid position!`);
		// 		}
		// 	})
		// 	.catch(() => {
		// 		msg.delete();
		// 		return message.channel.send(`${this.client.emotes.error} - Timed out!`);
		// 	});
	}
};
