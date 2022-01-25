const Commando = require('discord-akairo');
const { DiscordUNO } = require("discord-uno");

const discordUNO = new DiscordUNO();

module.exports = class Command extends Commando.Command {
	constructor() {
		super('uno', {
			aliases: ['uno'],
			category: 'games',
			channel: 'guild',
			description: 'Play UNO! with friends.',
			clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL'],
		});
	}

	async exec(message, args) {
		if (!args) {
			return message.inlineReply(`Do \`${message.guild.commandPrefix}uno create\` to create a game!`)
		}

		if (args[0] == 'create') {
			const created = await discordUNO.createGame(message);
			message.channel.send(created);
		}

		if (args[0] == 'join') {
			await discordUNO.addUser(message);
		}

		if (args[0] == 'leave') {
			await discordUNO.removeUser(message);
		}

		if (args[0] == 'start') {
			await discordUNO.startGame(message);
		}

		if (args[0] == 'end') {
			await discordUNO.endGame(message);
		}

		if (args[0] == 'closegame') {
			await discordUNO.closeGame(message);
		}

		if (args[0] == 'playcard') {
			await discordUNO.addUser(message);
		}

		if (args[0] == 'UNO') {
			await discordUNO.UNO(message);
		}

		if (args[0] == 'draw') {
			await discordUNO.draw(message);
		}

		if (args[0] == 'cards') {
			await discordUNO.viewCards(message);
		}

		if (args[0] == 'table') {
			await discordUNO.viewTable(message);
		}

		if (args[0] == 'winners') {
			await discordUNO.viewWinners(message);
		}

		if (args[0] == 'settings') {
			await discordUNO.updateSettings(message);
		}

		if (args[0] == 'viewsettings') {
			await discordUNO.viewSettings(message);
		}
	}
};
