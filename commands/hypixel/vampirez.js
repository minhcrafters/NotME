const Discord = require('discord.js');
const commaNumber = require('comma-number');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('vampirez', {
			aliases: ['vampirez', 'vz', 'vampire', 'vampires', 'vampz'],
			category: 'hypixel',
			description: 'Get Hypixel VampireZ stats of a player',
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
					.setAuthor('VampireZ Stats', 'https://i.imgur.com/OuoECfX.jpeg')
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setColor(this.client.config.discord.accentColor)
					.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL({ dynamic: true }))
					.setThumbnail('https://hypixel.net/styles/hypixel-v2/images/game-icons/VampireZ-64.png')
					.addField('Coins', `${commaNumber(player.stats.vampirez.coins)}`, true)
					.addField('Human Wins', `${commaNumber(player.stats.vampirez.human.wins)}`, true)
					.addField('Human Kills', `${commaNumber(player.stats.vampirez.human.kills)}`, true)
					.addField('Human Deaths', `${commaNumber(player.stats.vampirez.human.deaths)}`, true)
					.addField('Human KD Ratio', `${commaNumber(player.stats.vampirez.human.KDRatio)}`, true)
					.addField('Zombie Kills', `${commaNumber(player.stats.vampirez.zombie.kills)}`, true);

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
