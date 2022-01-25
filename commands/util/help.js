const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

function disambiguation(items, label, property = 'name') {
	const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return `Multiple ${label} found, please be more specific: ${itemList}`;
}

module.exports = class HelpCommand extends Commando.Command {
	constructor() {
		super('help', {
			aliases: ['help', 'h', 'cmds', 'commands', 'modules'],
			category: 'util',
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			args: [
				{
					id: 'command',
					prompt: {
						start: 'What command?',
						optional: true
					},
					type: 'commandAlias',
				}
			]
		})
	}

	async exec(message, args) {
		const groups = this.client.commandHandler.categories;
		const commands = args.command;
		// const commands = this.client.commandHandler.findCommand(args.command.aliases[0]);

		if (args.command) {
			const embed = new MessageEmbed()
				.setTitle(`Command help for ${commands.id}`)
				.setColor(this.client.config.discord.accentColor)
				.setThumbnail(this.client.user.displayAvatarURL())
				.setDescription(commands.description + '\n\n' + '_For a list of commands, go to\nhttps://notme.bot.nu/commands/_')
				.setFooter('Required arguments: <> - Optional arguments: []')
				.setTimestamp()
				.addFields(
					{ name: 'Name', value: commands.toString(), inline: true },
					{ name: 'Category', value: commands.category.id, inline: true },
					{ name: 'Alias(es)', value: commands.aliases.length < 1 ? 'None' : commands.aliases.map(x => `\`${x}\``).join(', '), inline: true },
					{ name: 'Details', value: commands.details ? commands.details : 'None', inline: false },
					// { name: 'Usage', value: message.anyUsage(`${commands.toString()}${commands.format ? ` ${commands.format}` : ''}`), inline: false }
				);

			return message.channel.send({ embeds: [embed] });
			// if (commands.length == 1) {
				
			// } else if (commands.length > 15) {
			// 	return message.reply('Multiple commands found. Please be more specific.');
			// } else if (commands.length > 1) {
			// 	return message.reply(disambiguation(commands, 'commands'));
			// } else {
			// 	return message.reply(
			// 		`Unable to identify command.`
			// 	);
			// }
		} else {
			const embed = new MessageEmbed()
				.setTitle('Help Panel')
				.setThumbnail(this.client.user.displayAvatarURL())
				.setColor(this.client.config.discord.accentColor)
				.setDescription(`
					[Invite ${this.client.user.username}](https://notme.bot.nu/invite) - [Support Server](https://discord.gg/abh6udHCd2) - [Top.gg Vote](https://top.gg/bot/873922961491525682/vote)\n
					For a list of commands, go to\nhttps://notme.bot.nu/commands/
					`)
				.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			// groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(message))))
			// 	.map(grp => {
			// 		embed.addField(grp.name, grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(message)))
			// 		.map(cmd => `\`${cmd.name}\``).join(', '), false);
			// 	});

			return message.channel.send({ embeds: [embed] });
		}
	}
}