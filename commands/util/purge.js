const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor(client) {
		super('purge', {
			aliases: ['purge', 'clear'],
			category: 'util',
			channel: 'guild',
			description: 'Delete messages.',
			clientPermissions: ['MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			// format: '[messages_count]'
		});
	}

	async exec(message, args) {
		if (!args[0] || args[0].match(/all/gi)) {
			message.channel.messages.fetch().then((messages) => {
				try {
					const succ = message.channel.bulkDelete(messages.size);
					if (succ) return message.channel.send(`${this.client.emotes.success} - Successfully purged all messages!`).then((m) => setTimeout(() => m.delete(), 6000));
				} catch (err) {
					return message.channel.send(`${this.client.emotes.error} - **ERROR**\`\`\`js\n${err}\n\`\`\``);
				}
			});
		} else {
			let messageCount = parseInt(args[0]);
			message.channel.messages.fetch({ limit: messageCount }).then((messages) => {
				try {
					const succ = message.channel.bulkDelete(messages.size);
					if (succ) return message.channel.send(`${this.client.emotes.success} - Successfully purged **${args[0]}** messages!`).then((m) => setTimeout(() => m.delete(), 6000));
				} catch (err) {
					return message.channel.send(`${this.client.emotes.error} - **ERROR**\`\`\`js\n${err}\n\`\`\``);
				}
			});
		}
	}
};
