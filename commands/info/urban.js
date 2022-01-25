const Discord = require('discord.js');
const { default: axios } = require('axios');
const Commando = require('discord-akairo');
const Pagination = require('discord-paginationembed');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('urban', {
			aliases: ['urban', 'urban-dict'],
			category: 'info',
			description: 'A dictionary.',
			args: [
				{
					id: 'text',
					prompt: {
						start: 'What word do you want to search for?'
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { text }) {
		let query = text;

		query = encodeURIComponent(query);

		const {
			data: { list },
		} = await axios.get(`https://api.urbandictionary.com/v0/define?term=${query}`).catch((err) => {
			return message.channel.send(`${this.client.emotes.error} - **ERROR**\n\`\`\`js\n${err}\n\`\`\``);
		});

		const embeds = [];

		if (!list || list.length <= 0) {
			return message.channel.send(`${this.client.emotes.error} - Unable to find the word!`);
		}

		for (const answer of list) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Urban Dictionary', this.client.user.displayAvatarURL())
				.setTimestamp()
				.setTitle(answer.word)
				.setURL(answer.permalink)
				.setColor(this.client.config.discord.accentColor)
				.setDescription(`${answer.thumbs_up} Likes 👍 | ${answer.thumbs_down} Dislikes 👎`)
				.addFields(
					{ name: 'Definition', value: `\`\`\`js\n${answer.definition.replace(/[\[\]]/g, '')}\n\`\`\`` },
					{ name: 'Example', value: `\`\`\`\n${answer.example.replace(/[\[\]]/g, '')}\n\`\`\`` }
				)

			embeds.push(embed);
		}

		const embed = new Pagination.Embeds()
			.setArray(embeds)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setPageIndicator('footer', 'hybrid')
			.setPage(1)
			.setAuthor('Urban Dictionary', this.client.user.displayAvatarURL())
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.build();

		return message.reply({ embeds: [embed] });
	}
};
