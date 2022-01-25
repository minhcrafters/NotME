const Discord = require('discord.js');
const commaNumber = require('comma-number');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('skywars', {
			aliases: ['skywars', 'sw'],
			category: 'hypixel',
			description: 'Get Hypixel Skywars stats of a player',
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
			.getPlayer(player)
			.then(async (player) => {
				const embed = new Discord.MessageEmbed()
					.setTimestamp()
					.setAuthor('Skywars Stats', 'https://i.imgur.com/OuoECfX.jpeg')
					.setColor(this.client.config.discord.accentColor)
					.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/Skywars-64.png')
					.addField('Level', `${player.stats.skywars.level}`, true)
					.addField('Heads', `${commaNumber(player.stats.skywars.heads)}`, true)
					.addField('KD Ratio', `${player.stats.skywars.KDRatio}`, true)
					.addField('WL Ratio', `${player.stats.skywars.WLRatio}`, true)
					.addField('Coins', `${commaNumber(player.stats.skywars.coins)}`, true)
					.addField('Total Deaths', `${commaNumber(player.stats.skywars.deaths)}`, true)
					.addField('Total Kills', `${commaNumber(player.stats.skywars.kills)}`, true)
					.addField('Winstreak', `${commaNumber(player.stats.skywars.winstreak)}`, true)
					.addField('Total Wins', `${commaNumber(player.stats.skywars.wins)}`, true)
					.addField('Tokens', `${commaNumber(player.stats.skywars.tokens)}`, true)
					.addField('Prestige', `${player.stats.skywars.prestige}`, true)
					.addField('Souls', `${commaNumber(player.stats.skywars.souls)}`, true)
					.addField('Ranked Kills', `${commaNumber(player.stats.skywars.ranked.kills)}`, true)
					.addField('Ranked Losses', `${commaNumber(player.stats.skywars.ranked.losses)}`, true)
					.addField('Ranked Games Played', `${commaNumber(player.stats.skywars.ranked.played)}`, true)
					.addField('Ranked Wins', `${commaNumber(player.stats.skywars.ranked.wins)}`, true)
					.addField('Ranked KD Ratio', `${player.stats.skywars.ranked.KDRatio}`, true)
					.addField('Ranked WL Ratio', `${player.stats.skywars.ranked.WLRatio}`, true);

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
