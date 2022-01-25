const Commando = require('slash-create');

module.exports = class InviteCommand extends Commando.SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'invite',
			description: 'Invite the bot to your server.',
		});
	}

	async run(ctx) {
		return ctx.send(`
${await this.client.language('Was too lazy to create a proper embed, so here\'s the invite link:', ctx)} https://notme.bot.nu/invite

${await this.client.language('Vote for me at Top.gg:', ctx)}
https://top.gg/bot/873922961491525682`
		);
	}
};
