const Discord = require('discord.js');
const fetch = require('node-fetch');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('socialmedia', {
			aliases: ['socialmedia', 'social'],
			category: 'hypixel',
			description: 'Get social media of a Hypixel player.',
			args: [
				{
					id: 'player',
					prompt: {
						start: "Please specify a player's IGN to get the stats from."
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { player }) {
		const playerUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`);
		const playerUUIDData = await playerUUID.json();

		this.client.hypixelAPIReborn
			.getPlayer(player)
			.then(async (player) => {
				const embed = new Discord.MessageEmbed()
					.setTimestamp()
					.setAuthor('Social Media', 'https://i.imgur.com/OuoECfX.jpeg')
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setColor(this.client.config.discord.accentColor)
					.setThumbnail(`https://crafatar.com/avatars/${playerUUIDData.id}?overlay&size=256`)
					.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }));

				if (player.socialMedia[0] != undefined || player.socialMedia[0] != null) {
					embed.addField(player.socialMedia[0].name, player.socialMedia[0].link);
				}

				if (player.socialMedia[1] != undefined || player.socialMedia[1] != null) {
					embed.addField(player.socialMedia[1].name, player.socialMedia[1].link);
				}

				if (player.socialMedia[2] != undefined || player.socialMedia[2] != null) {
					embed.addField(player.socialMedia[2].name, player.socialMedia[2].link);
				}

				if (player.socialMedia[3] != undefined || player.socialMedia[3] != null) {
					embed.addField(player.socialMedia[3].name, player.socialMedia[3].link);
				}

				if (player.socialMedia[4] != undefined || player.socialMedia[4] != null) {
					embed.addField(player.socialMedia[4].name, player.socialMedia[4].link);
				}

				if (player.socialMedia[5] != undefined || player.socialMedia[5] != null) {
					embed.addField(player.socialMedia[5].name, player.socialMedia[5].link);
				}

				if (player.socialMedia[6] != undefined || player.socialMedia[6] != null) {
					embed.addField(player.socialMedia[6].name, player.socialMedia[6].link);
				}

				return message.reply({ embeds: [embed] });
			})
			.catch(async (e) => {
				if (e.message === this.client.HypixelAPIReborn.Errors.PLAYER_DOES_NOT_EXIST) {
					const player404 = new Discord.MessageEmbed()
						.setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
						.setDescription((await this.client.language('I could not find that player in the API. Check spelling and name history.', message)))
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }));
					return message.reply({ embeds: [player404] });
				} else {
					if (mode) {
						const error = new Discord.MessageEmbed()
							.setAuthor('Error', 'https://i.imgur.com/OuoECfX.jpeg')
							.setDescription(await this.client.language('An error has occurred', message))
							.addField('Error', `\`\`\`js\n${e}\n\`\`\``)
							.setColor(this.client.config.discord.accentColor)
							.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }));
						return message.reply({ embeds: [error] });
					}
				}
			});
	}
};
