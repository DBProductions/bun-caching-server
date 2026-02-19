import type { User } from './types';
import { Service } from './service';

export class Controller {
  constructor(private readonly service: Service) {}

  checkContentType(headers: any) {
    if (!headers.get("content-type")?.includes("application/json")) {
      return Response.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }
  }

  async getData(id: string) {
    try {
      const user = await this.service.getUser(id);
      if (!user) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(user, { status: 200 });
    } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async createData(headers: any, body: any) {
    this.checkContentType(headers);
    const user: User = { ...body };
    try {
      const newUser = await this.service.setUser(user);
      return Response.json(newUser, { status: 201 });
    } catch (error: any) {
      if (error.message.includes("Validation error")) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      if (error.message.includes("Email already exists") || error.message.includes("Mobile already exists")) {
        return Response.json({ error: error.message }, { status: 409 });
      }
      console.error("Failed to create:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async updateData(headers: any, id: string, body: any) {
    this.checkContentType(headers);
    try {
      const userData: User = { ...body };
      const user = await this.service.updateUser(id, userData);
      if (!user) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(user, { status: 200 });
    } catch (error: any) {
      if (error.message.includes("Validation error")) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      console.error("Failed to update:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async replaceData(headers: any, id: string, body: any) {
    this.checkContentType(headers);
    try {
      const userData: User = { ...body };
      const user = await this.service.replaceUser(id, userData);
      if (!user) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(user, { status: 200 });
    } catch (error: any) {
      if (error.message.includes("Validation error")) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      console.error("Failed to upgrade:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async deleteData(id: string) {
    try {
      const user = await this.service.delUser(id);
      if (!user) {
        return Response.json({ error: "Not found" }, { status: 404 });
      } else {
        return Response.json({}, { status: 200 });
      }
    } catch (error: any) {
      console.error("Failed to delete:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
