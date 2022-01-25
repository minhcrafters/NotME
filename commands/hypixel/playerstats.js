const fetch = require('node-fetch');
const Discord = require('discord.js');
const commaNumber = require('comma-number');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('playerstats', {
			aliases: ['playerstats', 'ps', 'player'],
			category: 'hypixel',
			description: 'Get Hypixel stats of a Minecraft player',
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
		this.client.hypixelAPIReborn
			.getPlayer(player, { guild: true })
			.then(async (player1) => {
				const playerUUID = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player}`); // fetch uuid
				const playerUUIDData = await playerUUID.json();

				playerIsOnline = '';

				if (!player1.isOnline) {
					playerIsOnline = 'Offline';
				}

				if (player1.isOnline) {
					playerIsOnline = 'Online';
				}

				playerMinecraftVersion = '';

				if (player1.mcVersion == null) {
					playerMinecraftVersion = 'Unknown';
				}

				if (player1.mcVersion != null) {
					playerMinecraftVersion = player1.mcVersion;
				}

				playerRank = '';

				if (player1.rank == 'Default') {
					playerRank = 'None';
				}

				if (player1.rank != 'Default') {
					playerRank = player1.rank;
				}

				const firstLDate = new Date(player1.firstLogin); // fetch first login date and time
				const lastLDate = new Date(player1.lastLogin); // fetch last login date and time

				const firstL = firstLDate.toLocaleString(); // convert into cleaner date and time
				const lastL = lastLDate.toLocaleString(); // convert into cleaner date and time

				const playerInfoEmbed = new Discord.MessageEmbed()
					.setTimestamp()
					.setAuthor('Player Stats', 'https://i.imgur.com/OuoECfX.jpeg')
					.setTitle(`[${player1.rank}] ${player1.nickname}`)
					.setColor(this.client.config.discord.accentColor)
					.setThumbnail(`https://crafatar.com/avatars/${playerUUIDData.id}?overlay&size=256`)
					.addField('Rank', `${playerRank}`, true)
					.addField('Level', `${player1.level}`, true)
					.addField('Karma', `${commaNumber(player1.karma)}`, true);

				if (player1.guild != null) {
					if (player1.guild.tag != null) {
						playerInfoEmbed.setTitle(`[${player1.rank}] ${player1.nickname} [${player1.guild.tag}]`);
						playerInfoEmbed.addField('Guild', `${player1.guild.name}`);
						playerInfoEmbed.addField('Guild Tag', `[${player1.guild.tag}]`);
					} else {
						playerInfoEmbed.addField('Guild', `${player1.guild.name}`);
					}
				}

				playerInfoEmbed.addField('Main MC Version', `${playerMinecraftVersion}`, true);
				playerInfoEmbed.addField('First Login', `${firstL}`);
				playerInfoEmbed.addField('Last Login', `${lastL}`);
				playerInfoEmbed.addField('Status', `${playerIsOnline}`, true);

				if (player1.rank.includes('MVP+')) {
					if (player1.plusColor == null) {
						playerInfoEmbed.addField('MVP+ Rank Color', 'Red');
					} else {
						playerInfoEmbed.addField('MVP+ Rank Color', `${player1.plusColor}`);
					}
				} else if (player1.rank.includes('MVP++')) {
					if (player1.plusColor == null) {
						playerInfoEmbed.addField('MVP++ Rank Color', 'Red');
					} else {
						playerInfoEmbed.addField('MVP++ Rank Color', `${player1.plusColor}`);
					}
				}

				playerInfoEmbed.addField('Social Media', `Run \`${this.client.commandPrefix}socialmedia ${player1.nickname}\``);
				playerInfoEmbed.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }));

				return message.reply({ embeds: [playerInfoEmbed] });
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
