const { MessageEmbed } = require('discord.js');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('give-xp', {
			aliases: ['give-xp', 'xp-give'],
			category: 'levelling',
			channel: 'guild',
			description: 'Gives some XP to other members.',
			userPermissions: ['MANAGE_GUILD'],
			args: [
				{
					id: 'user',
					type: 'member',
				},
				{
					id: 'points',
					prompt: {
						start: 'How many XP do you want to give this member?'
					},
					type: 'integer',
				},
			],
		});
	}

	async exec(message, { user, points }) {
		const pointsToAdd = parseInt(points, 10);
		if (!pointsToAdd) return message.inlineReply((await this.client.language("You didn't tell me how many points to give...", message)));

		this.client.points.ensure(`${message.guild.id}-${user.user.id}`, {
			user: message.author.id,
			guild: message.guild.id,
			points: 0,
			level: 1,
		});

		let userPoints = this.client.points.get(`${message.guild.id}-${user.user.id}`, 'points');

		userPoints += pointsToAdd;

		this.client.points.set(`${message.guild.id}-${user.user.id}`, userPoints, 'points');
		message.channel.send((await this.client.language(`**${user.user.tag}** has received **${pointsToAdd}** XP and now stands at **${userPoints}** XP.`, message)));
	}
};
