# WCA
A Wynncraft chat archiver. Logs chat to a file.

Relys heavily on <a target="_blank" href="https://github.com/PrismarineJS/mineflayer">mineflayer</a> from PrismarineJS.

# Prerequisites
1. Ability to follow instructions.
2. A valid Mojang/Microsoft account with Minecraft.
3. [Node.js](https://nodejs.dev/) 14+
4. Discord bot (only if you want to relay chat to discord and control the bot from discord)
5. /toggle autojoin must be enabled on the account - class menu is not supported
6. You must friend yourself by using /friend \<ign> for specific tracking.

### Optional Stuff
6. /toggle ghosts none should be turned off to reduce chat clutter, unless you want to log a specific city for chat
7. /toggle swears & /toggle insults if you want to see curses in chat, not necessary.


### Bomb Tracking Prerequisites 
1. An dedicated Minecraft account with Champion rank ($171 for Champion - $27 for Minecraft = $200)

### Guild Tracking Prerequisites
1. Be in the guild that you want to track.

### Shout Tracking Prerequisites
1. None

# Install
1. Install [Node.js](https://nodejs.dev/) version 14+ 
2. Make a Discord bot.
3. Download this github project to a folder.
4. Run `npm install` in the folder.
5. Edit cred.json and config.json for your needs.
6. Make a directory called `logs` and a directory inside of `logs` called `debug`.
7. Run `node index.js`.

## TODO
1. Split `index.js` into multiple files.
2. Fix bugs.
3. Add more chat-based features

# Disclaimer
This is use at your own risk. If you decide to include any afk interaction with the game world, there is a likely chance that you will be banned.

This will probably not get you banned as there is no interaction with the game world other through chat. However there is still a risk.

# Thank You
[Wynncraft](https://wynncraft.com/): for creating Wynncraft and having an public API

[Wynntils](https://wynntils.com/): for some of the regexes used to parse messages & API

[node-wynn](https://github.com/DevChromium/WynnJS/): using their API request handler

[Prismarine-JS](https://github.com/PrismarineJS/): for their discord being helpful when I was starting to code

[Regexr](https://regexr.com/): for being an amazing regex tester and having a easy cheatsheet

[StackOverflow](https://stackoverflow.com/) & [NodeJS](https://nodejs.org/api/) & [DiscordJS](https://discord.js.org/): JS Documentation

Thank you to the many individuals that answered my questions when making this.

# Misc
This is worked on in my spare time, and is probably badly coded.
Feel free to open an PR or issue if something could probably be improved



