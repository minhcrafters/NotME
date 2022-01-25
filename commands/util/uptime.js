const humanize = require('humanize-duration');
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('uptime', {
			aliases: ['uptime'],
			category: 'util',
			description: "Shows the bot's uptime.",
		});
	}

	async exec(message) {
		const uptime = await this.client.language('Bot uptime', message);
		const embed = new MessageEmbed().setColor(this.client.config.discord.accentColor).setAuthor(uptime, this.client.user.displayAvatarURL()).setTitle(await this.client.language(humanize(this.client.uptime), message));

		return message.channel.send({ embeds: [embed] });
	}
};
