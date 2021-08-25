const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader.js")(client);
const path = require("path");
const snekfetch = require("snekfetch");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + "7/24 AKTİF TUTMA İŞLEMİ BAŞARILI");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on("ready", async () => {
  let sesliKanalID = client.channels.cache.get("855065253460574209");
  if (sesliKanalID)
    sesliKanalID.join()
      .catch(err => console.error("Bot ses kanalına bağlanamadı!"));
});

//---------------------------------KOMUTLAR---------------------------------\\

//HOŞGELDİN MESAJI

//EMOJİLERİ KENDİNİZE GÖRE AYARLAYABİLİRSİNİZ

//---HOŞGELDİN MESAJI---\\
client.on("guildMemberAdd", async (member) => {
  moment.locale("tr");
  const embed = new Discord.MessageEmbed()
  .setDescription(`${member}<a:pikawave:870281166308122624> O D İ N 'E  Hoş Geldin Dostum <a:pikawave:870281166308122624> 
  
  <a:speakerleft:870281152731185192>  Seninle Birlikte \`${member.guild.memberCount}\` Kişiyiz <a:speakerright:870281150105518090> 
  
  <a:be277d964771433a8378694998692359:870284385369325588>  Birazdan <@&880081411023982663> Rolündeki Yetkililer Sizi Kayıt Edicek Lütfen Sesli Kanala Geçip Bekleyin <a:be277d964771433a8378694998692359:870284385369325588> 


  <a:a6016e203d4942728fd2c2e3ef896089:870284340515450951>  Kayıt olduktan sonra <:Rules:875679486060945458><#879832278392504334> okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünede bulundurarak yapacağız.<a:a6016e203d4942728fd2c2e3ef896089:870284340515450951> 
  
  <a:crsystemwarn:867736102021759026>  **Hesabın Oluşturulma Tarihi** <:857317181971628052:867727512968101899>  \` ${moment(member.user.createdAt).format("DD MMMM YYYY, dddd (hh:mm)")}\`<a:crsystemwarn:867736102021759026> `)
  .setImage(`https://cdn.discordapp.com/attachments/879832278392504339/880120390301663343/carlos23.gif`)
  let kanal = client.channels.cache.get("879832278027628571")
  await member.setNickname(`İsim | Yaş`)
  await kanal.send(`${member} | <@&880081411023982663>`,embed).catch(e => console.log(e))
  });
  //---HOŞGELDİN MESAJI---\\

//OTO ROL

client.on("guildMemberAdd", member => {
  let botrolü = "";
  let kayıtsızrolü = "879842619235139676";
  if (member.user.bot) {
    member.roles.add(botrolü);
  } else {
    member.roles.add(kayıtsızrolü);
  }
});
