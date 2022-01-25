const { Listener } = require('discord-akairo');
const MongoStore = require('connect-mongo');
const DBD = require('discord-dashboard');
const humanize = require('humanize-duration');
const CaprihamTheme = require('dbd-dark-dashboard');
const economy = require('discord-bot-eco');
const db = require('quick.db');
const { GatewayServer } = require('slash-create');
const path = require('path');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        var config = {
			mongoURL: process.env.MONGO_URL,
			currency: "$",
			allowBankruptcy: false,
			limits: {
				defaultBankLimit: 1000000000000,
				enabled: true
			},
			shopEnabled: false,
			shop: [
				{
					itemName: "Example Item",
					itemDescription: "Example Description",
					itemLogo: {
						enabled: true,
						customEmoji: {
							enabled: false,
							emojiName: "",
							emojiID: "",
							isAnimated: false
						},
						emoji: "🪙 "
					},
					itemBuyPrice: 1000,
					itemSellPrice: 900,
					parentCategory: "",
					itemBuyable: true,
					itemSellable: false
				}
			]
		};

		economy.setConfig(config);

		// this.client.commandHandler
		// 	.registerDefaultTypes()
		// 	.registerDefaultGroups()
		// 	.registerDefaultCommands({
		// 		unknownCommand: false,
		// 		help: false,
		// 		prefix: false
		// 	})
		// 	.registerGroups([
		// 		['music', 'Music'],
		// 		['fun', 'Fun'],
		// 		['games', 'Games'],
		// 		['eco', 'Economy'],
		// 		['math', 'Mathematics'],
		// 		['actions', 'Role-playing'],
		// 		['nsfw', 'NSFW-only'],
		// 		['level', 'Levelling'],
		// 		['info', 'Info'],
		// 		['hypixel', 'Hypixel Stats'],
		// 		['moderation', 'Moderation'],
		// 	])
		// 	.registerCommandsIn(path.join(__dirname, 'commands'));

		// fetch(`https://api.voidbots.net/bot/stats/${this.client.user.id}`, {
		// 	method: "POST",
		// 	headers: { 
		// 		Authorization: "VOID_DDvXxaTzUfMrhvUlfDaYGFXxLj7MecNbag4s5nKfp0Ef2jN2",
		// 		"Content-Type": "application/json"
		// 	},
		// 	body: JSON.stringify({ "server_count": this.client.guilds.cache.size, "shard_count": 0 })
		// })
		// .then(response => response.text())
		// .then(logger.log).catch(console.error);

		console.log(`Logged in as ${this.client.user.tag}. Client ID: ${this.client.user.id}`);
		console.log(`Ready on ${this.client.guilds.cache.size} guilds, for a total of ${this.client.users.cache.size} users`);

		this.client.user.setActivity(this.client.config.discord.activity.replace('{p}', this.client.commandHandler.prefix).replace('{usr}', this.client.users.cache.size).replace('{srv}', this.client.guilds.cache.size), { type: this.client.config.discord.activityType });

		setInterval(() => {
			this.client.user.setActivity(this.client.config.discord.activity.replace('{p}', this.client.commandHandler.prefix).replace('{usr}', this.client.users.cache.size).replace('{srv}', this.client.guilds.cache.size), { type: this.client.config.discord.activityType });
		}, 200000);

		this.client.statcord.autopost();

		var categoryList = [];

		this.client.commandHandler.categories
			.filter(category => category.id !== 'commands')
			.forEach((category) => {
				var cmdList = [];
				this.client.commandHandler.modules.filter(cmd => cmd.categoryID === category.id).forEach((cmd) => {
					cmdList.push({
						commandName: cmd.toString(),
						commandUsage: `${this.client.commandHandler.prefix}${cmd.toString()} ${cmd.format ? cmd.format : ''}`,
						commandDescription: cmd.description + `${cmd.channel == 'guild' ? ' (Server-only)' : ''}`,
						commandAlias: cmd.aliases.length > 0 ? cmd.aliases.join(', ') : 'None',
					});
				})
				
				categoryList.push({
					category: category.id.toUpperCase(),
					subTitle: `Total commands in this group: Deprecated`,
					list: cmdList
				});
			});

		await DBD.useLicense(process.env.DASH_LICENSE);

		DBD.Dashboard = DBD.UpdatedClass();

		const Dashboard = new DBD.Dashboard({
			port: 80,
			domain: 'https://notme.bot.nu/',
			sessionSaveSession: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
			SSL: {
				enabled: false,
				key: 'key string or fs readFileSync',
				cert: 'cert string or fs readFileSync'
			},
			invite: {
				redirectUri: 'https://notme.bot.nu/',
				permissions: '414300106102',
				clientId: this.client.user.id,
				scopes: ["bot", "applications.commands"],
			},
			noCreateServer: false,
			supportServer: {
				slash: '/support',
				inviteUrl: 'https://discord.gg/abh6udHCd2'
			},
			minimizedConsoleLogs: true,
			client: {
				id: this.client.user.id,
				secret: process.env.CLIENT_SECRET,
			},
			redirectUri: 'https://notme.bot.nu/discord/callback',
			bot: this.client,
			guildAfterAuthorization: {
				use: true,
				guildId: '911517065590997022',
			},
			ownerIDs: ['540513117222731776'],
			websiteTitle: 'NotME Dashboard',
			iconUrl: 'https://res.cloudinary.com/dwazj8n2c/image/upload/v1637933093/icon_d4deu6.png',
			underMaintenanceAccessKey: 'haohancaiditmemay',
			underMaintenanceAccessPage: '/getaccess',
			useUnderMaintenance: false,
			// underMaintenance: {
			// 	title: 'Under Maintenance',
			// 	contentTitle: 'This page is under maintenance...',
			// 	texts: [
			// 		'<br>',
			// 		'We still want to change for the better for you.',
			// 		'Therefore, we are introducing technical updates so that we can allow you to enjoy the quality of our services.',
			// 		'<br>',
			// 		'Come back to us later or join our <a href="#">Discord Server</a>'
			// 	],
			// 	bodyBackgroundColors: ['#ffa191', '#ffc247'],
			// 	buildingsColor: '#ff6347',
			// 	craneDivBorderColor: '#ff6347',
			// 	craneArmColor: '#f88f7c',
			// 	craneWeightColor: '#f88f7c',
			// 	outerCraneColor: '#ff6347',
			// 	craneLineColor: '#ff6347',
			// 	craneCabinColor: '#f88f7c',
			// 	craneStandColors: ['#ff6347', , '#f29b8b']
			// },
			theme: CaprihamTheme({
				information: {
					createdBy: "minhcrafters",
					websiteTitle: "NotME",
					websiteName: "NotME",
					websiteUrl: "https://notme.bot.nu/",
					dashboardUrl: "https://localhost/",
					supporteMail: "levandai419@gmail.com",
					supportServer: "https://discord.gg/abh6udHCd2",
					imageFavicon: "https://res.cloudinary.com/dwazj8n2c/image/upload/v1637933093/icon_d4deu6.png",
					iconURL: "https://res.cloudinary.com/dwazj8n2c/image/upload/v1637933093/icon_d4deu6.png",
					pageBackGround: "linear-gradient(to left, #8c9eff, #8c9eff 100%)",
					mainColor: "#8c9eff",
					subColor: "#5a649e",
				},
				invite: {
					client_id: this.client.user.id,
					redirectUri: "https://notme.bot.nu/close",
					permissions: "414300106102",
				},
				index: {
					card: {
						category: "NotME - Yet another generic, multi-purpose Discord bot.",
						title: `Welcome to NotME Dashboard!`,
						image: "https://i.imgur.com/axnP93g.png",
						footer: "asdcsac",
					},
					information: {
						category: "Bot Category",
						title: "Bot Information",
						description: 
							`<strong>Name:</strong> ${this.client.user.username}` +
							'<br>' +
							`<strong>Client ID:</strong> ${this.client.user.id}` +
							'<br>' +
							`<strong>Commands:</strong> ${this.client.commandHandler.modules.size} (<a href='https://notme.bot.nu/commands'>Commands page</a>)` +
							'<br>' +
							// `<strong>Uptime:</strong> ${humanize(this.client.uptime)}` +
							// '<br>' +
							`<strong>Servers:</strong> ${this.client.guilds.cache.size}` +
							'<br>' +
							`<strong>Users:</strong> ${this.client.users.cache.size}`,
						footer: "sdvdfvfv",
					},
					feeds: {
						category: "weeeeee",
						title: "W.I.P",
						description: `This dashboard is currently a work in progress so contact me if you find any issues on discord.`,
						footer: "gfjtyhdfgrth",
					},
				},
				popupMsg: {
					savedSettings: "Your changes has been saved!", 
					noPerms: "Error",
				},
				guilds: {
					cardTitle: "Guilds",
					cardDescription: "Here are all the guilds you currently have permissions for:",
				},
				guildSettings: {
					cardTitle: "Guild Settings",
					cardDescription: "Here you can manage all the settings for your guild.",
				},
				commands: categoryList,
			}),
			settings: [
				{
					categoryId: 'general',
					categoryName: "General",
					categoryDescription: "General Settings",
					categoryOptionsList: [
						{
							optionId: 'lang',
							optionName: "Language",
							optionDescription: "Change bot's language (Only English is supported for now)",
							optionType: DBD.formTypes.select({
								'English': 'en',
							}),
							getActualSet: async ({ guild }) => {
								const lang = await db.get(`${guild.id}.lang`);
								return lang || null;
							},
							setNew: async ({ guild, newData }) => {
								await db.set(`${guild.id}.lang`, newData);
								return;
							}
						},
						{
							optionId: 'prefix',
							optionName: "Server Prefix",
							optionDescription: "Change bot's server prefix",
							optionType: DBD.formTypes.input('Default: \'me!\''),
							getActualSet: async ({ guild }) => {
								return db.get(`${guild.id}.prefix`) || null;
							},
							setNew: async ({ guild, newData }) => {
								await db.set(`${guild.id}.prefix`, newData);
								return;
							}
						},
						{
							optionId: 'chatbot',
							optionName: "AI Chatbot Channel",
							optionDescription: "Sets the bot's chatbot channel.",
							optionType: DBD.formTypes.channelsSelect(false),
							getActualSet: async ({ guild }) => {
								const channel = await db.get(`${guild.id}.chatbotChannel`);
								return channel || null;
							},
							setNew: async ({ guild, newData }) => {
								await db.set(`${guild.id}.chatbotChannel`, newData);
								return;
							}
						},
					]
				},
			]
		});

		Dashboard.init();

		this.client.app = Dashboard.getApp();

		this.client.slashCreator
			.withServer(new GatewayServer((handler) => this.client.ws.on('INTERACTION_CREATE', handler)))
			.registerCommandsIn(path.join(__dirname, '../slashCommands'))
			.syncCommands({
				syncGuilds: true,
				syncPermissions: true,
			});
    }
}

module.exports = ReadyListener;