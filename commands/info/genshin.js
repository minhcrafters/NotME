const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const functions = require('../../utils/functions.js');

const types = ['artifacts', 'characters', 'consumables', 'domains', 'elements', 'enemies', 'materials', 'nations', 'weapons'];

const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('genshin', {
			aliases: ['genshin', 'gi', 'genshin-impact'],
			category: 'info',
			description: 'Fetch things from Genshin Impact API.',
			args: [
				{
					id: 'category',
					prompt: {
						start: `Specify a category. Available categories are ${types.map((x) => `\`${x}\``).join(', ')}.`,
						retry: `Invalid category. Available categories are ${types.map((x) => `\`${x}\``).join(', ')}.`
					},
					type: 'string',
				},
			],
		});
	}

	async exec(message, { category }) {
		const current = types.find((x) => x.toLowerCase() === category.toLowerCase());

		if (!current) {
			return message.channel.send(`${this.client.emotes.error} - Invalid category!\nAvailable categories are ${types.map((x) => `\`${x}\``).join(', ')}`);
		}

		let embed = new MessageEmbed()
			.setThumbnail('https://cdn.discordapp.com/attachments/869189510423011379/879028993947475968/images.jfif')
			.setAuthor("Genshin Impact's", 'https://cdn.discordapp.com/attachments/869189510423011379/879028998401826886/genshin_logo.png')
			.setColor(this.client.config.discord.accentColor);

		for (const type of types) {
			if (type === current) {
				let jsonData = await fetch(`https://api.genshin.dev/${type}`);
				jsonData = await jsonData.json();

				embed
					.setTitle(functions.toTitleCase(category))
					.setDescription(functions.toTitleCase(jsonData.join(', ').replace(/-s-/g, "'s ").replace(/-/g, ' ').replace(/Of/g, 'of').replace(/To/g, 'to')));
			}
		}

		return message.reply({ embeds: [embed] }).catch((err) => {
			return message.reply(`Something went wrong, please try again later.\n\`\`\`js\n${err}\n\`\`\``);
		});
	}
};
