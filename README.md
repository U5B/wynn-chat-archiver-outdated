# WCA
A Wynncraft chat archiver. Logs chat to a file.

Relys heavily on <a target="_blank" href="https://github.com/PrismarineJS/mineflayer">mineflayer</a> from PrismarineJS.

Join my [Discord](https://discord.gg/3UXxqC5kr9/) to see it in action.

## TODO
1. Split `index.js` into multiple files.
2. Fix bugs. yes
3. Add more chat-based features

# Disclaimer
This is use at your own risk (for now). If you decide to include any afk interaction with the game world, there is a likely chance that you will be banned.

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
Feel free to open an PR or issue if something could probably be improved.

Add `if (String(item.name).includes('§')) return` under line 420 `for (const item of packet.data) {` to exclude npcs from tab



