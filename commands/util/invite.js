const Commando = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class InviteCommand extends Commando.Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'util',
			description: 'Invite the bot to your server.',
		});
	}

	async exec(message) {
		return message.channel.send(stripIndents`
			${await this.client.language('Was too lazy to create a proper embed, so here\'s the invite link:', message)} https://notme.bot.nu/invite

			${await this.client.language('Vote for me at Top.gg:', message)}
			https://top.gg/bot/873922961491525682
			`
		);
	}
};
