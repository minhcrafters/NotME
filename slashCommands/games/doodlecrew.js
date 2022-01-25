const Discord = require('discord.js');
const { SlashCommand, CommandOptionType, ChannelType } = require('slash-create');

module.exports = class DoodleCrew extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'doodlecrew',
			description: 'Play Doodle Crew, a Discord\'s new game.',
			options: [{
				type: CommandOptionType.CHANNEL,
				name: 'voiceChannel',
				description: 'What voice channel?',
				required: true,
				channel_types: ['GUILD_VOICE'],
			}]
		});
		
		this.filePath = __filename;
	}

	async run(ctx) {
		this.client.discordTogether.createTogetherCode(ctx.options.voiceChannel, 'doodlecrew').then(async (invite) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Doodle Crew')
				.setColor(this.client.config.discord.accentColor)
				.setTimestamp()
				.setTitle(await this.client.language('Click here to join', ctx))
				.setURL(invite.code);

			return ctx.send({ embeds: [embed] });
		});
	}
};
