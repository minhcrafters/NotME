const Discord = require('discord.js');
const axios = require('axios').default;
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('web-screenshot', {
			aliases: ['web-screenshot', 'web'],
			category: 'info',
			description: 'Get screenshot of a website.',
			args: [
				{
					id: 'url',
					prompt: {
						start: 'Provide the URL please.',
						retry: 'Invalid URL. Please try again.'
					},
					type: 'url',
				},
				{
					id: 'fullPage',
					match: 'flag',
					flag: ['--full', '-f']
				},
			],
		});
	}

	async exec(message, { url, fullPage }) {
		const response = await axios.get(`https://shot.screenshotapi.net/screenshot?&url=${encodeURI(url.toString())}&full_page=${fullPage}&fresh=true&output=image&file_type=png&wait_for_event=load`, { responseType: 'arraybuffer' });
		const buffer = Buffer.from(response.data, "utf-8");
		const attachment = new Discord.MessageAttachment(buffer, 'result.png');

		const embed = new Discord.MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setTitle(`Screenshot of ${url.toString()}${fullPage ? ' (Full page)' : ''}`)
			.setImage('attachment://result.png')
			.setTimestamp();

		return message.reply({ embeds: [embed], files: [attachment] });
	}
}