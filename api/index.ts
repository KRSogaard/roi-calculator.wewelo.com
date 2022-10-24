import * as http from 'http';
import App from './app';
import { APILogger } from './logger/api.logger';
import { RabbitMQConnection, RabbitMQAudibleChannel, RabbitMQCheck } from './config/rabbitmq.config';
import { AudibleManagementService } from './service/audible_management.service';
import { AudibleUserService } from './service/user.service';
import { MySQLConnection, MySQLCheck } from './config/mysql.config';
import { MinIOCheck } from './config/minio.config';
require('dotenv').config();

// HERE FOR FAST FAILS
MySQLCheck();

const port = process.env.PORT || 3080;

App.set('port', port);
const server = http.createServer(App);
server.listen(port);

const logger = new APILogger();

logger.info('Creating database connection');
MySQLConnection();

server.on('listening', function (): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    logger.info(`Listening on ` + bind);
});

module.exports = App;
