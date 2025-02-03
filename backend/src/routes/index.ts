import { Router } from "express";
import authRoutes from "./authRoutes.js";

const router = Router();

router.use("/auth", authRoutes);


router.get("/error-test", (_req, _res) => {
    throw new Error("Test error from route");
  });
  
  

export default router;
