import { expect, test, mock, beforeEach, afterEach } from "bun:test";
import type { User, PartialUser } from '../src/types';
import { Service } from '../src/service';
import { mockDatabase, mockCache } from './mocks';

let service: Service;

beforeEach(() => {
  service = new Service(mockDatabase as any, mockCache as any);
});

afterEach(() => {
  mock.restore();
  mock.clearAllMocks();
});

test("validateData", () => {
  let user: User = { id: 1, name: "", email: "", mobile: "" };

  let result = service.validateData(user);
  expect(result).toBe("Validation error: Name is required and must be a string");

  user = { id: 1, name: "Test", email: "", mobile: "" };
  result = service.validateData(user);
  expect(result).toBe("Validation error: Email is required and must be a string");

  user = { id: 1, name: "Test", email: "test@test.de", mobile: "" };
  result = service.validateData(user);
  expect(result).toBe(null);
})

test("validatePartialData", () => {
  let user: PartialUser = {};

  let result = service.validatePartialData(user);
  expect(result).toBe(null);

  user = { name: "Test", email: "test@test.com" as any };
  result = service.validatePartialData(user);
  expect(result).toBe(null);

  user = { name: "Test", email: 3 as any };
  result = service.validatePartialData(user);
  expect(result).toBe("Validation error: Email must be a string");

  user = { name: "Test", email: "test@test.com", mobile: 3 as any };
  result = service.validatePartialData(user);
  expect(result).toBe("Validation error: Mobile must be a string");
})

test("getUser", async() => {
  let result = await service.getUser('3');

  expect(result).toEqual({id: "3", name: "New", email: "new@test.com", mobile: "1234567890"})
  expect(mockCache.get).toHaveBeenCalledWith("user:3");
  expect(mockDatabase.select).toHaveBeenCalledWith("3");
})

test("setUser", async() => {
  const user: User = { id: 1, name: "Test", email: "test@test.de", mobile: "123" };
  let result = await service.setUser(user);

  expect(result).toEqual({"id": 10, "name": "New", "email": "new@test.com", "mobile": "1234567890"});
  expect(mockDatabase.create).toHaveBeenCalledWith(user);
  expect(mockCache.set).toHaveBeenCalledWith("user:10", {"id": 10, "name": "New", "email": "new@test.com", "mobile": "1234567890"});
})

test("updateUser", async() => {
  const user: PartialUser = { name: "Test" };
  let result = await service.updateUser('3', user);

  expect(result).toEqual({"id": "3", "name": "New", "email": "new@test.com", "mobile": "1234567890"});
  expect(mockDatabase.update).toHaveBeenCalledWith('3', user);
  expect(mockCache.set).toHaveBeenCalledWith("user:3", {"id": "3", "name": "New", "email": "new@test.com", "mobile": "1234567890"});
})

test("replaceUser", async() => {
  const user: User = { id: 1, name: "Test", email: "test@test.de", mobile: "123" };
  let result = await service.replaceUser('3', user);

  expect(result).toEqual({"id": "3", "name": "New", "email": "new@test.com", "mobile": "1234567890"});
  expect(mockDatabase.replace).toHaveBeenCalledWith('3', user);
  expect(mockCache.set).toHaveBeenCalledWith("user:3", {"id": "3", "name": "New", "email": "new@test.com", "mobile": "1234567890"});
})

test("delUser", async() => {
  let result = await service.delUser('3');

  expect(result).toEqual({"id": "3", "name": "New", "email": "new@test.com", "mobile": "1234567890"});
  expect(mockCache.delete).toHaveBeenCalledWith("user:3");
  expect(mockDatabase.delete).toHaveBeenCalledWith("3");
})
