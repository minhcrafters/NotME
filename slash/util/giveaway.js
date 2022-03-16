const ms = require('ms');

const types = ['start', 'edit', 'reroll', 'delete', 'end', 'pause', 'unpause'];

const { SlashCommand, CommandOptionType } = require('slash-create');

module.exports = class GiveawayCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'giveaway',
			description: 'Makes a giveaway or modify it.',
			options: [
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'start',
					description: 'Start a giveaway.',
					options: [
						{
							name: 'duration',
							description: 'Duration of the giveaway.',
							type: CommandOptionType.STRING,
							required: true
						},
						{
							name: 'winnerCount',
							description: 'Winners count of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
						{
							name: 'prize',
							description: 'The prize of the giveaway.',
							type: CommandOptionType.STRING,
							required: true
						}
					]
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'edit',
					description: 'Edit an existing giveaway.',
					options: [
						{
							name: 'giveawayId',
							description: 'The message ID of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
						{
							name: 'addTime',
							description: 'Amount of time to add to the giveaway.',
							type: CommandOptionType.STRING,
							required: false
						},
						{
							name: 'newWinnerCount',
							description: 'New winners count of the giveaway.',
							type: CommandOptionType.STRING,
							required: false
						},
						{
							name: 'newPrize',
							description: 'New prize of the giveaway.',
							type: CommandOptionType.STRING,
							required: false
						}
					]
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'reroll',
					description: 'Reroll exist giveaway.',
					options: [
						{
							name: 'giveawayId',
							description: 'The message ID of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
					]
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'delete',
					description: 'Deletes an existing giveaway.',
					options: [
						{
							name: 'giveawayId',
							description: 'The message ID of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
					]
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'end',
					description: 'End an existing giveaway.',
					options: [
						{
							name: 'giveawayId',
							description: 'The message ID of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
					]
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'pause',
					description: 'Pause an existing giveaway.',
					options: [
						{
							name: 'giveawayId',
							description: 'The message ID of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
					]
				},
				{
					type: CommandOptionType.SUB_COMMAND,
					name: 'resume',
					description: 'Resume an existing giveaway.',
					options: [
						{
							name: 'giveawayId',
							description: 'The message ID of the giveaway.',
							type: CommandOptionType.INTEGER,
							required: true
						},
					]
				}
			]
		});

		this.filePath = __filename;
	}

	async run(ctx) {
		let command = ctx.subcommands[0];
		
		// if (!command) {
		// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nAvailable actions are: ${types.map((x) => `\`${x}\``).join(', ')}.`);
		// }

		if (command == 'start') {
			// if (!args[1] || !args[2] || !args[3]) {
			// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway start <duration> <winners_count> <prize_name>\`.`);
			// }

			const duration = Object.keys(ctx.options[command])[0];
			const winnerCount = Object.keys(ctx.options[command])[1];
			const prize = Object.keys(ctx.options[command])[2];

			return this.client.giveawaysManager
				.start(ctx.channels.first(), {
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
		} else if (command == 'reroll') {
			// if (!args[3] || !args[1] || !args[2] || !args[4]) {
			// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway reroll <giveaway_message_id>\`.`);
			// }

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = (Object.keys(ctx.options[command])[0]).toString();
			return this.client.giveawaysManager
				.reroll(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway rerolled!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (command == 'edit') {
			// if (!args[3] || !args[1] || !args[2] || !args[4]) {
			// 	return message.channel.send(
			// 		`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway edit <giveaway_message_id> <add_time> <new_winners_count> <new_prize_name>\`.`
			// 	);
			// }

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = (Object.keys(ctx.options[command])[0]).toString();
			const addTime = Object.keys(ctx.options[command])[1];
			const newWinnerCount = Object.keys(ctx.options[command])[2];
			const newPrize = Object.keys(ctx.options[command])[3];

			return this.client.giveawaysManager
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
		} else if (command == 'delete') {
			// if (!args[1]) {
			// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway delete <giveaway_message_id>\`.`);
			// }

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = (Object.keys(ctx.options[command])[0]).toString();
			return this.client.giveawaysManager
				.delete(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway deleted!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (command == 'end') {
			// if (!args[1]) {
			// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway end <giveaway_message_id>\`.`);
			// }

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = (Object.keys(ctx.options[command])[0]).toString();
			return this.client.giveawaysManager
				.end(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway ended!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (command == 'pause') {
			// if (!args[1]) {
			// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway pause <giveaway_message_id>\`.`);
			// }

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = (Object.keys(ctx.options[command])[0]).toString();
			return this.client.giveawaysManager
				.pause(messageId)
				.then(() => {
					message.channel.send(`${this.client.emotes.success} - Success! Giveaway paused!`);
				})
				.catch((err) => {
					message.channel.send(`${this.client.emotes.error} - An error has occurred, please check and try again.\n\`\`\`js\n${err}\n\`\`\``);
				});
		} else if (command == 'resume') {
			// if (!args[1]) {
			// 	return message.channel.send(`${this.client.emotes.error} - Missing required argument!\nCorrect usage: \`${this.client.commandPrefix}giveaway unpause <giveaway_message_id>\`.`);
			// }

			let giveaway = this.client.giveawaysManager.giveaways.find((g) => g.guildId === message.guild.id && g.messageId === args[1]);

			if (!giveaway) return message.channel.send(this.client.emotes.error + ' - Unable to find a giveaway for `' + args.slice(1).join(' ') + '`.');

			const messageId = (Object.keys(ctx.options[command])[0]).toString();
			return this.client.giveawaysManager
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
