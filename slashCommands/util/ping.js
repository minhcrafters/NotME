const { SlashCommand, CommandOptionType } = require('slash-create');

module.exports = class Ping extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'ping',
			description: 'Returns pong.',
			options: [{
				type: CommandOptionType.STRING,
				name: 'food',
				description: 'What food do you like?'
			}]
		});

		this.filePath = __filename;
	}

	async run(ctx) {
		return ctx.options.food ? `You like ${ctx.options.food}? Nice!` : 'Pong!';
	}
}