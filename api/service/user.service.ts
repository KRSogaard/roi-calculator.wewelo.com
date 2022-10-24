import { APILogger } from '../logger/api.logger';
import { AudibleBook, AudibleSeries, AudibleAuthor, AudibleSeriesBook, AudibleNarrator, AudibleCategory } from '../models/audiblebook.model';
import { User, UserWithPassword, RegisterUser } from '../models/user.model';
import * as mysql from '../util/MySQL.util';
import * as TimeUtil from '../util/Time.util';
import * as UserUtil from '../util/User.util';

export class AudibleUserService {
    public logger: APILogger;
    private tokenMaxAge: number = 60 * 60 * 24 * 7;

    constructor() {
        this.logger = new APILogger();
    }

    async createUser(user: RegisterUser): Promise<number> {
        this.logger.info('Creating user: ' + user.username);
        let userExisting = await this.getUserByEmail(user.email);
        if (userExisting) {
            this.logger.debug('User already exists');
            return userExisting.id;
        }

        let salt = UserUtil.genRandomString(16);
        let passwordHash = UserUtil.sha512(user.password, salt);

        let sql = 'INSERT INTO `users` (`username`, `password`, `password_salt`, `created`, `email`) VALUES (?, ?, ?, ?, ?);';
        let results = await mysql.runQuery(sql, [user.username, passwordHash, salt, TimeUtil.getNowTimestamp(), user.email]);
        return results.insertId;
    }

    async verifyUser(email: string, password: string): Promise<TokenResponse> {
        this.logger.info('Verifying user email: ' + email);
        let user = await this.getUserByEmail(email);
        if (user) {
            let passwordHash = UserUtil.sha512(password, user.password_salt);
            this.logger.info('Hash', passwordHash);
            if (passwordHash === user.password) {
                let token = UserUtil.genRandomString(32);
                let sql = 'INSERT INTO `users_tokens` (`user_id`, `token`, `created`, `expires`) VALUES (?, ?, ?, ?);';
                await mysql.runQuery(sql, [user.id, token, TimeUtil.getNowTimestamp(), TimeUtil.getNowTimestamp() + this.tokenMaxAge]);
                return {
                    token: token,
                    expires: TimeUtil.getNowTimestamp() + this.tokenMaxAge,
                };
            }
        }
        return null;
    }

    async getUserByToken(token: string): Promise<UserWithPassword> {
        await this.deleteOldTokens();
        this.logger.info('Getting user by token: ' + token);
        let sql = 'SELECT u.* FROM `users` AS u LEFT JOIN `users_tokens` AS t ON u.id = t.user_id WHERE t.token = ? AND t.expires  >= ?';
        let results = await mysql.runQuery(sql, [token, TimeUtil.getNowTimestamp()]);

        return this.parseUser(results);
    }

    async deleteOldTokens(): Promise<any> {
        await mysql.runQuery('DELETE FROM `users_tokens` WHERE `expires` < ?', [TimeUtil.getNowTimestamp()]);
    }

    async getUserById(userId: number): Promise<UserWithPassword> {
        this.logger.info('Getting user by id: ' + userId);
        let sql = 'SELECT * FROM `users` WHERE `id` = ?';
        let results = await mysql.runQuery(sql, [userId]);
        return this.parseUser(results);
    }

    async getUserByName(username: string): Promise<UserWithPassword> {
        this.logger.info('Getting user by name: ' + username);
        let sql = 'SELECT * FROM `users` WHERE `username` = ?';
        let results = await mysql.runQuery(sql, [username]);
        return this.parseUser(results);
    }

    async getUserByEmail(email: string): Promise<UserWithPassword> {
        this.logger.info('Getting user by email: ' + email);
        let sql = 'SELECT * FROM `users` WHERE `email` = ?';
        let results = await mysql.runQuery(sql, [email]);
        return this.parseUser(results);
    }

    parseUser(results: any): UserWithPassword {
        if (results && results.length > 0) {
            return {
                id: results[0].id,
                username: results[0].username,
                password: results[0].password,
                password_salt: results[0].password_salt,
                created: results[0].created,
                email: results[0].email,
            };
        }
        return null;
    }
}

export interface TokenResponse {
    token: string;
    expires: number;
}
export interface Job {
    id: number;
    created: number;
    description: string;
}
