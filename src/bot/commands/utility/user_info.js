const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chs-skills')
        .setDescription('Provides information on the skill of the user, if the user is register in the data base')
        .addStringOption(option =>
            option.setName('first_name')
                .setDescription('First name of the person you want information on')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('last_name')
                .setDescription('Last name of the person you want information on')
                .setRequired(true)),
        async execute(interaction) {
            const fstName = interaction.options.getString('first_name');
            const lstName = interaction.options.getString('last_name');
            
            await interaction.reply(`${fstName} ${lstName} skills`);
            //await interaction.deferReply();
    },
};
