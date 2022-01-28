const Commando = require('discord-akairo');

const embedBuilder = async (client, title, author) => {
	return new Discord.MessageEmbed()
		.setColor(client.config.discord.accentColor)
		.setTitle(`${title}`)
		.setTimestamp()
		.setFooter(`Poll created by ${author.tag}`, author.displayAvatarURL({ dynamic: true }));
};

module.exports = class Command extends Commando.Command {
	constructor() {
		super('poll', {
			aliases: ['poll'],
			category: 'util',
			channel: 'guild',
			description: 'Creates a poll.',
			userPermissions: ['MENTION_EVERYONE'],
			args: [
				{
					id: 'title',
					type: 'string',
				},
				{
					id: 'duration',
					type: 'string',
				},
				{
					id: 'options',
					type: 'string',
					match: 'separate'
				}
			]
		});
	}

	async exec(message, args) {		
		if (!message.channel) return message.reply(`${this.client.emotes.error} - ${await this.client.language('This channel is inaccessible.', message)}`);
		if (!args.title) return message.reply(`${this.client.emotes.error} - ${await this.client.language('Poll title is not given.', message)}`);
		if (!args.options) return message.reply(`${this.client.emotes.error} - ${await this.client.language('Poll options is not given.', message)}`);

		const options = args.options;

		if (options.length < 2) return message.reply(`${this.client.emotes.error} - ${await this.client.language('Please provide more than one choice.', message)}`);
		if (options.length > emojiList.length) return message.reply(`${this.client.emotes.error} - ${await this.client.language(`Please provide ${emojiList.length} or less choices.`, message)}`);

		let text = `*${await this.client.language('To vote, react using the corresponding emoji.', message)}\n${await this.client.language(`The poll will end in **${humanizeDuration(
			ms(timeout)
		)}**.`, message)}\n${await this.client.language(`Poll creator can end the poll **forcefully** by reacting to ${forceEndPollEmoji}.`, message)}*\n\n`;

		let emojiInfo = {};

		for (const option of options) {
			const emoji = emojiList.splice(0, 1);
			emojiInfo[emoji] = { option: option, votes: 0 };
			text += `${emoji} : \`${option}\`\n\n`;
		}

		const usedEmojis = Object.keys(emojiInfo);
		usedEmojis.push(forceEndPollEmoji);

		const embed = (await embedBuilder(this.client, args.title, message.author)).setDescription(text);
		const poll = await message.channel.send({ embeds: [embed] });
		for (const emoji of usedEmojis) await poll.react(emoji);

		const reactionCollector = poll.createReactionCollector((reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot, timeout === 0 ? {} : { time: ms(timeout) });

		const voterInfo = new Map();

		reactionCollector.on('collect', (reaction, user) => {
			if (usedEmojis.includes(reaction.emoji.name)) {
				if (reaction.emoji.name === forceEndPollEmoji && message.author.id === user.id) return reactionCollector.stop();

				if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name });

				const votedEmoji = voterInfo.get(user.id).emoji;

				if (votedEmoji !== reaction.emoji.name) {
					const lastVote = poll.reactions.get(votedEmoji);

					lastVote.count -= 1;
					lastVote.users.remove(user.id);

					emojiInfo[votedEmoji].votes -= 1;
					voterInfo.set(user.id, { emoji: reaction.emoji.name });
				}

				emojiInfo[reaction.emoji.name].votes += 1;
			}
		});

		reactionCollector.on('dispose', (reaction, user) => {
			if (usedEmojis.includes(reaction.emoji.name)) {
				voterInfo.delete(user.id);
				emojiInfo[reaction.emoji.name].votes -= 1;
			}
		});

		reactionCollector.on('end', async () => {
			text = `*${await this.client.language('Voting Result:', message)}*\n\n`;

			for (const emoji in emojiInfo) text += `\`${emojiInfo[emoji].option}\` - ${await this.client.language(`\`${emojiInfo[emoji].votes}\` votes`, message)}\n\n`;

			poll.delete();

			const embed = (await embedBuilder(this.client, args.title, message.author)).setDescription(text);
			message.channel.send({ embeds: [embed] });
		});
	}
};
