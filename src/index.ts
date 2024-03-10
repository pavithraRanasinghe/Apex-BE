import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import shipmentRouter from "./routes/shipment.routes";
import adminShipmentRouter from './routes/adminShipment.routes';

import { createUser, findUnique } from "./services/user.service";
import { Role } from "@prisma/client";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/shipment", shipmentRouter);
app.use("/api/admin/shipment", adminShipmentRouter);

const createAdmin = async () => {
  const user = await findUnique({ email: "admin@apex.com" });
  if (!user) {
    const password = await bcrypt.hash("admin1234", 12);
    await createUser({
      name: "Admin",
      address: "Office",
      email: "admin@apex.com",
      password: password,
      role: Role.ADMIN,
    });
  }
};

createAdmin();

app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
