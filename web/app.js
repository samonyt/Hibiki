const express = require("express");
const session  = require("express-session");
const app = express();
const { info } = require("winston");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const scopes = ["identify", "guilds", "email"];
const config = require("../config");

module.exports = (client) => {
    app
        .set("views", `${__dirname}/views`)
        .set("view engine", "ejs")
        .use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        })
        .use(bodyParser.urlencoded({
            extended: true,
            parameterLimit: 10000,
            limit: "5mb",
        }))
        .use(bodyParser.json({
            parameterLimit: 10000,
            limit: "5mb",
        }))
        .use(cookieParser());
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    passport.use(new Strategy({
        clientID: config.opts.ids.client,
        clientSecret: config.keys.secret,
        callbackURL: config.opts.ws.callbackURL,
        scope: scopes
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    app
        .use(session({
            secret: "Uv4uaDHTbg1WrKwzK4or",
            resave: false,
            saveUninitialized: false
        }))
        .use(passport.initialize())
        .use(passport.session())
        .use("/static/:type", (req, res, next) => {
            express.static(`${__dirname}/public/${req.params.type}`, { maxAge: 86400000 })(req, res, next);
        })
        .get("/", (req, res) => {
            res.render("index", { client });
        })
        .get("/api", async (req, res) => {
            res.json({
                activity: await client.user.presence.activity ? client.user.presence.activity.name : "None",
                command_count: await client.commands.size,
                server_count: await client.guilds.size,
                user_count: await client.users.size,
            });
        })
        .get("/dashboard", checkAuth, (req, res) => {
            res.render("dashboard", { client, user: req.user });
        })
        .get("/login", passport.authenticate("discord", {
            scope: scopes,  
        }))
        .get("/login/callback", passport.authenticate("discord", { failureRedirect: "/login/fail" }), 
            function(req, res) { 
                res.redirect("/dashboard"); 
            })
        .get("/login/fail", (req, res, next) => { // eslint-disable-line no-unused-vars
            res.render("login_err", { client });
        })
        .get("/logout", checkAuth, (req, res) => {
            req.logout();
            res.redirect("/?successlogout=1");
        });

    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        return res.redirect("/login/");
    }

    app.listen(client.config.opts.ws.port, () => info(`[WEBSERVER]: Initialized webserver at port ${client.config.opts.ws.port}!`));
};
