const { Listener } = require('discord-akairo');

module.exports = class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    exec(message, cmd, reason) {
		return message.reply([
			`A blockage occured while trying to run \`${cmd.id}\` command:`,
			`\`\`\`js\n${reason}\n\`\`\``
		].join('\r\n'))
	}
}