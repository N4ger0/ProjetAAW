const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chm-putskills')
        .setDescription('Modify one skills of the user who called the command, if the specified skills already exist')
        .addStringOption(option =>
            option.setName('skill')
                .setDescription('The skill to modify')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('value')
                .setDescription('New value to set for specified skill')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        let user_id = interaction.user.id ;
        console.log(user_id);
        await interaction.editReply("done");
    },
};