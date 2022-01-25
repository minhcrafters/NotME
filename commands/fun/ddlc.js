const { NekoBot } = require("nekobot-api");
const api = new NekoBot();
const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

const bg = ["bedroom", "class", "closet", "club", "corridor", "house", "kitchen", "residential", "sayori_bedroom"];
const body = ["1", "1b", "2", "2b"];
const character = ["monika", "yuri", "natsuki", "sayori", "m", "y", "n", "s"];
// const faces = ["1t", "2bt", "2bta", "2btb", "2btc", "2btd", "2bte", "2btf", "2btg", "2bth", "2bti", "2t", "2ta", "2tb", "2tc", "2td", "2te", "2tf", "2tg", "2th", "2ti"];

module.exports = class Command extends Commando.Command {
	constructor() {
		super('ddlc', {
			category: 'fun',
			aliases: ['ddlc', 'doki-doki'],
			description: 'some random ddlc image gen.',
			args: [
				{
					id: 'backgroundImage',
					prompt: {
						start: 'I need background to display. Choose one of these backgrounds: "bedroom" | "class" | "closet" | "club" | "corridor" | "house" | "kitchen" | "residential" | "sayori_bedroom"',
						retry: 'Invalid background! Choose one of these backgrounds: "bedroom" | "class" | "closet" | "club" | "corridor" | "house" | "kitchen" | "residential" | "sayori_bedroom"'
					},
					type: Commando.Argument.validate('string', (m, p, str) => bg.includes(str)),
				},
				{
					id: 'character',
					prompt: {
						start: 'I need a character to display. Choose one of these characters: "monika" | "yuri" | "natsuki" | "sayori"',
						retry: 'Invalid character! Choose one of these characters: "monika" | "yuri" | "natsuki" | "sayori"'
					},
					type: 'string',
				},
				{
					id: 'body',
					prompt: {
						start: 'I need the character\'s pose to display. Choose one of these poses: "1" | "1b" | "2" | "2b" (Monika: "1" | "2")',
						retry: 'Invalid pose! Choose one of these poses: "1" | "1b" | "2" | "2b" (Monika: "1" | "2")'
					},
					type: 'string',
				},
				{
					id: 'face',
					prompt: {
						start: 'I need a face to display. Type a random lowercase letter from "a" to "r".',
					},
					type: 'string',
				},
				{
					id: 'text',
					prompt: {
						start: 'Finally, I need text to display on the dialouge. Enter something in your chat.'
					},
					type: 'string',
				}
			]
		});
	}

	async exec(message, { backgroundImage, character, body, face, text }) {

		const embed = new MessageEmbed()
			.setColor(this.client.config.discord.accentColor)
			.setTitle('Generating your image, please wait...');

		const msg = await message.reply({ embeds: [embed] });
		
		const data = await api.generate('ddlc', { background: backgroundImage, body: body, character: character, face: face, text: text }).catch((err) => {
			return message.reply(err.message);
		});

		embed
			.setImage(data)
			.setTitle(`${message.author.tag}, here is your result:`)
			.setFooter({ text: `Created by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();
		
		msg.edit({ embeds: [embed] });
	}
};
