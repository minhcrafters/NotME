const discord = require('discord.js');
const fetch = require('node-fetch');
const functions = require('../../utils/functions.js');

const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('imdb', {
			aliases: ['film', 'movie', 'series'],
			category: 'info',
			description: 'Get information about a specific movie or film or series.',
			args: [
				{
					id: 'query',
					prompt: {
						start: 'What movie/film/series do you want to know about?'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { query }) {
		const embed0 = new discord.MessageEmbed().setAuthor((await this.client.language('Please wait...', message)), this.client.user.displayAvatarURL()).setColor('YELLOW');
		let msg = await message.reply({ embeds: [embed0] });
		
		try {
			let movie = await fetch(`https://www.omdbapi.com/?apikey=5e36f0db&t=${query.replace(' ', '+')}`);
			movie = await movie.json();

			if (!movie.Response) {
				const embed = new discord.MessageEmbed().setDescription(`${this.client.emotes.error} - ${await this.client.language(`Unable to find something about \`${args.join(' ')}\``, message)}`).setColor('RED');
				return msg.edit({ embeds: [embed] });
			}

			const embed = new discord.MessageEmbed()
				.setTitle(movie.Title)
				.setColor(this.client.config.discord.accentColor)
				.setThumbnail(movie.Poster)
				.setDescription(movie.Plot)
				.setFooter(`${await this.client.language('Ratings:', message)} ${movie.imdbRating} | ${await this.client.language('Seasons:', message)} ${movie.totalSeasons || '0'}`)
				.addField((await this.client.language('Country'), message), movie.Country, true)
				.addField((await this.client.language('Languages'), message), movie.Language, true)
				.addField((await this.client.language('Type'), message), functions.toTitleCase(movie.Type), true);
			msg.edit({ embeds: [embed] });
		} catch (err) {
			const embed = new discord.MessageEmbed().setDescription((await this.client.language('Something went wrong :/'), message)).setColor('RED');
			msg.edit({ embeds: [embed] });
		}
	}
};
