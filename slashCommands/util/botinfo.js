const Discord = require('discord.js');
const Commando = require('slash-create');
const os = require('os');

const cpus = os.cpus();
const cpu = cpus[0];

const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);

const usage = process.cpuUsage();
const currentCPUUsage = (usage.user + usage.system) * 1000;

const percent = ((currentCPUUsage / total) * 100) / 100;

const si = require('systeminformation');

const functions = require('../../utils/functions.js');

module.exports = class BotInfo extends Commando.SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'botinfo',
			description: 'Shows bot info.',
		});

		this.filePath = __filename;
	}

	async run(ctx) {
		const message = await ctx.fetch(ctx.messageID);
		
		const owner = await this.client.users.fetch(this.client.config.discord.ownerID).catch((err) => {
			return console.error(err);
		});

		if (!owner) {
			return console.error('Unable to find the owner! Check the ownerID value.');
		}

		const embed = new Discord.MessageEmbed()
			.setTitle('General Info')
			.addFields(
				{ name: 'Name', value: this.client.user.username, inline: true },
				{ name: 'Bot ID', value: this.client.user.id, inline: true },
				{ name: 'Latency', value: `${this.client.ws.ping}ms`, inline: true },
				{ name: 'Discord.js Version', value: Discord.version, inline: true },
				{ name: 'Node.js Version', value: process.versions.node, inline: true },
				{ name: 'Commands', value: this.client.commandHandler.modules.size.toString(), inline: true },
				{ name: 'Slash Commands', value: this.creator.commands.size.toString(), inline: true }
				// { name: '\u200B', value: '\u200B' }
			)
			// .setImage('https://media.giphy.com/media/3og0IzI7ASX3mW5csg/giphy.gif')
			.setThumbnail(this.client.user.displayAvatarURL())
			.setColor(this.client.config.discord.accentColor)
			.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.dynamicAvatarURL())
			.setTimestamp();

		let ownerInThisGuild;
		
		embed.addField('Bot Owner', `${owner.tag}`, true);

		embed
			.addField('Vote', '[Top.gg](https://top.gg/bot/873922961491525682/vote)', true);

		return ctx.send({ embeds: [embed] });

		// if (ctx.user.id == this.client.config.discord.ownerID) {
		// 	// ctx.user.send('Additional info since you have admin permissions:');

		// 	const cpuData = await si.cpu();
		// 	const memData = await si.mem();
		// 	const osData = await si.osInfo();

		// 	const embed1 = new Discord.MessageEmbed()
		// 		.setTitle('CPU Info')
		// 		.setThumbnail(this.client.user.displayAvatarURL())
		// 		.setColor(this.client.config.discord.accentColor)
		// 		.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL({ dynamic: true }))
		// 		.setTimestamp();
		// 	const embed2 = new Discord.MessageEmbed()
		// 		.setTitle('Memory Info')
		// 		.setThumbnail(this.client.user.displayAvatarURL())
		// 		.setColor(this.client.config.discord.accentColor)
		// 		.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL({ dynamic: true }))
		// 		.setTimestamp();
		// 	const embed3 = new Discord.MessageEmbed()
		// 		.setTitle('OS Info')
		// 		.setThumbnail(this.client.user.displayAvatarURL())
		// 		.setColor(this.client.config.discord.accentColor)
		// 		.setFooter(`Requested by ${ctx.user.tag}`, ctx.user.displayAvatarURL({ dynamic: true }))
		// 		.setTimestamp();

		// 	embed1.addFields(
		// 		{ name: 'Manufacturer', value: cpuData.manufacturer, inline: true },
		// 		{ name: 'Brand', value: cpuData.brand, inline: true },
		// 		{ name: 'CPU Speed', value: `${cpuData.speed} GHz`, inline: true },
		// 		{ name: 'Cores', value: cpuData.physicalCores.toString(), inline: true },
		// 		{ name: 'Logical Processors', value: cpuData.cores.toString(), inline: true },
		// 		{ name: 'Current Load', value: `${Math.round(percent)}%`, inline: true }
		// 		// `Manufacturer: ${cpuData.manufacturer}\nBrand: ${cpuData.brand}\nSpeed: ${cpuData.speed}GHz\nLogical cores: ${cpuData.cores}\nPhysical cores: ${
		// 		// 	cpuData.physicalCores
		// 		// }\nCurrent load: ${Math.round(perc)}%`
		// 	);

		// 	embed2.addFields(
		// 		{ name: 'Total', value: functions.formatBytes(memData.total), inline: true },
		// 		{ name: 'Free', value: functions.formatBytes(memData.free), inline: true },
		// 		{ name: 'Used', value: functions.formatBytes(memData.used), inline: true },
		// 		{ name: 'Cached', value: functions.formatBytes(memData.cached), inline: true },
		// 		{ name: 'Available', value: functions.formatBytes(memData.available), inline: true },
		// 		{ name: 'Active', value: functions.formatBytes(memData.active), inline: true }
		// 		// `Total: ${functions.formatBytes(memData.total)}\nFree: ${functions.formatBytes(memData.free)}\nUsed: ${functions.formatBytes(memData.used)} (${functions.formatBytes(
		// 		// 	memData.cached
		// 		// )} cached)\nAvailable: ${functions.formatBytes(memData.available)}\nActive: ${functions.formatBytes(memData.active)}`
		// 	);

		// 	embed3.addFields(
		// 		{ name: 'Platform', value: functions.toTitleCase(osData.platform), inline: true },
		// 		{ name: 'Distro', value: osData.distro, inline: true },
		// 		{ name: 'Architecture', value: osData.arch, inline: true },
		// 		{ name: 'Release', value: osData.release, inline: true },
		// 		{ name: 'Codename', value: osData.codename || 'None', inline: true },
		// 		{ name: 'Codepage', value: osData.codepage || 'None', inline: true },
		// 		{ name: 'Kernel', value: osData.kernel, inline: true }
		// 		// `Platform: ${functions.toTitleCase(osData.platform)}\nDistro: ${osData.distro}\nRelease: ${osData.release}\nCodename: ${osData.codename}\nKernel: ${osData.kernel}\nArchitecture: ${
		// 		// 	osData.arch
		// 		// }`
		// 	);

		// 	ctx.user.send(embed1);
		// 	ctx.user.send(embed2);
		// 	ctx.user.send(embed3);
		// }
	}
};
