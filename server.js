import { static as static_ } from 'express'
import config from "./config/config.js";
import app from "./server/express.js";
import { join } from "path";
import __dirname from "./server/_dirname.js";
import template from './public/template.js';
import { env } from 'node:process';

// Import routes
import authRoutes from './server/routes/auth.Routes.js';
import userRoutes from './server/routes/user.Routes.js';
import transactionRoutes from './server/routes/transaction.Routes.js';
import messageRoutes from './server/routes/message.Routes.js';
import reviewRoutes from './server/routes/review.Routes.js';
import productRoutes from './server/routes/product.Routes.js';


//mongoose
// import mongoose from "mongoose";
// mongoose.Promise = global.Promise;
// mongoose.connect(config.mongoUri)
//   .then(() => console.log("Connected to MongoDB successfully!"))
//   .catch((err) => console.error("Connection error", err));
// mongoose.connection.on("error", (e) => {
//   console.log(e)
//   throw new Error(`unable to connect to database: ${ config.mongoUri }`);
// });

// app.get("/*", (_req, res) => {
//   res.sendFile(join(__dirname, "../public", "index.html"));
// });

// app.get("/", (_req, res) => {
//   res.status(200).send(template());
// });

// app.use("/", static_(join(__dirname, "public")));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to User application." });
});

// API Routes
const apiVersion = "apiV1.0.0" || env.API_VERSION_V_ONE;

app.use(`/${apiVersion}/auth`, authRoutes);
app.use(`/${apiVersion}/users`, userRoutes);
app.use(`/${apiVersion}/transactions`, transactionRoutes);
app.use(`/${apiVersion}/messages`, messageRoutes);
app.use(`/${apiVersion}/reviews`, reviewRoutes);
app.use(`/${apiVersion}/products`, productRoutes);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.redirect('/');
});


//testing firebase
import gDB from './server/config/firebaseConfig.js';

async function testFirestore() {
  const testDocRef = gDB.db.collection('test').doc('testDoc');
  await testDocRef.set({ message: 'Hello, Firebase!' });
  const doc = await testDocRef.get();
  console.log(doc.data()); // Should log the test message
}

testFirestore();


// ----app listening------
app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});


