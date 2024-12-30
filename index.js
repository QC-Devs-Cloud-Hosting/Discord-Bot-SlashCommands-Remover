// ©2023 AZERTY. All rights Reserved | AZERTY#9999
const lolcatjs = require("lolcatjs")
const figlet = require("figlet")
const inquirer = require("inquirer")
const fetch = require('node-fetch')

const { Client, GatewayIntentBits, Partials, REST } = require("discord.js")
const { Routes } = require("discord-api-types/v9")

// Display Welcome Title
function Banner() {
    var banner = figlet.textSync("SlashCommands Remover", {
        font: "Small",
        horizontalLayout: "default",
        width: 1000,
        whitespaceBreak: true,
    })
    lolcatjs.fromString(banner)
}

console.clear()
Banner()

inquirer.prompt([
    {
        type: "input",
        name: "BotToken",
        message: "Bot Token:\n",
    },
]).then(async answers => {
    const BotToken = answers.BotToken
    console.log("\nConnecting...")

    const bot = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution,
        ],
        partials: [
            Partials.Message,
            Partials.Channel,
            Partials.Reaction,
        ]
    })

    bot.login(BotToken)
    .then(() => {
        console.log("Connected to Discord")
    }).catch(err => {
        if (err.message == "An invalid token was provided.") {
            console.log("Invalid Token")
        }
    })

    bot.on("ready", async () => {
        console.log("Bot Started")

        const rest = new REST({ version: "10" }).setToken(BotToken)

        console.log("\nRemoving Global Commands")
        await rest.put(Routes.applicationCommands(bot.user.id), {
            body: [],
        }).then(() => {
            console.log("Removed Global Commands")
        })

        console.log("\nRemoving Guilds Commands")
        for (let [guildID, Guild] of bot.guilds.cache) {
            await rest.put(Routes.applicationGuildCommands(bot.user.id, guildID), {
                body: [],
            }).then(() => {
                console.log(`Removed commands for guild: ${Guild.name}`)
            })
        }
        console.log("Removed Guilds Commands")

        console.log("\nAll done !!!\n\n\n")
        process.exit()
    })
})
