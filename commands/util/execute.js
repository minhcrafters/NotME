const Commando = require('discord-akairo');
const discord = require('discord.js');
const tags = require('common-tags');
const { MessageEmbed } = require('discord.js');
const { exec } = require("child_process");
const util = require('util');

function makeResultMessages(result, hrDiff, input = null) {
	const inspected = util.inspect(result, {
			depth: 0
		})
		.replace(nlPattern, '\n')
	const split = inspected.split('\n');
	const last = inspected.length - 1;
	const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
	const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ? split[split.length - 1] : inspected[last];
	const prepend = `\`\`\`javascript\n${prependPart}\n`;
	const append = `\n${appendPart}\n\`\`\``;
	if (input) {
		return discord.Util.splitMessage(tags.stripIndents`
			*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
			\`\`\`javascript
			${inspected}
			\`\`\`
		`, {
			maxLength: 1900,
			prepend,
			append
		});
	} else {
		return discord.Util.splitMessage(tags.stripIndents`
			*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
			\`\`\`javascript
			${inspected}
			\`\`\`
		`, {
			maxLength: 1900,
			prepend,
			append
		});
	}
}

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('execute', {
			aliases: ['execute', 'exec'],
			category: 'util',
			ownerOnly: true,
			description: 'Executes CLI code.',
			args: [
				{
					id: 'script',
					match: 'content',
					prompt: {
						start: 'What command(s) would you like to execute?'
					},
					type: 'string'
				}
			]
		});
	}

	async exec(message, args) {
		let code = args.script;

		if (code.startsWith('```') && code.endsWith('```')) {
			code = code.replace(/(^.*?\s)|(\n.*$)/g, '');
		}

		exec(code, function (error, stdout, stderr) {
			let hrDiff;
			try {
				const hrStart1 = process.hrtime();
				hrDiff = process.hrtime(hrStart1);
			} catch (err) {
				return message.reply(`Error while executing: \`${err}\``);
			}

			// Prepare for callback time and respond
			// let hrStart = process.hrtime();
			const result = makeResultMessages(stdout, hrDiff, args.script);
			if (Array.isArray(result)) {
				result.map(item => message.reply(item));
			} else {
				message.reply(result);
			}

			if (error) {
				console.log(error.stack);
				console.log('Error code: ' + error.code);
				console.log('Signal received: ' + error.signal);
			}

			// message.channel.send(stdout, { code: true, split: true });

			const embed = new MessageEmbed()
				.setColor(message.client.config.discord.accentColor)
				.addField('Input', `\`\`\`js\n${code}\n\`\`\``, false)
				.addField('Error(s)', `\`\`\`js\n${stderr ? stderr : 'None'}\n\`\`\``, false)
				.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
				.setTimestamp();

			return message.channel.send({ embeds: [embed] });
		});
	}
};
