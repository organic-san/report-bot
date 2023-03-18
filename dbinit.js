import { Database } from "./module/database.js";
import 'dotenv/config.js';
const db = Database.getInstance('./data/data.db');

db.createTable(process.env.REPORT_DATABASE_NAME, 
    {name: 'id', type: 'INTEGER', autoIncrement: true, primaryKey: true},
    {name: 'userId', type: 'TEXT'},
    {name: 'reportContent', type: 'TEXT'},
    {name: 'reportMessageId', type: 'TEXT'},
    {name: 'reportReason', type: 'TEXT'},
    {name: 'reporterId', type: 'TEXT'},
    {name: 'guildId', type: 'TEXT'},
    {name: 'channelId', type: 'TEXT'},
);

// db.createTable(process.env.GUILDDATA_DATABASE_NAME, 
//     {name: 'id', type: 'INTEGER', autoIncrement: true, primaryKey: true},
// );

// db.dropTable(process.env.REPORT_DATABASE_NAME);
