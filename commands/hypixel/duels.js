const Discord = require('discord.js');
const commaNumber = require('comma-number');
const Commando = require('discord-akairo');

const types = ['uhc', 'bridge', 'sumo', 'classic', 'op', 'skywars'];

module.exports = class Command extends Commando.Command {
	constructor() {
		super('duels', {
			aliases: ['duels'],
			category: 'hypixel',
			description: 'Get Hypixel Duels stats of a player',
			args: [
				{
					id: 'mode',
					prompt: {
						start: `Please specify a Duels mode. Available modes are: ${types.map(x => `\`${x}\``).join(', ')}`,
						retry: `Invalid Duels mode! Available modes are: ${types.map(x => `\`${x}\``).join(', ')}`
					},
					type: Commando.Argument.validate('string', (m, p, str) => types.include(str)),
				},
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

	async exec(message, { mode, player }) {
		if (mode.toLowerCase() == 'classic') {
			this.client.hypixelAPIReborn
				.getPlayer(player)
				.then(async (player) => {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setAuthor('Classic Duels Stats (1v1)', 'https://i.imgur.com/OuoECfX.jpeg')
						.setTitle(`[${player.rank}] ${player.nickname}`)
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
						.addField('Kills', `\`${commaNumber(player.stats.duels.classic.kills)}\``, true)
						.addField('Losses', `\`${commaNumber(player.stats.duels.classic.losses)}\``, true)
						.addField('Deaths', `\`${commaNumber(player.stats.duels.classic.deaths)}\``, true)
						.addField('Wins', `\`${commaNumber(player.stats.duels.classic.wins)}\``, true);

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
		} else if (mode.toLowerCase() == 'uhc') {
			this.client.hypixelAPIReborn
				.getPlayer(player)
				.then(async (player) => {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setAuthor('UHC Duels Stats (1v1)', 'https://i.imgur.com/OuoECfX.jpeg')
						.setTitle(`[${player.rank}] ${player.nickname}`)
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
						.addField('Kills', `\`${commaNumber(player.stats.duels.uhc['1v1'].kills)}\``, true)
						.addField('Losses', `\`${commaNumber(player.stats.duels.uhc['1v1'].losses)}\``, true)
						.addField('Deaths', `\`${commaNumber(player.stats.duels.uhc['1v1'].deaths)}\``, true)
						.addField('Wins', `\`${commaNumber(player.stats.duels.uhc['1v1'].wins)}\``, true);

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
		} else if (mode.toLowerCase() == 'skywars' || mode.toLowerCase() == 'sw') {
			this.client.hypixelAPIReborn
				.getPlayer(player)
				.then(async (player) => {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setAuthor('Skywars Duels Stats (1v1)', 'https://i.imgur.com/OuoECfX.jpeg')
						.setTitle(`[${player.rank}] ${player.nickname}`)
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
						.addField('Kills', `\`${commaNumber(player.stats.duels.skywars['1v1'].kills)}\``, true)
						.addField('Losses', `\`${commaNumber(player.stats.duels.skywars['1v1'].losses)}\``, true)
						.addField('Deaths', `\`${commaNumber(player.stats.duels.skywars['1v1'].deaths)}\``, true)
						.addField('Wins', `\`${commaNumber(player.stats.duels.skywars['1v1'].wins)}\``, true);

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
		} else if (mode.toLowerCase() == 'bridge') {
			this.client.hypixelAPIReborn
				.getPlayer(player)
				.then(async (player) => {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setAuthor('Bridge Duels Stats (1v1)', 'https://i.imgur.com/OuoECfX.jpeg')
						.setTitle(`[${player.rank}] ${player.nickname}`)
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
						.addField('Kills', `\`${commaNumber(player.stats.duels.bridge['1v1'].kills)}\``, true)
						.addField('Losses', `\`${commaNumber(player.stats.duels.bridge['1v1'].losses)}\``, true)
						.addField('Deaths', `\`${commaNumber(player.stats.duels.bridge['1v1'].deaths)}\``, true)
						.addField('Wins', `\`${commaNumber(player.stats.duels.bridge['1v1'].wins)}\``, true);

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
		} else if (mode.toLowerCase() == 'sumo') {
			this.client.hypixelAPIReborn
				.getPlayer(player)
				.then(async (player) => {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setAuthor('Sumo Duels Stats (1v1)', 'https://i.imgur.com/OuoECfX.jpeg')
						.setTitle(`[${player.rank}] ${player.nickname}`)
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
						.addField('Kills', `\`${commaNumber(player.stats.duels.sumo.kills)}\``, true)
						.addField('Losses', `\`${commaNumber(player.stats.duels.sumo.losses)}\``, true)
						.addField('Deaths', `\`${commaNumber(player.stats.duels.sumo.deaths)}\``, true)
						.addField('Wins', `\`${commaNumber(player.stats.duels.sumo.wins)}\``, true);

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
		} else if (mode.toLowerCase() == 'op') {
			this.client.hypixelAPIReborn
				.getPlayer(player)
				.then(async (player) => {
					const embed = new Discord.MessageEmbed()
						.setTimestamp()
						.setAuthor('OP Duels Stats (1v1)', 'https://i.imgur.com/OuoECfX.jpeg')
						.setTitle(`[${player.rank}] ${player.nickname}`)
						.setColor(this.client.config.discord.accentColor)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
						.addField('Kills', `\`${commaNumber(player.stats.duels.op['1v1'].kills)}\``, true)
						.addField('Losses', `\`${commaNumber(player.stats.duels.op['1v1'].losses)}\``, true)
						.addField('Deaths', `\`${commaNumber(player.stats.duels.op['1v1'].deaths)}\``, true)
						.addField('Wins', `\`${commaNumber(player.stats.duels.op['1v1'].wins)}\``, true);

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
		} else {
			return message.inlineReply(`${this.client.emotes.error} - Bad argument!\nAvailable duels types are: ${types.map((x) => `\`${x}\``).join(', ')}.`);
		}
	}
};
