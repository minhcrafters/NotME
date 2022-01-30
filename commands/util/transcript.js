const Commando = require('discord-akairo');
const { MessageAttachment, Util } = require('discord.js');

function getUTCDate(dateString) {
	const dateInstance = new Date(dateString);
	return Date.UTC(
		dateInstance.getYear(),
		dateInstance.getMonth(),
		dateInstance.getDate(),
	);
}

function messageMatchesDate(message, date) {
	// Ensure that comparisons are done using UTC.
	return getUTCDate(date) === getUTCDate(message.createdTimestamp);
}

async function generateContent(channel, messages, date, name) {
	const generatedMessages = (
		await Promise.all(
			messages.map(async message => {
				let content = `**${message.author.username}${message.author.bot ? ' (BOT)' : ''}:** ${message.content}${message.embeds.length > 0 ? ' (embeds)' : ''}`;

				if (message.reactions.cache.size) {
					const reactions = (
						await Promise.all(
							Array.from(message.reactions.cache.entries()).map(
								async ([emoji, { users }]) => {
									const reaction = await users.fetch();
									return `- * ${Array.from(reaction.values())
										.map(({ username }) => `@${username}`)
										.join(', ')} reacted with: ${emoji}`;
								},
							),
						)
					).join('\n');

					content += `\n${reactions}`;
				}

				return content;
			}),
		)
	).join('\n\n');

	return `__**# ${name ? name + ' ' : ''}Transcript**__\n**Server:** ${channel.guild.name}\n**Channel:** #${channel.name}\n**Date:** ${date}\n\n${generatedMessages}\n`;
}

function getTranscriptMessages(messages, date) {
	return messages
		.filter(message => messageMatchesDate(message, date))
		.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
}

async function fetchMessages(channel, date) {
	let messages = [];

	// Discord's API limits fetching messages to 50 at a time. Continue requesting batches
	// until we either have no messages or find a message from a previous date.
	while (true) {
		const batch = (
			await channel.messages.fetch(
				messages.length ? { before: messages[0].id } : undefined,
			)
		).map(x => x);

		if (!batch.length) {
			break;
		}

		messages = [...getTranscriptMessages(batch, date), ...messages];

		if (!messageMatchesDate(batch[batch.length - 1], date)) {
			break;
		}
	}

	return messages.map(message => {
		message.content = message.content.replace(
			/<@!?(\d+)>/g,
			(match, p1) => `@${channel.client.users.cache.get(p1).username}`,
		);
		return message;
	});
}

module.exports = class Command extends Commando.Command {
	constructor() {
		super('transcript', {
			aliases: ['transcript'],
			category: 'util',
			channel: 'guild',
			description: 'Generates a message transcript.',
			args: [
				{
					id: 'channel',
					type: 'textChannel',
					default: message => message.channel,
				},
				{
					id: 'date',
					type: 'date',
					default: (new Date()).toString(),
				},
				{
					id: 'name',
					match: 'content',
					default: null
				}
			]
		});
	}

	async exec(message, { channel, date, name }) {
		const messages = await fetchMessages(channel, date);

		const result = Util.splitMessage(await generateContent(channel, messages, date, name));

		// const data = await this.client.functions.generateTranscript(message.channel, message.guild, await message.channel.messages.fetch({ limit: 100 }));

		// this.client.app.get('/transcript')

		// const file = new MessageAttachment(data, 'index.html');

		try {
			result.map(item => message.author.send(item));
			return message.reply('DM sent!');
		} catch {
			return message.reply('Your DMs are disabled!');
		}
	}
};
