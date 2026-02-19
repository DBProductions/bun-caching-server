import { expect, test, describe } from "bun:test";
import { Controller } from '../src/controller';

describe('Controller', () => {
  test("constructor initializes controller with service", () => {
    const mockService = {
      getUser: () => Promise.resolve({}),
      setUser: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      replaceUser: () => Promise.resolve({}),
      delUser: () => Promise.resolve({})
    };
    const controller = new Controller(mockService as any);
    expect(controller).toBeDefined();
    expect((controller as any).service).toBe(mockService);
  });

  test("checkContentType returns error response for invalid content type", () => {
    const mockService = {
      getUser: () => Promise.resolve({}),
      setUser: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      replaceUser: () => Promise.resolve({}),
      delUser: () => Promise.resolve({})
    };
    const controller = new Controller(mockService as any);
    const mockHeaders = new Headers({ "content-type": "text/plain" });

    const result = controller.checkContentType(mockHeaders);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(400);
  });

  test("checkContentType returns undefined for valid content type", () => {
    const mockService = {
      getUser: () => Promise.resolve({}),
      setUser: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      replaceUser: () => Promise.resolve({}),
      delUser: () => Promise.resolve({})
    };
    const controller = new Controller(mockService as any);
    const mockHeaders = new Headers({ "content-type": "application/json" });

    const result = controller.checkContentType(mockHeaders);
    expect(result).toBeUndefined();
  });

  test("createData handles missing required fields", async () => {
    const mockService = {
      getUser: () => Promise.resolve({}),
      setUser: () => Promise.reject(new Error("Validation error: Name is required and must be a string")),
      updateUser: () => Promise.resolve({}),
      replaceUser: () => Promise.resolve({}),
      delUser: () => Promise.resolve({})
    };
    const controller = new Controller(mockService as any);
    const mockHeaders = new Headers({ "content-type": "application/json" });

    const result = await controller.createData(mockHeaders, {});

    expect(result.status).toBe(400);
    
    const responseData = await result.json();
    expect(responseData).toEqual({ error: "Validation error: Name is required and must be a string" });
  });

  test("getData handles user not found", async () => {
    const mockService = {
      getUser: () => Promise.resolve(null),
      setUser: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      replaceUser: () => Promise.resolve({}),
      delUser: () => Promise.resolve({})
    };
    const controller = new Controller(mockService as any);
    const result = await controller.getData("999");

    expect(result.status).toBe(404);
    
    const responseData = await result.json();
    expect(responseData).toEqual({ error: "Not found" });
  });

  test("getData handles server errors", async () => {
    const mockService = {
      getUser: () => Promise.reject(new Error("Database error")),
      setUser: () => Promise.resolve({}),
      updateUser: () => Promise.resolve({}),
      replaceUser: () => Promise.resolve({}),
      delUser: () => Promise.resolve({})
    };
    const controller = new Controller(mockService as any);
    const result = await controller.getData("1");

    expect(result.status).toBe(500);
    
    const responseData = await result.json();
    expect(responseData).toEqual({ error: "Internal Server Error" });
  });
});