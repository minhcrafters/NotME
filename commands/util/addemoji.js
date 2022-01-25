const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('addemoji', {
			aliases: ['addemoji', 'addemote'],
			category: 'util',
			channel: 'guild',
			description: 'Add a custom emoji.',
			userPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
			clientPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
			args: [
				{
					id: 'emojiname',
					prompt: {
						start: 'Which name would you like to set for this new emoji?'
					},
					type: 'string',
				},
				{
					id: 'url',
					prompt: {
						retry: 'Invalid URL!',
						optional: true
					},
					type: 'string',
					default: null,
				},
			],
		});
	}

	async exec(message, { emojiname, url }) {
		if (message.attachments.first() && url) {
			message.guild.emojis
				.create(url, emojiname)
				.then(async (emoji) => message.channel.send(`${this.client.emotes.success} - ${await this.client.language(`You successfully created an emoji named **${emoji.name}**!`, message)}`))
				.catch(async (emoji) => message.channel.send(`${this.client.emotes.error} - ${await this.client.language('Something went wrong trying to create an emoji!', message)} \`\`\`js\n${emoji}\n\`\`\``));
		} else if (message.attachments.first()) {
			console.log(message.attachments.first().url);

			message.guild.emojis
				.create(message.attachments.first().url, emojiname)
				.then(async (emoji) => message.channel.send(`${this.client.emotes.success} - ${await this.client.language(`You successfully created an emoji named **${emoji.name}**!`, message)}`))
				.catch(async (emoji) => message.channel.send(`${this.client.emotes.error} - ${await this.client.language('Something went wrong trying to create an emoji!', message)} \`\`\`js\n${emoji}\n\`\`\``));
		} else if (url) {
			message.guild.emojis
				.create(url, emojiname)
				.then(async (emoji) => message.channel.send(`${this.client.emotes.success} - ${await this.client.language(`You successfully created an emoji named **${emoji.name}**!`, message)}`))
				.catch(async (emoji) => message.channel.send(`${this.client.emotes.error} - ${await this.client.language('Something went wrong trying to create an emoji!', message)} \`\`\`js\n${emoji}\n\`\`\``));
		}
	}
};
