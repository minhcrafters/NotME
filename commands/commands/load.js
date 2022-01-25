const { oneLine } = require('common-tags');
const { Command } = require('discord-akairo');

module.exports = class ReloadCommandCommand extends Command {
	constructor() {
		super('load', {
			aliases: ['load', 'load-command'],
			category: 'commands',
			description: 'Loads a command.',
			ownerOnly: true,
			args: [
				{
					id: 'cmd',
					type: 'string'
				}
			]
		});
	}

	async exec(msg, args) {
		const { cmd } = args;

		this.client.commandHandler.load(cmd);

		return await msg.reply(`Loaded \`${cmd}\` command${this.client.shard ? ' on all shards' : ''}.`);
	}
};