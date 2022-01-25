const RedditImageFetcher = require("reddit-image-fetcher");
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('memes', {
			aliases: ['memes', 'meme'],
			category: 'fun',
			description: 'Get a random meme from subreddits.',
		});
	}

	async exec(message) {
		let meme;

		RedditImageFetcher.fetch({
			type: 'meme'
		}).then(meme => {
			if (!meme[0].NSFW) {
				const embed = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle(meme[0].title)
					.setURL(meme[0].postLink)
					.setImage(meme[0].image)
					.setFooter(`A random post from r/${meme[0].subreddit} • ${meme[0].upvotes} Upvotes`)
					.setTimestamp();

				return message.channel.send({ embeds: [embed] });
			}
		});
	}
};
