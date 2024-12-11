const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

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

            await interaction.deferReply("truc");

            let queryString = fstName + " " + lstName ;
            queryString = queryString.replaceAll(" ", "_")

            console.log(`localhost:3000/api/spreadsheet/${queryString}`)
            let result = await axios.get(`http://localhost:3000/api/spreadsheet/${queryString}`);
            console.log(result);
            if(result.data.length === 2) {

                const resultEmbed = new EmbedBuilder()
                    .setTitle('Skills ' + fstName + " " + lstName);

                let length = result.data[0].length < result.data[1].length ? result.data[0].length : result.data[1].length;

                for (let i = 2; i < length; i++) {
                    resultEmbed.addFields({name: result.data[0][i], value: result.data[1][i], inline: true});
                }

                await interaction.editReply({embeds: [resultEmbed]});
            } else {
                await interaction.editReply("Nous n'avons pas trouvé la personne indiquée.")
            }
    },
};