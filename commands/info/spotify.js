const canvacord = require('canvacord');
const Discord = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('spotify', {
			aliases: ['spotify'],
			category: 'info',
			description: 'Shows Spotify presence of a user as an image.',
			args: [
				{
					id: 'user',
					type: 'user',
					default: message => message.author,
				}
			]
		});
	}

	async exec(message, { user }) {
		const activity = user.presence.activities.find(activity => activity.name.toLowerCase() == 'spotify');

		if (!activity) {
			return message.reply(`${this.client.emotes.error} - **${user.tag}** is not listening to Spotify.`);
		}
		
		const card = new canvacord.Spotify()
			.setAuthor(activity.state.replace(/;/g, ','))
			.setAlbum(activity.assets.largeText)
			.setStartTimestamp(activity.timestamps.start)
			.setEndTimestamp(activity.timestamps.end)
			.setImage(activity.assets.largeImageURL())
			.setTitle(activity.details);

		return card.build().then((buffer) => {
			const attachment = new Discord.MessageAttachment(buffer, 'spotify.png');
			return message.reply({ files: [attachment] });
		});
	}
};
