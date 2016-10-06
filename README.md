# CalicoChan
A shitty Discord bot for a shitty custom MTG server. Contains lots of hardcoded in-jokes, and is not a generally useful bot.

# Installation
Requires Node.js >= 6.0.0

Requires MongoDB server for most anything useful (be sure to configure endpoint in `./config.json`)

Create a `token.json` file in `./assets/` of the form
```
{
    "token" : <YOUR_TOKEN_HERE>
}
```

Ensure that Adversary xmls are in `./assets/adversaryxml/` (you can do this by moving them manually or by using a symbolic link).

Be sure to `npm install` to get dependencies, then...

Update database with:
`npm run db`

Finally,
`npm start` (optionally -- and preferably -- use `pm2` to run Calico!)
