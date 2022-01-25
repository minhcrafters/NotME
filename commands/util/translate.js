const translate = require('@iamtraction/google-translate');
const { MessageEmbed } = require('discord.js');
const ISO6391 = require('iso-639-1');

const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('translate', {
			aliases: ['translate'],
			category: 'util',
			description: 'Translates a string to a language (Default is English).',
			// examples: ['translate hello -ja'],
			// format: '<text> -[lang]',
			args: [
				{
					id: 'text',
					type: 'string',
				},
				{
                    id: 'lang',
                    match: 'option',
                    flag: ['-', 'lang:'],
                    default: 'en'
                }
			],
		});
	}

	async run(message, { text, lang }) {
		try {
			const translated = await translate(text, { to: lang });

			let autoCorrected;
			let text1;

			if (translated.from.text.autoCorrected === true) {
				autoCorrected = '(Auto-corrected)';
			} else {
				autoCorrected = '';
			}

			if (translated.from.text.value) {
				text1 = translated.from.text.value.replace(/[\[\]]+/g, '');
			} else {
				text1 = text;
			}

			const embed = new MessageEmbed()
				.setColor(this.client.config.discord.accentColor)
				.setTitle(`Google Translate`)
				.setDescription('Translate stuff')
				.addFields(
					{ name: `From ${ISO6391.getName(translated.from.language.iso)} ${autoCorrected}`, value: `\`\`\`\n${text1}\n\`\`\``, inline: false },
					{ name: `To ${ISO6391.getName(lang)}`, value: `\`\`\`\n${translated.text}\n\`\`\``, inline: false }
				)
				.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			return message.reply({ embeds: [embed] });
		} catch (err) {
			return message.reply(`${this.client.emotes.error} - **ERROR**\`\`\`js\n${err}\n\`\`\``);
		}
	}
};
