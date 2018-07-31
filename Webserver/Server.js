const { callbackURL, clientID, clientSecret, owner, webserverPort } = require('../Config');
const { Strategy } = require('passport-discord');
const express = require('express');
const session  = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const scope = ['identify', 'guilds', 'email'];
const Raven = require('raven');

const getAuthUser = user => ({
    username: user.username,
    id: user.id,
    avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png',
});

module.exports = (client) => {
    app
        .set('views', `${__dirname}/views`)
        .set('view engine', 'ejs')
        .use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        })
        .use(bodyParser.urlencoded({
            extended: true,
            parameterLimit: 10000,
            limit: '5mb',
        }))
        .use(bodyParser.json({
            parameterLimit: 10000,
            limit: '5mb',
        }))
        .use(cookieParser());
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    passport.use(new Strategy({ clientID, clientSecret, callbackURL, scope }, 
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                return done(null, profile);
            });
        }));
    app
        .use(session({
            secret: 'Uv4uaDHTbg1WrKwzK4or',
            resave: false,
            saveUninitialized: false
        }))
        .use(passport.initialize())
        .use(passport.session())
        .use('/pub/:type', (req, res, next) => {
            express.static(`${__dirname}/public/${req.params.type}`, { maxAge: 86400000 })(req, res, next);
        })
        .get('/', (req, res) => {
            res.render('landing', { 
                client,
                authUser: req.isAuthenticated() ? getAuthUser(req.user) : null
            });
        })
        .get('/stats', (req, res) => {
            res.render('stats', { client });
        })
        .get('/api', async (req, res) => {
            res.json({
                activity: await client.user.presence.activity ? client.user.presence.activity.name : 'None',
                command_count: await client.commands.size,
                server_count: await client.guilds.size,
                user_count: await client.users.size,
            });
        })
        .get('/guild/:id', checkAuth, async (req, res) => {
            try {
                if (req.user.id === owner) {
                    await res.json({
                        name: client.guilds.get(req.params.id).name,
                        id: client.guilds.get(req.params.id).id,
                        members: client.guilds.get(req.params.id).memberCount,
                        createdAt: client.guilds.get(req.params.id).createdAt,
                        owner: `${client.guilds.get(req.params.id).owner.user.tag} (${client.guilds.get(req.params.id).owner.user.id})`
                    });
                } else res.sendStatus(403).send('Forbidden.');
            } catch (err) {
                Raven.captureException(err);
                res.render('login_err', { client });
            } 
        })
        .get('/dashboard', checkAuth, (req, res) => {
            res.render('dashboard', { client, modules: client.modules, user: req.user });
        })
        .get('/dashboard/server/:id', checkAuth, (req, res) => {
            const guild = client.guilds.get(req.params.id);
            res.render('guildInfo', { client, guild, user: req.user });
        })
        .get('/login', passport.authenticate('discord', { scope }))
        .get('/login/callback', passport.authenticate('discord', { failureRedirect: '/login/fail' }), 
            function(req, res) { 
                res.redirect('/dashboard'); 
            })
        .get('/login/fail', (req, res, next) => { // eslint-disable-line no-unused-vars
            res.render('login_err', { client });
        })
        .get('/logout', checkAuth, (req, res) => {
            req.logout();
            res.redirect('/?successlogout=1');
        });

    function checkAuth(req, res, next) {
        if (req.isAuthenticated()) return next();
        return res.redirect('/login/');
    }

    app.listen(webserverPort, () => client.logger.info(`[WEBSERVER]: Succesfully started webserver at port ${webserverPort}.`));
};
