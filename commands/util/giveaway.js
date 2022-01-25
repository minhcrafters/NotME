const ms = require('ms');

const types = ['start', 'edit', 'reroll', 'delete', 'end', 'pause', 'unpause'];

const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('giveaway', {
			aliases: ['giveaway', 'g'],
			category: 'util',
			channel: 'guild',
			description: 'Do some giveaways.',
			userPermissions: ['MANAGE_GUILD'],
			args: [
				{
					id: 'subCommands',
					type: ['start', 'edit', 'reroll', 'delete', 'end', 'pause', 'unpause'],
				},
			]
		});
	}

	async exec(message, args) {
		console.log(args);
		if (!args.subCommands) {
			return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nAvailable actions are: ${types.map((x) => `\`${x}\``).join(', ')}.`);
		}

		if (args.subCommands == 'start') {
			if (!args[1] || !args[2] || !args[3]) {
				return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway start <duration> <winners_count> <prize_name>\`.`);
			}

			const duration = args[1];
			const winnerCount = parseInt(args[2]);
			const prize = args.slice(3).join(' ');

			this.client.giveawaysManager
				.start(message.channel, {
					duration: ms(duration),
					winnerCount,
					prize,
					messages: {
						giveaway: '🎉 **GIVEAWAY** 🎉',
						giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
						drawing: 'Ends {timestamp}',
						embedFooter: '{this.winnerCount} winner(s)',
					},
				})
				.then((gData) => {
					console.log(gData);
				});
		} else if (args.subCommands == 'reroll') {
			if (!args[3] || !args[1] || !args[2] || !args[4]) {
				return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway reroll <giveaway_message_id>\`.`);
			}

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = args[1].toString();
			this.client.giveawaysManager
				.reroll(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway rerolled!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (args.subCommands == 'edit') {
			if (!args[3] || !args[1] || !args[2] || !args[4]) {
				return message.channel.send(
					`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway edit <giveaway_message_id> <add_time> <new_winners_count> <new_prize_name>\`.`
				);
			}

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = args[1].toString();
			const addTime = args[2];
			const newWinnerCount = args[3];
			const newPrize = args.slice(5).join(' ');

			this.client.giveawaysManager
				.edit(messageId, {
					addTime: parseInt(addTime),
					newWinnerCount: parseInt(newWinnerCount),
					newPrize: newPrize,
				})
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway edited!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (args.subCommands == 'delete') {
			if (!args[1]) {
				return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway delete <giveaway_message_id>\`.`);
			}

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = args[1].toString();
			this.client.giveawaysManager
				.delete(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway deleted!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (args.subCommands == 'end') {
			if (!args[1]) {
				return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway end <giveaway_message_id>\`.`);
			}

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = args[1].toString();
			this.client.giveawaysManager
				.end(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway ended!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (args.subCommands == 'pause') {
			if (!args[1]) {
				return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway pause <giveaway_message_id>\`.`);
			}

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = args[1].toString();
			this.client.giveawaysManager
				.pause(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway paused!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (args.subCommands == 'unpause') {
			if (!args[1]) {
				return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway unpause <giveaway_message_id>\`.`);
			}

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = args[1].toString();
			this.client.giveawaysManager
				.unpause(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway un-paused!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		}
	}
};
