const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('latex', {
			aliases: ['latex', 'tex'],
			category: 'math',
			description: 'Renders LaTeX.',
			args: [
				{
					id: 'anything',
					type: 'string',
				},
			],
		});
	}

	async exec(message, { anything }) {
		const tex = anything;

		functions
			.typeset(tex)
			.then((image) => {
				functions.attachImage(message.channel, image, 'Result:');
			})
			.catch((err) => {
				message.channel.send(`${this.client.emotes.error} - **LaTeX Error**\n\`\`\`js\n${err}\n\`\`\``);
			});
	}
};
