import cluster from "cluster";
import os from "os";
import app from "./app";
import mongoose from "mongoose";
import { config } from "./config/config";

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(config.PORT, () =>
      console.log("Server running at port " + config.PORT)
    );
  })
  .catch((err) => console.log("Failed to connect DB", err));

// To Scalable Node app,
// By creating Worker Threads

// // Total number of CPU cores in the running machine
// const totalCPUs: number = os.cpus().length;

// if (cluster.isPrimary) {
//   // If Node server is primary, create worker threads and fork them.
//   console.log(`Primary Worker ${process.pid} is running`);

//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }

//   // When a worker dies, log it and fork a new worker
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
//     cluster.fork();
//   });
// } else {
//   // If worker process, start the server
//   mongoose
//     .connect(config.MONGO_URI)
//     .then(() => {
//       console.log(`MongoDB connected for ${process.pid} Worker`);
//       app.listen(config.PORT, () =>
//         console.log(`Worker ${process.pid} running on port ${config.PORT}`)
//       );
//     })
//     .catch((err) => console.log("Failed to connect DB", err));
// }
