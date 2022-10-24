export const commands = [
    'CREATE TABLE IF NOT EXISTS `users` ( ' +
        '  `id` int NOT NULL AUTO_INCREMENT, ' +
        '  `username` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL, ' +
        '  `password` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL, ' +
        '  `password_salt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL, ' +
        '  `created` int DEFAULT NULL, ' +
        '  `email` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL, ' +
        '  PRIMARY KEY (`id`) ' +
        ') ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',

    'CREATE TABLE IF NOT EXISTS `users_tokens` ( ' +
        '  `id` int NOT NULL AUTO_INCREMENT,  ' +
        '  `user_id` int DEFAULT NULL,  ' +
        '  `token` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,  ' +
        '  `created` int DEFAULT NULL,  ' +
        '  `expires` int DEFAULT NULL,  ' +
        '  PRIMARY KEY (`id`),  ' +
        '  KEY `user_id` (`user_id`),  ' +
        '  CONSTRAINT `users_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ' +
        ') ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
];
