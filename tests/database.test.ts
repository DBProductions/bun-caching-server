import { expect, test, describe } from "bun:test";
import { Database } from '../src/database';
import type { DatabaseConfig, User, PartialUser } from '../src/types';

describe('Database', () => {
  test("constructor initializes database with config", () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:test.db"
    };

    const database = new Database(config);
    expect(database).toBeDefined();
  });

  test("checkDatabase handles database errors", async () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:/invalid/path/test.db"
    };

    const database = new Database(config);
    const result = await database.check();
    expect(result).toBe(false);
  });

  test("select handles database errors", async () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:/invalid/path/test.db"
    };

    const database = new Database(config);
    await expect(database.select("1")).rejects.toThrow();
  });

  test("create handles database errors", async () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:/invalid/path/test.db"
    };

    const database = new Database(config);
    const user: User = { id: 1, name: "Test User", email: "test@test.com", mobile: "1234567890" };
    await expect(database.create(user)).rejects.toThrow();
  });

  test("update throws error for no valid fields", async () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:test.db"
    };

    const database = new Database(config);
    const invalidUser: PartialUser = { id: 1 };

    await expect(database.update("1", invalidUser)).rejects.toThrow("No valid fields to update");
  });

  test("replace handles database errors", async () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:/invalid/path/test.db"
    };

    const database = new Database(config);
    const user: User = { id: 1, name: "Test User", email: "test@test.com", mobile: "1234567890" };
    await expect(database.replace("1", user)).rejects.toThrow();
  });

  test("delete handles database errors", async () => {
    const config: DatabaseConfig = {
      connectionString: "sqlite:/invalid/path/test.db"
    };

    const database = new Database(config);
    await expect(database.delete("1")).rejects.toThrow();
  });
});
