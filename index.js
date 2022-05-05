// Place your server entry point code here
const express = require('express');
const fs = require('fs'); 
const morgan = require('morgan'); 
const app = express();
const args = require('minimist')(process.argv.slice(2));
const db = require("./src/services/database"); 
const flip = require('./src/coinflip')


if (args['help']) {
    console.log("server.js [options]" + 
    "--port	Set the port number for the server to listen on. Must be an integer between 1 and 65535." + 
  
    "--debug	If set to `true`, creates endlpoints /app/log/access/ which returns a JSON access log from the database and /app/error which throws an error with the message 'Error test successful.' Defaults to `false`." +
  
    "--log		If set to false, no log files are written. Defaults to true. Logs are always written to database." + 
  
    "--help	    Return this message and exit.")
}

const port = args['port'] || 5000;
const debug = args['debug'] || false; 
const log = args['log'] || false; 


if (log) {
    
    const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: WRITESTREAM }))
    

}

app.use(express.static('./public')); 
app.use(express.json())
app.use((req, res, next) => {
    const stmt = db.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, secure, status, referer, useragent)
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                                `); 
    const info = stmt.run(req.ip, req.user, Date.now().toLocaleString(), req.method, req.url, req.protocol, req.httpVersion, String(req.secure), req.statusCode, req.headers['referer'], req.headers['user-agent']);
    console.log(info); 
    next(); 
})

app.get("/app/", (req, res) => {
    res.status(200).contentType('json').send("200 OK"); 
});

app.get("/app/flip/", (req, res) => {
    res.status(200).contentType('json').json({"flip": `${flip.coinFlip()}`}); 
});

app.post("/app/flip/coins/", (req, res) => {
    const raw = flip.coinFlips(req.body.number); 
    const summary = flip.countFlips(raw);
    res.status(200).contentType('json').json({raw: raw, summary: summary}); 
});

app.get("/app/flip/call/", (req, res) => {
    const results = flip.flipACoin(req.body.guess); 
    res.status(200).contentType('json').json(results); 
});

if (debug) {

    app.get("/app/log/access", (req, res) => {

        try {
            const stmt = db.prepare("SELECT * FROM accesslog");
            const data = stmt.all(); 
            res.status(200).json(data);

        }  
        catch {
            console.log(e);
        }
    });

    app.get("/app/error", (req, res) => {
        res.status(500);
        res.render('error', {error: 'Error test successful'}); 
    });
};

app.use((req, res) => {
    res.status(404).contentType('json').send('404 Not found'); 
}); 

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});