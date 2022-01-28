const db = require('quick.db');
const Commando = require('discord-akairo');

module.exports = class Command extends Commando.Command {
	constructor() {
		super('mfilter', {
			aliases: ['mfilter'],
			category: 'music',
			channel: 'guild',
			description: 'Sets filters to a queue. (The filter may sometimes cause music to stop playing, so please try again.)',
			userPermissions: ['CONNECT', 'SPEAK'],
			clientPermissions: ['CONNECT', 'SPEAK'],
			// args: [
			// 	{
			// 		id: 'filter',
			// 		type: 'string'
			// 	}
			// ]
		});
	}

	async exec(message, args) {		
		const queue = this.client.player.getQueue(message.guild.id);

		if (!message.member.voice.channel) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not connected in any voice channel!", message)}`);

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
			return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("You're not in the same voice channel!", message)}`);

		if (!queue) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("No music is currently playing!", message)}`);

		if (!args[0]) return message.channel.send(`${this.client.emotes.error} - Please specify a valid filter!`);

		if (db.get(`${message.guild.id}.queueCreator`) !== message.author.id) {
			if (!message.member.permissions.has("ADMINISTRATOR") || !message.member.roles.cache.some(role => role.name == 'DJ')) {
				return message.reply(`${this.client.emotes.error} - This command is for the user who created this queue or users who have the DJ role only.`);
			}

			return message.reply(`${this.client.emotes.error} - This command is for the user who created this queue or users who have the DJ role only.`);
		}

		let enabledFilters = queue.filters;

		if (!enabledFilters) enabledFilters = [];

		let disabledFilters = [];

		for (const filter of Object.keys(this.client.player.filters)) {
			disabledFilters.push(filter);
		}

		let filters = [...disabledFilters, ...enabledFilters].unique();

		if (args[0].match(/off|disable/g)) {
			db.set(`${message.guild.id}.musicFilters`, []);

			const success = await queue.setFilter(false);
			if (success) return message.channel.send(`${this.client.emotes.off} - ${await this.client.language('Disabled active filters.', message)}`);
		}

		let filtersUpdated = [];

		const filterToUpdate = filters.find((x) => x.toLowerCase() === args[0].toLowerCase());

		if (!filterToUpdate) return message.channel.send(`${this.client.emotes.error} - ${await this.client.language("This filter doesn't exist!", message)}`);

		filtersUpdated.push(filterToUpdate);

		// if (!db.has(`${message.guild.id}.musicFilters.${filterToUpdate}`)) {
		// 	message.channel.send(`${this.client.emotes.music} - I'm **adding** the filter to the queue, please wait... (NOTE: The longer the music is, the longer this will take)`);
		// } else {
		// 	message.channel.send(`${this.client.emotes.music} - I'm **removing** the filter from the queue, please wait... (NOTE: The longer the music is playing, the longer this will take)`);
		// }

		if (!db.has(`${message.guild.id}.musicFilters`) || !enabledFilters.find((x) => x.toLowerCase() === args[0].toLowerCase())) {
			db.set(`${message.guild.id}.musicFilters`, filtersUpdated);

			const result = db.get(`${message.guild.id}.musicFilters`);

			console.log(result);

			message.channel.send(
				`${this.client.emotes.music} - ${await this.client.language(`I'm **adding** the **${filterToUpdate.toLowerCase()}** filter to the queue, please wait... (NOTE: The longer the music is, the longer this will take)`, message)}`
			);

			const success = await queue.setFilter(result);

			if (success) message.channel.send(`${this.client.emotes.success} - ${await this.client.language(`Successfully added **${filterToUpdate.toLowerCase()}** filter!`, message)}`);
		} else {
			const filter1 = enabledFilters.find((x) => x.toLowerCase() === args[0].toLowerCase());

			let curFilters = enabledFilters;

			let removedFilters = [];

			if (filter1) {
				removedFilters = curFilters.filter((filter2) => {
					return filter2 == filter1;
				});
			} else {
				return message.channel.send(`${this.client.emotes.error} - ${await this.client.language('That filter is not enabled!', message)}`);
			}

			db.set(`${message.guild.id}.musicFilters`, removedFilters);

			const result = db.get(`${message.guild.id}.musicFilters`);

			console.log(result);

			message.channel.send(
				`${this.client.emotes.music} - ${await this.client.language(`I'm **removing** the **${filterToUpdate.toLowerCase()}** filter from the queue, please wait... (NOTE: The longer the music is, the longer this will take)`, message)}`
			);

			const success = await queue.setFilter(result);

			if (success) message.channel.send(`${this.client.emotes.success} - ${await this.client.language(`Successfully removed **${filterToUpdate.toLowerCase()}** filter!`, message)}`);
		}
	}
};
