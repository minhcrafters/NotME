// const fs = require('fs');
const Statcord = require("statcord.js");
const { MessageEmbed, Intents, Collection, Structures } = require('discord.js');
const config = require('./utils/config.js');
const { AutoPoster } = require('topgg-autoposter');
const DisTube = require('distube');
var Logger = require('@logdna/logger');
const { SlashCreator, GatewayServer } = require('slash-create');
const fetch = require("node-fetch");
const economy = require('discord-bot-eco');
const path = require('path');
const db = require('quick.db');

var logger = Logger.createLogger(process.env.LOGDNA_KEY);

const axios = require('axios').default;

const apikey = process.env.HYPIXEL;

const HypixelAPIReborn = require('hypixel-api-reborn');
const hypixelAPIReborn = new HypixelAPIReborn.Client(apikey);

const { AkairoClient, CommandHandler, ListenerHandler, SQLiteProvider } = require('discord-akairo');

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

String.prototype.toTitleCase = function () {
	return this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	});
};

class Client extends AkairoClient {
	constructor() {
        super({
            ownerID: config.discord.ownerID,
        }, {
            disableMentions: 'everyone',
			shards: "auto",
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_INTEGRATIONS],
        });

		// this.settings = new SQLiteProvider(sqlite.open({ filename: './database.sqlite', driver: sqlite3.Database }), 'settings', {
        //     idColumn: 'guild',
        //     dataColumn: 'settings'
        // });

        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
			aliasReplacement: /-/g,
    		allowMention: true,
    		prefix: message => {
                if (message.guild) {
                    // return this.settings.get(message.guild.id, 'prefix', config.discord.prefix);
					if (db.has(`${message.guild.id}.prefix`)) {
						return db.get(`${message.guild.id}.prefix`);
					} else {
						db.set(`${message.guild.id}.prefix`, config.discord.prefix);
						return db.get(`${message.guild.id}.prefix`);
					}
                }

                return config.discord.prefix;
            },
			// argumentDefaults: {
			// 	prompt: {
			// 		modifyStart: text => `${text}\nType \`cancel\` to cancel this command.`,
			// 		modifyRetry: text => `${text}\nType \`cancel\` to cancel this command.`,
			// 		timeout: 'Time ran out, command has been cancelled.',
			// 		ended: 'Too many retries, command has been cancelled.',
			// 		cancel: 'Command has been cancelled.',
			// 		retries: 4,
			// 		time: 30000
			// 	}
			// }
        });

		this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
    }

	// async login(token) {
	// 	await this.settings.init();
	// 	return super.login(token);
	// }
}

const client = new Client();

const statcord = new Statcord.Client({
    client,
    key: process.env.STATCORD
});

client.economy = economy;
client.statcord = statcord;

Array.prototype.unique = function () {
	var a = this.concat();
	for (var i = 0; i < a.length; ++i) {
		for (var j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) a.splice(j--, 1);
		}
	}

	return a;
};

const weky = require('weky');

const functions = require('./utils/functions.js');

client.functions = functions;

const neko_client = require('nekos.life');
const neko = new neko_client();
const translate = require('@vitalets/google-translate-api');

client.nekos = neko;

const { DiscordTogether } = require('discord-together');

client.hypixelAPIReborn = hypixelAPIReborn;
client.HypixelAPIReborn = HypixelAPIReborn;

client.discordInstance = require('discord.js');

client.discordTogether = new DiscordTogether(client);

client.weky = weky;

client.logger = logger;

client.language = async (text, message) => {
	return text;

	// TODO: Implement Language System
	// let lang = 'en';

	// if (message.guild) {
	// 	lang = db.has(`${message.guild.id}.lang`) ? db.get(`${message.guild.id}.lang`) : 'en';
	// }
	
	// if (lang == 'en') return text.toString();

	// const translated = await translate(text, { from: 'en', to: lang });

	// return translated.text.toString().replace(/< @ /g, '<@').replace(/<# /g, '<#').replace(/<@ /g, '<@').replace(/< # /g, '<#').replace(/ # /g, '#').replace(/＃/g, '#');
}

if (!Array.isArray(db.get('giveaways'))) db.set('giveaways', []);

const { GiveawaysManager } = require('discord-giveaways');

const GiveawayManager2 = class extends GiveawaysManager {
	// This function is called when the manager needs to get all giveaways which are stored in the database.
	async getAllGiveaways() {
		// Get all giveaways from the database
		return db.get('giveaways');
	}

	// This function is called when a giveaway needs to be saved in the database.
	async saveGiveaway(messageId, giveawayData) {
		// Add the new giveaway to the database
		db.push('giveaways', giveawayData);
		// Don't forget to return something!
		return true;
	}

	// This function is called when a giveaway needs to be edited in the database.
	async editGiveaway(messageId, giveawayData) {
		// Get all giveaways from the database
		const giveaways = db.get('giveaways');
		// Remove the unedited giveaway from the array
		const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageId !== messageId);
		// Push the edited giveaway into the array
		newGiveawaysArray.push(giveawayData);
		// Save the updated array
		db.set('giveaways', newGiveawaysArray);
		// Don't forget to return something!
		return true;
	}

	// This function is called when a giveaway needs to be deleted from the database.
	async deleteGiveaway(messageId) {
		// Get all giveaways from the database
		const giveaways = db.get('giveaways');
		// Remove the giveaway from the array
		const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageId !== messageId);
		// Save the updated array
		db.set('giveaways', newGiveawaysArray);
		// Don't forget to return something!
		return true;
	}
};

const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');

const distube = new DisTube.default(client, {
	searchSongs: 10,
	leaveOnFinish: true,
	emitNewSongOnly: true,
	searchCooldown: 30,
	emptyCooldown: 30,
	customFilters: {
		"crystalizer": "crystalizer=i=4",
		"speed": "atempo=1",
		"speed_125": "atempo=1.25",
		"speed_150": "atempo=1.5",
		"speed_175": "atempo=1.75",
		"speed_200": "atempo=2",
		"speed_025": "atempo=0.25",
		"speed_050": "atempo=0.5",
		"speed_075": "atempo=0.75",
		"rickroll": "bass=g=33,apulsator=hz=0.06,vibrato=f=2.5,tremolo,asetrate=48000*0.8",
		"cursed": "vibrato=f=6.5,tremolo,aresample=48000,asetrate=48000*1.25",
		"clear": "dynaudnorm=f=200",
		"bassboost": "bass=g=20,dynaudnorm=f=200",
		"8D": "apulsator=hz=0.08",
		"vaporwave": "aresample=48000,asetrate=48000*0.8",
		"nightcore": "aresample=48000,asetrate=48000*1.25",
		"phaser": "aphaser=in_gain=0.4",
		"tremolo": "tremolo",
		"vibrato": "vibrato=f=6.5",
		"reverse": "areverse",
		"treble": "treble=g=5",
		"normalizer": "dynaudnorm=f=200",
		"surrounding": "surround",
		"pulsator": "apulsator=hz=1",
		"subboost": "asubboost",
		"karaoke": "stereotools=mlev=0.03",
		"flanger": "flanger",
		"gate": "agate",
		"haas": "haas",
		"mcompand": "mcompand",
	},
	emitAddSongWhenCreatingQueue: false,
	plugins: [
		new SpotifyPlugin({
			emitEventsAfterFetching: true,
			parallel: false
		}),
		new SoundCloudPlugin(),
	],
	ytdlOptions: {
		filter: 'audioonly',
		quality: 'highest',
		highWaterMark: 1 << 25,
	},
});

client.player = distube;
client.config = config;
client.emotes = client.config.emotes;
// client.filters = client.config.filters;
// client.commands = new Collection();
client.snipes = new Collection();

const manager = new GiveawayManager2(client, {
	default: {
		botsCanWin: false,
		embedColor: client.config.discord.accentColor,
		embedColorEnd: client.config.discord.accentColor,
		reaction: '🎉',
	},
});

client.giveawaysManager = manager;

// const ascii = require('ascii-table');
// let table = new ascii('Commands');
// table.setHeading('Command', 'Status');

// fs.readdirSync('./commands').forEach((dirs) => {
// 	const commands = fs.readdirSync(`./commands/${dirs}`).filter((files) => files.endsWith('.js'));

// 	for (const file of commands) {
// 		const command = require(`./commands/${dirs}/${file}`);
// 		if (command.name) {
// 			client.commands.set(command.name.toLowerCase(), command);
// 			table.addRow(file, 'Success');
// 		} else {
// 			table.addRow(file, 'Failed');
// 			continue;
// 		}
// 	}
// });

// logger.log(table.toString());

distube.on('playSong', async (queue, track) => {
	queue.textChannel.send(`${queue.client.emotes.music} - Now playing **${track.name}** to ${queue.voiceChannel.toString()} ...`);
});

distube.on('addSong', async (queue, song) => {
	queue.textChannel.send(`${queue.client.emotes.success} - ${await client.language(`Added **${song.name}** to the queue!`, queue.textChannel.lastMessage)}`);
});

distube.on('addList', async (queue, playlist) => {
	queue.textChannel.send(`${queue.client.emotes.success} - ${await client.language(`Added **${playlist.name}** playlist (${playlist.songs.length} songs) to the queue!`, queue.textChannel.lastMessage)}`);
});

distube.on('searchInvalidAnswer', async (message) => {
	message.channel.send((await client.language('You answered an invalid number!', message)))
	db.set(`${message.guild.id}.queueCreator`, null);
});

distube.on('searchResult', async (message, results) => {
	const embed = new MessageEmbed()
		.setColor(message.client.config.discord.accentColor)
		.setTitle((await client.language(`Choose a song to play`, message)))
		.setFooter((await client.language("Type the specified song's position in the chat\nor wait for 30 seconds to cancel.", message)))
		.setTimestamp()
		.setDescription(`${results.map((song, i) => `**#${i + 1}** - [${song.name}](${song.url}) by [${song.uploader.name}](${song.uploader.url}) - \`[${song.formattedDuration}]\``).join('\n')}`);

	message.channel.send({ embeds: [embed] });
});

distube.on('searchCancel', (queue) => {
	queue.textChannel.send(`${queue.client.emotes.error} - Search cancelled!`);
	db.set(`${queue.textChannel.guild.id}.queueCreator`, null);
});

// distube.on('queueEnd', (queue) => {
// 	queue.textChannel.send(`${message.client.emotes.off} - Music stopped as there is no more songs in the queue!`);
// });

// distube.on('connectionError', (queue, error) => {
// 	queue.textChannel.send(`${message.client.emotes.error} - I'm sorry, something went wrong...\`\`\`js\n${error}\n\`\`\``);
// });

distube.on('searchNoResult', async (message, query) => {
	message.channel.send(`${message.client.emotes.error} - ${await client.language(`No results found for \`${query}\`!`, message)}`);
	db.set(`${message.guild.id}.queueCreator`, null);
});

distube.on('error', (channel, error) => {
	console.error(error);
	channel.send(`${channel.client.emotes.error} - **ERROR**\`\`\`js\n${error.message.substring(0, 2000)}\n\`\`\``);
	db.set(`${channel.guild.id}.queueCreator`, null);
});

distube.on('initQueue', (queue) => {
	queue.autoplay = false;
	queue.volume = 100;
});

distube.on('empty', async (queue) => {
	queue.textChannel.send(`${queue.client.emotes.error} - ${await client.language('Music stopped as there is no more members in the voice channel!', queue.textChannel.lastMessage)}`);
	db.set(`${queue.textChannel.guild.id}.queueCreator`, null);
});

// distube.on('connectionCreate', (queue, connection) => {
// 	queue.textChannel.send(`${queue.client.emotes.success} - Successfully connected to _**${connection.channel.name}**!_`);
// });

distube.on('searchDone', () => {});

// distube.on('disconnect', (queue) => {
// 	queue.textChannel.send(`${queue.client.emotes.error} - Music stopped as I have been disconnected from the channel!`);
// });

const creator = new SlashCreator({
	applicationID: '873922961491525682',
	publicKey: 'f17beca55681a830929225780ff0fc1805d8e5e0766c5378c84714692fd336d2',
	token: process.env.TOKEN,
	client
});

client.slashCreator = creator;

client.slashCreator
	.on('debug', (log) => logger.log(log))
	.on('commandRun', (command, promise, ctx) => {
		statcord.postCommand(command.commandName, ctx.user.id);
		console.log('[===== Slash Command executed =====]');
		// console.log(`Server: ${ctx.guild ? ctx.guild.name : 'DM'}`);
		// console.log(`Channel: #${ctx.channel.type !== 'dm' ? ctx.channel.name : 'DM'}`);
		console.log(`Command Name: ${command.commandName}`);
		console.log('\n');
	})
	.on('commandError', (command, err, ctx) => {
		console.error(err);
	})
	.on('commandBlock', (command, ctx, reason) => {
		console.log(`Command ${command ? `${command.commandName}` : ''} blocked\n${reason}`);
	});

const poster = AutoPoster(process.env.TOPGG_TOKEN, client);

poster.on('posted', (stats) => {
	console.log(`Posted stats to Top.gg`);
})

client
	.on('debug', (log) => logger.log(log))
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })

client.commandHandler
	.on('commandFinished', (message, command, args, returnValue) => {
		statcord.postCommand(command.id, message.author.id);
		console.log('[===== Command executed =====]');
		console.log(`Server: ${message.guild ? message.guild.name : 'DM'}`);
		console.log(`Channel: #${message.channel.type !== 'dm' ? message.channel.name : 'DM'}`);
		console.log(`Command Name: ${command.id}`);
		console.log(`Message Content: ${message.content}`);
		console.log(`Returned Value: ${returnValue}`);
		console.log('\n');
	})
	.on('error', (err, message, cmd) => {
		return message.reply([
			`An error occured while trying to run \`${cmd.id}\` command:`,
			`\`\`\`js\n${err.message}\n\`\`\``
		].join('\r\n'))
	})
	.on('commandBlocked', (message, cmd, reason) => {
		return message.reply([
			`A blockage occured while trying to run \`${cmd.id}\` command:`,
			`\`\`\`js\n${reason}\n\`\`\``
		].join('\r\n'))
	})

statcord.on("autopost-start", () => {
    console.log("Started autopost for Statcord");
});

statcord.on("post", status => {
    if (!status) console.log("Posted stats to Statcord");
    else console.error(status);
});

const Enmap = require('enmap');
client.points = new Enmap('points');

client.on('guildMemberAdd', async (member) => {
	if (member.guild.id == '792416429198409738') {
		member.roles.add(member.guild.roles.cache.find(role => role.id === '806070624573325313'));
	}
});

process.on('unhandledRejection', (error) => {
	// logger.error(error, {
	// 	meta: {
	// 		message: 'Unhandled promise rejection',
	// 		error
	// 	}
	// });
	console.log(error);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception:', error);
});

client.on('messageDelete', async (message) => {
	client.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author.tag,
		member: message.member,
		image: message.attachments.first() ? message.attachments.first().proxyURL : null,
	});
});

client.on('messageUpdate', async (message) => {
	client.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author.tag,
		member: message.member,
		image: message.attachments.first() ? message.attachments.first().proxyURL : null,
	});
});

client.login(client.config.discord.token);

module.exports.client = client;