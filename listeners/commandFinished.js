const { Listener } = require('discord-akairo');

module.exports = class CommandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            event: 'commandFinished'
        });
    }

    exec(message, command, args, returnValue) {
		this.client.statcord.postCommand(command.id, message.author.id);
		console.log('[===== Command executed =====]');
		console.log(`Server: ${message.guild ? message.guild.name : 'DM'}`);
		console.log(`Channel: #${message.channel.type !== 'dm' ? message.channel.name : 'DM'}`);
		console.log(`Command Name: ${command.id}`);
		console.log(`Message Content: ${message.content}`);
		console.log(`Returned Value: ${returnValue}`);
		console.log('\n');
	}
}