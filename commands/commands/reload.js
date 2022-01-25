const { oneLine } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class ReloadCommandCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload', 'reload-command'],
			category: 'commands',
			description: 'Reloads a command.',
			ownerOnly: true,
			args: [
				{
					id: 'cmd',
					prompt: {
						start: 'Which command would you like to reload?'
					},
					type: 'commandAlias'
				}
			]
		});
	}

	async exec(msg, args) {
		const { cmd } = args;

		this.client.commandHandler.reload(cmd.id);

		return await msg.reply(`Reloaded \`${cmd.id}\` command${this.client.shard ? ' on all shards' : ''}.`);
	}
};