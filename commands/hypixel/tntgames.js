const Discord = require('discord.js');
const commaNumber = require('comma-number');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('tntgames', {
			aliases: ['tntgames', 'tnt'],
			category: 'hypixel',
			description: 'Get Hypixel TNT Games stats of a player',
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
					.setAuthor('TNT Games Stats', 'https://i.imgur.com/OuoECfX.jpeg')
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setColor(this.client.config.discord.accentColor)
					.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
					.setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/TNT-64.png')
					.addField('Coins', `${commaNumber(player.stats.tntgames.coins)}`, true)
					.addField('Total Wins', `${commaNumber(player.stats.tntgames.wins)}`, true)
					.addField('Winstreak', `${commaNumber(player.stats.tntgames.winstreak)}`, true)
					.addField('TNT Run Wins', `${commaNumber(player.stats.tntgames.tntrun.wins)}`, true)
					.addField('TNT Run Deaths', `${commaNumber(player.stats.tntgames.tntrun.deaths)}`, true)
					.addField(
						'TNT Run Longest Game (Minutes)',
						`${Math.floor(player.stats.tntgames.tntrun.record / 60)}:${player.stats.tntgames.tntrun.record - Math.floor(player.stats.tntgames.tntrun.record / 60) * 60}`,
						true
					)
					.addField('PvP Run Wins', `${commaNumber(player.stats.tntgames.pvprun.wins)}`, true)
					.addField('PvP Run Deaths', `${commaNumber(player.stats.tntgames.pvprun.deaths)}`, true)
					.addField(
						'PvP Run Longest Game (Minutes)',
						`${Math.floor(player.stats.tntgames.pvprun.record / 60)}:${player.stats.tntgames.pvprun.record - Math.floor(player.stats.tntgames.pvprun.record / 60) * 60}`,
						true
					)
					.addField('PvP Run Kills', `${commaNumber(player.stats.tntgames.pvprun.kills)}`, true)
					.addField('PvP Run KD Ratio', `${commaNumber(player.stats.tntgames.pvprun.KDRatio)}`, true)
					.addField('PvP Run Wins', `${commaNumber(player.stats.tntgames.pvprun.wins)}`, true)
					.addField('TNT Tag Kills', `${commaNumber(player.stats.tntgames.tnttag.kills)}`, true)
					.addField('TNT Tag Wins', `${commaNumber(player.stats.tntgames.tnttag.wins)}`, true)
					.addField('TNT Tag Speed', `${commaNumber(player.stats.tntgames.tnttag.speed)}`, true)
					.addField('Bow Spleef Wins', `${commaNumber(player.stats.tntgames.bowspleef.wins)}`, true)
					.addField('Bow Spleef Tags', `${commaNumber(player.stats.tntgames.bowspleef.tags)}`, true)
					.addField('Bow Spleef Deaths', `${commaNumber(player.stats.tntgames.bowspleef.deaths)}`, true)
					.addField('Wizards Wins', `${commaNumber(player.stats.tntgames.wizards.wins)}`, true)
					.addField('Wizards Kills', `${commaNumber(player.stats.tntgames.wizards.kills)}`, true)
					.addField('Wizards Deaths', `${commaNumber(player.stats.tntgames.wizards.deaths)}`, true)
					.addField('Wizards Assists', `${commaNumber(player.stats.tntgames.wizards.wins)}`, true)
					.addField('Wizards KD Ratio', `${commaNumber(player.stats.tntgames.wizards.KDRatio)}`, true)
					.addField('Wizards Points', `${commaNumber(player.stats.tntgames.wizards.points)}`, true)
					.addField('Wizards Class', `${player.stats.tntgames.wizards.class || 'No Class'}`, true);

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
