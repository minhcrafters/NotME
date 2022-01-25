const { oneLine } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class ReloadCommandCommand extends Command {
	constructor() {
		super('unload', {
			aliases: ['unload', 'unload-command'],
			category: 'commands',
			description: 'Unloads a command.',
			ownerOnly: true,
			args: [
				{
					id: 'cmd',
					prompt: {
						start: 'Which command would you like to unload?'
					},
					type: 'commandAlias'
				}
			]
		});
	}

	async exec(msg, args) {
		const { cmd } = args;

		this.client.commandHandler.remove(cmd.id);

		return await msg.reply(`Unloaded \`${cmd.id}\` command${this.client.shard ? ' on all shards' : ''}.`);
	}
};