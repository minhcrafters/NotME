// This is the slash-up config file.
// Make sure to fill in "token" and "applicationId" before using.
// You can also use environment variables from the ".env" file if any.

module.exports = {
  // The Token of the Discord bot
  token: process.env.TOKEN,
  // The Application ID of the Discord bot
  applicationId: '873922961491525682',
  // This is where the path to command files are, .ts files are supported!
  commandPath: './slashCommands',
  // You can use different environments with --env (-e)
  env: {
    development: {
      // The "globalToGuild" option makes global commands sync to the specified guild instead.
      globalToGuild: process.env.GUILD_ID
    }
  }
};