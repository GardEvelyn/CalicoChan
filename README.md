# CalicoChan
A shitty Discord bot leveraging [Discord.js](https://github.com/hydrabolt/discord.js/) for a shitty custom MTG server. Contains lots of hardcoded in-jokes, and is not a generally useful bot.

# Installation
Requires Node.js >= 6.0.0

Requires MongoDB server for most anything useful.

Create a `config.json` file in `./` in the same fashion as the provided `config.json.example`.

Ensure that Adversary xmls are in `./assets/adversaryxml/` (you can do this by moving them manually or by using a symbolic link).

Be sure to `npm install` to get dependencies, then...

Update database with:
`npm run db`

Finally,
`npm start` (optionally -- and preferably -- use `pm2` to run Calico!)
