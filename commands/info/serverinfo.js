const axios = require('axios').default;
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

module.exports = class UserInfo extends Commando.Command {
	constructor() {
		super('serverinfo', {
			aliases: ['serverinfo', 'server'],
			category: 'info',
			channel: 'guild',
			description: 'Get information about the server.',
		});
	}

	async exec(message) {
		const embed = new MessageEmbed()
			.setTitle(message.guild.name)
			.setThumbnail(message.guild.iconURL())
			.setColor(this.client.config.discord.accentColor)
			.addField('Common Information', [
				`**Name:** ${message.guild.name}`,
				`**ID:** \`${message.guild.id}\``,
				`**Owner:** ${(await message.guild.fetchOwner()).user.tag} (<@${message.guild.ownerId}>)`
			].join('\r\n'))
			.addField('Counts', [
				`**Roles:** ${message.guild.roles.cache.size}`,
				`**Channels:** ${message.guild.channels.cache.size} total (Text: ${message.guild.channels.cache.filter(ch => ch.type == 'GUILD_TEXT').size}, Voice: ${message.guild.channels.cache.filter(ch => ch.type == 'GUILD_VOICE').size}, Stage: ${message.guild.channels.cache.filter(ch => ch.type == 'GUILD_STAGE_VOICE').size}, Category: ${message.guild.channels.cache.filter(ch => ch.type == 'GUILD_CATEGORY').size}, News: ${message.guild.channels.cache.filter(ch => ch.type == 'GUILD_NEWS').size}, Store: ${message.guild.channels.cache.filter(ch => ch.type == 'GUILD_STORE').size}, Unknown: ${message.guild.channels.cache.filter(ch => ch.type == 'UNKNOWN').size})`,
				`**Emojis:** ${message.guild.emojis.cache.size} total (Static: ${message.guild.emojis.cache.filter(e => !e.animated).size}, Animated: ${message.guild.emojis.cache.filter(e => e.animated).size})`,
			].join('\r\n'))
			.addField('Additional Information', [
				`**Created at:** <t:${moment(message.guild.createdTimestamp).unix()}> (<t:${moment(message.guild.createdTimestamp).unix()}:R>)`,
				`**Region:** (Deprecated)`,
				`**Boost Tier:** ${message.guild.premiumTier ? `${message.guild.premiumTier.replace(/_/g, ' ').toTitleCase()}` : 'None'}`,
				`**Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
				`**Has a rules channel?**: ${message.rulesChannel ? `Yes, so read the rules in ${message.rulesChannel}.` : `Unfortunately no.`}`
			].join('\r\n'))
			.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}
};
