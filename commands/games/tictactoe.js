const Commando = require('discord-akairo');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' });

module.exports = class Command extends Commando.Command {
	constructor() {
		super('tictactoe', {
			aliases: ['tic-tac-toe', 'ttt'],
			category: 'games',
			channel: 'guild',
			description: 'x and o',
			clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL'],
		});
	}

	async exec(message) {
		game.handleMessage(message);
	}
};
