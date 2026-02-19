import { mock } from "bun:test";
import type { User } from '../src/types';

export const mockDatabase = {
  select: mock(async (id: string) => {
    return { id, name: "New", email: "new@test.com", mobile: "1234567890" };
  }),
  create: mock(async(user: User) => {
    return { id: 10, name: "New", email: "new@test.com", mobile: "1234567890" };
  }),
  update: mock(async (id: string) => {
    return { id, name: "New", email: "new@test.com", mobile: "1234567890" };
  }),
  replace: mock(async (id: string) => {
    return { id, name: "New", email: "new@test.com", mobile: "1234567890" };
  }),
  delete: mock(async (id: string) => {
    return { id, name: "New", email: "new@test.com", mobile: "1234567890" };
  }),
  emailExists: mock(async (email: string) => {
    return false;
  }),
  mobileExists: mock(async (email: string) => {
    return false;
  })
};

export const mockCache = {
  get: mock(() => null),
  set: mock(() => {}),
  delete: mock(() => null)
};
