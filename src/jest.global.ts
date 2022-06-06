/**
 * This file contains all the functions and variables that are shared across all tests.
 * At the moment, it does not work as intended.
 * I need to be able to just run the server once to initialize the database connection then
 * use that single connection for all the tests.
 */

import { DataSource } from "typeorm";
import server from "./server";


let serverData: { url: string; runningDataSource: DataSource; };

const beforeAllTests = async () => {
    const serverInfo = await server();
    const url = serverInfo.url;
    const runningDataSource = serverInfo.dataSource;
    return { url, runningDataSource };
}

(async () => {
    serverData = await beforeAllTests();
    console.log(1+2);
})();

export { serverData };