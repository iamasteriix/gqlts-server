import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "iamasteriix",
    password: "password",
    database: "graphql-ts-server",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});

export const TestDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "iamasteriix",
    password: "password",
    database: "gqlts-server-test",
    synchronize: true,
    logging: false,
    dropSchema: true,
    entities: [User],
    migrations: [],
    subscribers: [],
});