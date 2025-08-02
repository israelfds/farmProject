import { DataSource } from 'typeorm';

declare global {
  var cleanTestDatabase: (dataSource: DataSource) => Promise<void>;
}

export {}; 