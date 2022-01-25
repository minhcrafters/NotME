const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const functions = require('../../utils/functions.js');
const Commando = require('discord-akairo');

const difficultyLevels = ['easy', 'medium', 'hard'];
const questionTypes = ['multiple', 'boolean'];

module.exports = class Command extends Commando.Command {
	constructor() {
		super('quiz', {
			aliases: ['quiz', 'trivia'],
			category: 'fun',
			channel: 'guild',
			description: 'Asks you a question.',
			args: [
				{
					id: 'difficulty',
					prompt: {
						retry: 'Invalid difficulty.'
					},
					type: 'string',
					default: functions.choice(difficultyLevels),
				},
				// {
				// 	key: 'type',
				// 	prompt: 'Invalid difficulty.',
				// 	type: 'string',
				// 	default: functions.choice(questionTypes),
				// },
			],
		});
	}

	async exec(message, { difficulty }) {
		// let questionType;
		// let difficultyLevel;

		// difficultyLevel = difficulty;

		// questionType = type;

		// const response = await fetch(`https://opentdb.com/api.php?amount=20&difficulty=${difficultyLevel}&type=${questionType}`);
		// const data = await response.json();
		// var length = data.results.length;

		// var random = Math.floor(Math.random() * length);
		// var questions = data.results[random];
		// var category = questions.category;
		// var type = questions.type;
		// var difficulty = questions.difficulty;
		// var question = functions.decode(questions.question);
		// var correctAnswer = questions.correct_answer;
		// var totalAnswers = questions.incorrect_answers;

		// totalAnswers.push(correctAnswer);

		// functions.shuffle(totalAnswers);

		// if (type === 'boolean') type = 'True/False';

		// const correct = await this.client.language('Correct!', message);
		// const incorrect1 = await this.client.language('Incorrect!', message);
		// const incorrect2 = await this.client.language('The correct answer is:', message);
		// const cancelled = await this.client.language('Cancelled!', message);

		// const embed = new MessageEmbed()
		// 	.setColor(this.client.config.discord.accentColor)
		// 	.setAuthor((await this.client.language('Basically a quiz', message)), message.author.displayAvatarURL({ dynamic: true }))
		// 	.setTitle(question)
		// 	.setDescription(`${await this.client.language('Category:', message)} ${category}\n${await this.client.language('Type:', message)} ${functions.toTitleCase(type)}\n${await this.client.language('Difficulty:', message)} ${functions.toTitleCase(difficulty)}`);

		// if (type.toLowerCase() === 'multiple') {
		// 	embed.addFields(
		// 		{ name: 'A', value: functions.decode(totalAnswers[0]), inline: false },
		// 		{ name: 'B', value: functions.decode(totalAnswers[1]), inline: false },
		// 		{ name: 'C', value: functions.decode(totalAnswers[2]), inline: false },
		// 		{ name: 'D', value: functions.decode(totalAnswers[3]), inline: false }
		// 	);

		// 	embed.setFooter(await this.client.language("Type either A, B, C, D or type 'cancel' to cancel.", message));

		// 	let msg = await message.channel.send(embed);

		// 	const filter = (response) => {
		// 		return ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'cancel'].some((answer) => answer.toLowerCase() === response.content.toLowerCase());
		// 	};

		// 	await msg.channel
		// 		.awaitMessages(filter, {
		// 			max: 1,
		// 			time: 30000,
		// 			errors: ['time'],
		// 		})
		// 		.then((response) => {
		// 			const result = response.first();

		// 			if (result.content.toLowerCase() === 'a') {
		// 				if (totalAnswers[0] === correctAnswer) {
		// 					message.channel.send(`${this.client.emotes.success} - ${correct}`);
		// 				} else {
		// 					message.react('❌');
		// 					message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 				}
		// 			} else if (result.content.toLowerCase() === 'b') {
		// 				if (totalAnswers[1] === correctAnswer) {
		// 					message.channel.send(`${this.client.emotes.success} - ${correct}`);
		// 				} else {
		// 					message.react('❌');
		// 					message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 				}
		// 			} else if (result.content.toLowerCase() === 'c') {
		// 				if (totalAnswers[2] === correctAnswer) {
		// 					message.channel.send(`${this.client.emotes.success} - ${correct}`);
		// 				} else {
		// 					message.react('❌');
		// 					message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 				}
		// 			} else if (result.content.toLowerCase() === 'd') {
		// 				if (totalAnswers[3] === correctAnswer) {
		// 					message.channel.send(`${this.client.emotes.success} - ${correct}`);
		// 				} else {
		// 					message.react('❌');
		// 					message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 				}
		// 			} else if (result.content.toLowerCase() === 'cancel') {
		// 				return message.channel.send(`${this.client.emotes.error} - ${cancelled}`);
		// 			} else {
		// 				message.react('❌');
		// 				message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 			}
		// 		});
		// } else if (type.toLowerCase() === 'true/false') {
		// 	embed.addFields({ name: '1', value: totalAnswers[0], inline: false }, { name: '2', value: totalAnswers[1], inline: false });

		// 	embed.setFooter(await this.client.language("Type either 1 or 2 or type 'cancel' to cancel.", message));

		// 	let msg = await message.channel.send(embed);

		// 	const filter = (response) => {
		// 		return ['1', '2', 'cancel'].some((answer) => answer.toLowerCase() === response.content.toLowerCase());
		// 	};

		// 	await msg.channel
		// 		.awaitMessages(filter, {
		// 			max: 1,
		// 			time: 30000,
		// 			errors: ['time'],
		// 		})
		// 		.then((response) => {
		// 			const result = response.first();

		// 			if (result.content.toLowerCase() === '1') {
		// 				if (totalAnswers[0] === correctAnswer) {
		// 					message.channel.send(`${this.client.emotes.success} - ${correct}`);
		// 				} else {
		// 					message.react('❌');
		// 					message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 				}
		// 			} else if (result.content.toLowerCase() === '2') {
		// 				if (totalAnswers[1] === correctAnswer) {
		// 					message.channel.send(`${this.client.emotes.success} - ${correct}`);
		// 				} else {
		// 					message.react('❌');
		// 					message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 				}
		// 			} else if (result.content.toLowerCase() === 'cancel') {
		// 				return message.channel.send(`${this.client.emotes.error} - ${cancelled}`);
		// 			} else {
		// 				message.react('❌');
		// 				message.channel.send(`${this.client.emotes.error} - ${incorrect}\n${incorrect2} **${correctAnswer}**!`);
		// 			}
		// 		});
		// }
		await this.client.weky.Trivia({
			message: message,
			embed: {
				title: 'Trivia',
				description: 'You only have **{{time}}** to guess the answer!',
				color: this.client.config.discord.accentColor,
				footer: 'some quiz for you',
				timestamp: true
			},
			difficulty: difficulty,
			thinkMessage: 'I\'m thinking',
			winMessage:
				'GG, It was **{{answer}}**. You gave the correct answer in **{{time}}**.',
			loseMessage: 'Better luck next time! The correct answer was **{{answer}}**.',
			emojis: {
				one: '1️⃣',
				two: '2️⃣',
				three: '3️⃣',
				four: '4️⃣',
			},
			othersMessage: 'Only <@{{author}}> can use the buttons!',
			returnWinner: false
		});
	}
};
