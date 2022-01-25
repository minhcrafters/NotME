const fetch = require('node-fetch');
const discord = require('discord.js');
var functions = require('../../utils/functions.js');
const parseMilliseconds = require('pretty-ms');
const ms = require('ms');
const Commando = require('discord-akairo');
const humanize = require('humanize-duration');

var query = `
query ($search: String) {
	Media (search: $search, type: ANIME) {
		title {
			romaji
			english
			native
		}
		coverImage {
			large
			color
		}
		nextAiringEpisode {
			timeUntilAiring
			episode
		}
		status
		episodes
		isAdult
		genres
		siteUrl
		description
		bannerImage
	}
}
`;

module.exports = class Command extends Commando.Command {
	constructor() {
		super('anime', {
			aliases: ['anime', 'ani'],
			category: 'info',
			description: 'Get info of an anime.',
			args: [
				{
					id: 'anime',
					prompt: {
						start: 'What anime?'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { anime }) {
		let embed = new discord.MessageEmbed().setTitle(await this.client.language('Please wait...', message)).setColor('YELLOW');
		let msg = await message.reply({ embeds: [embed] });

		fetch('https://graphql.anilist.co', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: {
					search: anime,
				},
			}),
		})
			.then((data) => data.json())
			.then(async (json) => {
				json = json.data.Media;

				console.log(json);

				if (!json) {
					const embed = new discord.MessageEmbed()
						.setDescription(`${this.client.emotes.error} - ${await this.client.language('Unable to find this anime.', message)}`)
						.setColor('RED');
					return msg.edit({ embeds: [embed] });
				}

				const desc = await this.client.language(Replacer(json.description), message);
				
				if (json.isAdult) {
					if (message.channel.nsfw) {
						embed
							.setTimestamp()
							.setTitle((json.title.romaji || json.title.native) + ' (NSFW)')
							.setThumbnail(json.coverImage.large)
							.setColor(json.coverImage.color)
							.setDescription(`${desc.substring(0, 400)}...\n[${await this.client.language('Learn more', message)}](${json.siteUrl})`)
							.setImage(json.bannerImage)
							.addField((await this.client.language('Genres', message)), (await this.client.language(json.genres.join(', '), message)))
							// .addField('Is 18+', json.isAdult ? 'Yes' : 'No', true)
							.addField((await this.client.language('Status', message)), (await this.client.language(functions.toTitleCase(json.status.replace(/_/g, ' ')), message)), true)
							.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL());

						if (json.nextAiringEpisode) {
							embed.addField((await this.client.language('Episode', message)), json.nextAiringEpisode.episode - 1 + '/' + (json.episodes || '--'), true);
							let time = parseMilliseconds(json.nextAiringEpisode.timeUntilAiring * 1000);
							embed.addField((await this.client.language('Next Airing', message)), (await this.client.language(humanize(ms(`${time.days}d ${time.hours}h ${time.minutes}m`)), message)), true);
						} else {
							if (!json.episodes) {
								embed.addField((await this.client.language('Total Episodes', message)), (await this.client.language('None', message)), true);
							} else {
								embed.addField((await this.client.language('Total Episodes', message)), json.episodes.toString(), true);
							}
						}
						return msg.edit({ embeds: [embed] });
					} else {
						const embed = new discord.MessageEmbed()
							.setColor("RED")
							.setDescription((await this.client.language('This anime is NSFW, so I can\'t show it here, sorry.', message)))
						return msg.edit({ embeds: [embed] });
					}
				} else {
					embed
						.setTimestamp()
						.setTitle((json.title.romaji || json.title.native))
						.setThumbnail(json.coverImage.large)
						.setColor(json.coverImage.color)
						.setDescription(`${desc.substring(0, 400)}...\n[${await this.client.language('Learn more', message)}](${json.siteUrl})`)
						.setImage(json.bannerImage)
						.addField((await this.client.language('Genres', message)), (await this.client.language(json.genres.join(', '), message)))
						// .addField('Is 18+', json.isAdult ? 'Yes' : 'No', true)
						.addField((await this.client.language('Status', message)), (await this.client.language(functions.toTitleCase(json.status.replace(/_/g, ' ')), message)), true)
						.setFooter((await this.client.language(`Requested by ${message.author.tag}`, message)), message.author.displayAvatarURL());

					if (json.nextAiringEpisode) {
						embed.addField((await this.client.language('Episode', message)), json.nextAiringEpisode.episode - 1 + '/' + (json.episodes || '--'), true);
						let time = parseMilliseconds(json.nextAiringEpisode.timeUntilAiring * 1000);
						embed.addField((await this.client.language('Next Airing', message)), (await this.client.language(humanize(ms(`${time.days}d ${time.hours}h ${time.minutes}m`)), message)), true);
					} else {
						if (!json.episodes) {
							embed.addField((await this.client.language('Total Episodes', message)), (await this.client.language('None', message)), true);
						} else {
							embed.addField((await this.client.language('Total Episodes', message)), json.episodes.toString(), true);
						}
					}
					return msg.edit({ embeds: [embed] });
				}
			});
	}
};

function Replacer(string) {
	return string.replace(/<br>/g, '').replace(/<i>/g, '**').replace(/<\/i>/g, '**').replace(/<i\/>/g, '**');
}
