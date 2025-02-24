import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { describe, expect, test, vi } from "vitest";


vi.mock("../../routes/authRoutes.js", () => {

    const express = require("express");
  const dummyRouter = express.Router();
  dummyRouter.get("/test", (req: Request, res: Response) => {
    res.send("auth works");
  });
  return { default: dummyRouter };
});


import router from "../../routes/index.js";

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.use("/", router);


  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(err.message);
  });

  return app;
};

describe("Main Router", () => {
  const app = createApp();

  test("should mount authRoutes under /auth", async () => {

    const response = await request(app).get("/auth/test");
    expect(response.status).toBe(200);
    expect(response.text).toBe("auth works");
  });

  test("should handle error in /error-test endpoint", async () => {

    const response = await request(app).get("/error-test");
    expect(response.status).toBe(500);
    expect(response.text).toBe("Test error from route");
  });
});
