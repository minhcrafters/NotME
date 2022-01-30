const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const functions = require('../../utils/functions.js');
const translate = require('@iamtraction/google-translate');
const Commando = require('discord-akairo');

module.exports = class UserInfo extends Commando.Command {
	constructor() {
		super('userinfo', {
			aliases: ['userinfo', 'whois', 'user'],
			category: 'util',
			description: 'Get information about a specific user across Discord (Yes, Discord, not within the server).',
			args: [
				{
					id: 'user',
					type: 'user',
					default: message => message.author,
				}
			]
		});
	}

	async exec(message, { user }) {
		// let stat = {
		// 	online: 'https://emoji.gg/assets/emoji/9166_online.png',
		// 	idle: 'https://emoji.gg/assets/emoji/3929_idle.png',
		// 	dnd: 'https://emoji.gg/assets/emoji/2531_dnd.png',
		// 	offline: 'https://emoji.gg/assets/emoji/7445_status_offline.png',
		// };

		user = await user.fetch(true);

		let badges = await user.flags;
		badges = (await badges) ? badges.toArray() : ['None'];

		let newbadges = [];
		badges.forEach((m) => {
			newbadges.push(m.replace('_', ' '));
		});

		let embed = new MessageEmbed().setThumbnail(
			user.displayAvatarURL({
				dynamic: true,
			}) ||
				user.user.displayAvatarURL({
					dynamic: true,
				})
		);

		if (user.displayHexColor) embed.setColor(user.displayHexColor === '#000000' ? '#ffffff' : user.displayHexColor);
		else embed.setColor(this.client.config.discord.accentColor);

		embed.setTitle(user.tag);

		axios
			.get(`https://discord.com/api/users/${user.id}`, {
				headers: {
					Authorization: `Bot ${this.client.config.discord.token}`,
				},
			})
			.then((res) => {
				const { banner } = res.data;

				if (banner) {
					const extension = banner.startsWith('a_') ? '.gif' : '.png';
					const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=2048`;

					embed.setImage(url);
				}
			});

		let isInThisGuild;

		if (user.username.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)) {
			let translated = await translate(user.username, { from: 'ja', to: 'en' });
			embed.addField((await this.client.language('Translated Username', message)), translated.text);
		}

		embed.addField((await this.client.language('Account created at', message)), `<t:${moment(user.createdAt).unix()}> (<t:${moment(user.createdAt).unix()}:R>)`);

		let array = [];
		let array1 = [];

		if (user.presence) {
			if (user.presence.activities.length) {
				let data = user.presence.activities;

				for (let i = 0; i < data.length; i++) {
					this.client.logger.log(data[i]);

					let name = data[i].name || 'None';
					let xname = data[i].details || 'None';
					let yname = data[i].state || 'None';
					let zname;

					if (data[i].assets) {
						zname = data[i].assets.largeText;
					} else {
						zname = 'None';
					}

					let type = data[i].type;

					if (type === 'LISTENING') {
						const duration = (new Date(data[i].timestamps.end).getTime()) - (new Date(data[i].timestamps.start).getTime());

						this.client.logger.log(new Date(data[i].timestamps.start).getTime());
						this.client.logger.log(new Date(data[i].timestamps.end).getTime());

						this.client.logger.log(duration);

						array.push((await this.client.language(`${functions.toTitleCase(type.toString())} to ${name.toString()}`, message)));
						array1.push([
							`**${await this.client.language('Song', message)}** -> ${xname}`,
							`**${await this.client.language('Artist', message)}** -> ${yname.replace(/;/g, ',')}`,
							`**${await this.client.language('Album', message)}** -> ${zname}`,
							`**${await this.client.language('Duration', message)}** -> ${moment(duration).format((duration / 1000) > 3600 ? 'HH:mm:ss' : 'mm:ss')}`
						]);
					} else if (type === 'CUSTOM') {
						array.push((await this.client.language(name.toString(), message)));
						array1.push(`${yname}`);
					} else {
						array.push(`${functions.toTitleCase(type.toString())} ${name.toString()}${data[i].timestamps ? ` (Started ${moment(data[i].timestamps.start.toString()).fromNow()}${data[i].timestamps.end ? `, end ${moment(data[i].timestamps.end.toString()).fromNow()})` : ')'}` : ''}`);
						array1.push(`${xname}\n${yname}`);
					}

					if (data[i].name === 'Spotify') {
						embed.setThumbnail(`https://i.scdn.co/image/${data[i].assets.largeImage.replace('spotify:', '')}`);
					}

					embed.addField(array[i], array1[i], false);
				}
			}
		}

		if (message.channel.type != 'dm') {
			await message.guild.members
				.fetch(user.id)
				.then(async (user) => {
					this.client.logger.log(user);

					isInThisGuild = await this.client.language('Yes', message);

					embed.addFields(
						{ name: 'Is in this server?', value: isInThisGuild, inline: false }
					);

					embed.addField('Joined this server at', `<t:${moment(user.joinedAt).unix()}> (<t:${moment(user.joinedAt).unix()}:R>)`);

					if (user.nickname) {
						embed.addField((await this.client.language('Server Nickname', message)), user.nickname);
						if (user.nickname.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)) {
							let translated = await translate(user.nickname, { from: 'ja', to: 'en' });
							embed.addField((await this.client.language('Translated Nickname', message)), translated.text);
						}
					}
				})
				.catch(async () => {
					isInThisGuild = await this.client.language('No', message);

					embed.addField('Is in this server?', isInThisGuild);
				});
		}

		embed
			.addField('Common Information', [
				`**ID:** \`${user.id}\``,
				`**Discriminator:** \`${user.discriminator}\``,
				`**Is a bot?** ${user.bot ? 'Yes' : 'No'}`
			].join('\r\n'))
			.addField('Badges', functions.toTitleCase(newbadges.join(', ').replace(/_/g, ' ')) || 'None')
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send({ embeds: [embed] }).catch((err) => {
			return message.channel.send('Error: ' + err);
		});
	}
};
