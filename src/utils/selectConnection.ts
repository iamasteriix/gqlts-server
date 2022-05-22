import { AppDataSource, TestDataSource } from "../data-source"

export const ServerDataSource = () => {
    return process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
}