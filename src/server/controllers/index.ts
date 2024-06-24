const fs = require('fs');

module.exports = (app: any) => {
    fs.readdirSync( __dirname).forEach((fileName: string) => {
        if(fileName != "index.ts")
            require(__dirname + '/' + fileName)(app)
    });
}