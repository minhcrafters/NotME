const weather = require('weather-js');
const discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('weather', {
			aliases: ['weather'],
			category: 'info',
			description: 'Get information about weather of a specific location.',
			args: [
				{
					id: 'place',
					prompt: {
						start: 'What place do you want to get the information from?'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { place }) {
		return weather.find(
			{
				search: place,
				degreeType: 'C',
			},
			async (err, result) => {
				try {
					let embed = new discord.MessageEmbed()
						.setAuthor((await this.client.language('Weather Forecast', message)), this.client.user.displayAvatarURL())
						.setTitle(`${result[0].location.name}`)
						.setColor(this.client.config.discord.accentColor)
						.setDescription((await this.client.language('Temperature units can may be differ sometimes', message)))
						.addField((await this.client.language('Temperature', message)), `${result[0].current.temperature}°C`, true)
						.addField((await this.client.language('Sky Status', message)), result[0].current.skytext, true)
						.addField((await this.client.language('Humidity', message)), `${result[0].current.humidity}%`, true)
						.addField((await this.client.language('Wind Speed', message)), result[0].current.windspeed, true)
						.addField((await this.client.language('Observation Time', message)), result[0].current.observationtime, true)
						.addField((await this.client.language('Wind Display', message)), result[0].current.winddisplay, true)
						.setThumbnail(result[0].current.imageUrl);
					return message.channel.send({ embeds: [embed] });
				} catch (err) {
					return message.channel.send(`${this.client.emotes.error} - ${await this.client.language('Unable to get the data of given location!', message)}`);
				}
			}
		);
	}
};
