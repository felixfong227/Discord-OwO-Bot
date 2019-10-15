const discordTokenPath = process.argv[2];
const mysqlTokenPath = process.argv[3];

const fs = require('fs');

if(discordTokenPath && mysqlTokenPath) {
    const discordTokenString = fs.readFileSync(discordTokenPath, 'utf8');
    const mysqlTokenString = fs.readFileSync(mysqlTokenPath, 'utf8');
    
    if(discordTokenString && mysqlTokenString) {
        const discordToken = JSON.parse(discordTokenString);
        const mysqlToken = JSON.parse(mysqlTokenString);
        discordToken.token = process.env.BOT_TOKEN;
        discordToken.admin = process.env.ADMIN_USERNAME;
        mysqlToken.user = process.env.MYSQL_USERNAME;
        mysqlToken.pass = process.env.MYSQL_PASSWORD;
        fs.writeFileSync(
            discordTokenPath,
            JSON.stringify(discordToken, null, 4),
        );
        fs.writeFileSync(
            mysqlTokenPath,
            JSON.stringify(mysqlToken, null, 4),
        );
    }
}