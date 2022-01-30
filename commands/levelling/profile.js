const { MessageAttachment } = require('discord.js');
const Commando = require('discord-akairo');
const { Canvas } = require('canvas-constructor/skia');
const { resolveImage } = require('canvas-constructor/skia');
const { registerFont } = require('canvas-constructor/skia');
const translate = require('@iamtraction/google-translate');
const { resolve, join } = require('path');
const fetch = require('node-fetch');

registerFont('Discord', resolve(join(__dirname, '../../discord.otf')));

const imageUrlRegex = /\?size=2048$/g;

module.exports = class Command extends Commando.Command {
	constructor() {
		super('profile', {
			aliases: ['profile', 'xp', 'rank'],
			category: 'levelling',
			channel: 'guild',
			description: 'Shows your profile.',
			args: [
				{
					id: 'user',
					type: 'member',
					default: m => m.author,
				}
			]
		});
	}

	async exec(message, { user }) {

		async function profile(client, member, key) {
			const { level, points } = client.points.get(key);

			try {
				const url = member.displayAvatarURL().replace('.webp', '.png').replace(imageUrlRegex, '?size=128');
				console.log(url);
				const result = await fetch(url);
				if (!result.ok) throw new Error('Failed to get the avatar.');
				console.log(result);
				const buffer = await result.buffer();
				console.log(buffer);
				const avatar = await resolveImage(buffer);

				let name = member.tag.length > 30 ? member.tag.substring(0, 27) + '...' : member.tag;

				if (name.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)) {
					let translated = await translate(member.username, { from: 'ja', to: 'en' });
					name = translated.text + '#' + member.discriminator;
				}

				return new Canvas(400, 180)
					.setColor('#7289DA')
					.printRectangle(84, 0, 316, 180)
					.setColor('#2C2F33')
					.printRectangle(0, 0, 84, 180)
					.printRectangle(169, 26, 231, 46)
					.printRectangle(224, 108, 176, 46)
					.setShadowColor('rgba(22, 22, 22, 1)')
					.setShadowOffsetY(5)
					.setShadowBlur(10)
					.printCircle(84, 90, 62)
					.printCircularImage(avatar, 84, 90, 64)
					.save()
					.createRoundedClip(20, 138, 128, 32, 5)
					.setColor('#23272A')
					.fill()
					.restore()
					.setTextAlign('center')
					.setTextFont('10pt Discord')
					.setColor('#FFFFFF')
					.printText(name, 285, 54)
					.printText(`Level: ${level.toLocaleString()}`, 84, 159)
					.setTextAlign('left')
					.printText(`XP: ${points.toLocaleString()}`, 241, 136)
					.toBuffer();
			} catch (error) {
				message.reply(`Something happened: \`${error.message}\``);
				console.error(error);
			}
		}

		const key = `${message.guild.id}-${user.id}`;

		this.client.points.ensure(`${message.guild.id}-${user.id}`, {
			user: user.id,
			guild: message.guild.id,
			points: 0,
			level: 1,
		});

		const buffer = await profile(this.client, user, key);
		const filename = `profile-${user.id}.jpg`;
		const attachment = new MessageAttachment(buffer, filename);

		message.reply({ files: [attachment] });
	}
};
