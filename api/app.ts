import * as bodyParser from 'body-parser';
const path = require('path');
import * as express from 'express';
import { APILogger } from './logger/api.logger';
import { UserController } from './controller/user.controller';
import { AudibleUserService } from './service/user.service';
import { SaveController } from './controller/save.controller';
var cors = require('cors');

class App {
    express: express.Application;
    logger: APILogger;
    userController: UserController;
    userService: AudibleUserService;
    saveController: SaveController;

    protectedPaths = [
        {
            startsWith: false,
            path: '/api/user',
            method: 'GET',
        },
        {
            startsWith: false,
            path: '/api/book',
            method: 'POST',
        },
        {
            startsWith: false,
            path: '/api/my-series',
            method: 'GET',
        },
        {
            startsWith: true,
            path: '/api/user/archive/',
            method: 'POST',
        },
        {
            startsWith: true,
            path: '/api/user/archive/',
            method: 'DELETE',
        },
        {
            startsWith: false,
            path: '/api/user/jobs',
            method: 'GET',
        },
    ];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.logger = new APILogger();

        this.userController = new UserController();
        this.userService = new AudibleUserService();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(express.static(path.join(__dirname, '../ui/build')));
        this.express.use(async (req: Record<string, any>, res, next) => {
            let isAuthRequired = false;
            this.protectedPaths.forEach((protectedPath) => {
                if (!protectedPath.method.toLowerCase().includes(req.method.toLowerCase())) {
                    return;
                }

                if (protectedPath.startsWith) {
                    if (req.path.startsWith(protectedPath.path)) {
                        isAuthRequired = true;
                    }
                } else if (req.path === protectedPath.path) {
                    isAuthRequired = true;
                }
            });

            let token = null;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
                token = req.headers.authorization.substring(7);
                this.logger.debug('Token: ' + token);

                let user = await this.userService.getUserByToken(token);
                if (!user) {
                    res.status(401).send('Unauthorized');
                    return;
                }
                req.user = user;
            }

            if (isAuthRequired) {
                if (!req.user) {
                    res.status(401).send('Unauthorized');
                    return;
                }
                next();
            } else {
                next();
            }
        });
    }

    private routes(): void {
        this.express.get('/api/user', async (req: any, res) => {
            this.userController.getMe(req.user, res);
        });

        this.express.post('/api/user', async (req: any, res) => {
            this.userController.registerUser(req.body?.username, req.body?.password, req.body?.email, res);
        });

        this.express.post('/api/auth', async (req, res) => {
            this.userController.authUser(req.body?.username, req.body?.password, res);
        });

        this.express.get('/', async (req: any, res) => {
            res.sendFile(path.join(__dirname, './ui/build/index.html'));
        });

        // handle undefined routes
        this.express.use('*', (req, res, next) => {
            res.status(404).send('Not Found');
        });
    }
}

export default new App().express;
