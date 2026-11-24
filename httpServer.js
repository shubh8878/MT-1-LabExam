// Import required modules
import http from "http";
import fs from "fs";

// Array to store vehicle records
let vehicles = [
  {
    id: 1,
    vehicleName: "Hyundai Creta",
    vehicleNumber: "HR26AB1234",
    type: "SUV",
    price: 1500000,
  },
  {
    id: 2,
    vehicleName: "Maruti Swift",
    vehicleNumber: "DL8CAF5030",
    type: "Hatchback",
    price: 750000,
  },
  {
    id: 3,
    vehicleName: "Honda City",
    vehicleNumber: "UP16CD4567",
    type: "Sedan",
    price: 1200000,
  },
];

// Create HTTP server
const server = http.createServer((req, res) => {
  // Route 1: Welcome page
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(`
            <h1>Welcome to Vehicle Management System</h1>
            <p>Manage your vehicle records easily.</p>
        `);
  }

  // Route 2: Get all vehicles
  else if (req.url === "/vehicles" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(vehicles));
  }

  // Route 3: About application
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(`
            <h1>About Vehicle Management System</h1>
            <p>This application is developed using Node.js HTTP and FS modules.</p>
        `);
  }

  // Route 4: Read static HTML file using FS module
  else if (req.url === "/info" && req.method === "GET") {
    fs.readFile("./public/info.html", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        res.end("Internal Server Error: Unable to read file");
      } else {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });

        res.end(data);
      }
    });
  }

  // Route 5: Add vehicle using POST method
  else if (req.url === "/add-vehicle" && req.method === "POST") {
    let body = "";

    // Receive incoming data
    req.on("data", (chunk) => {
      body += chunk;
    });

    // Process received data
    req.on("end", () => {
      try {
        const newVehicle = JSON.parse(body);

        // Check required fields
        const requiredFields = [
          "id",
          "vehicleName",
          "vehicleNumber",
          "type",
          "price",
        ];

        const missingFields = requiredFields.some(
          (field) =>
            newVehicle[field] === undefined ||
            newVehicle[field] === null ||
            newVehicle[field] === "",
        );

        if (missingFields) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "All vehicle fields are required",
            }),
          );

          return;
        }

        // Add vehicle to array
        vehicles.push(newVehicle);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Vehicle added successfully",
            vehicle: newVehicle,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON data",
          }),
        );
      }
    });
  }

  // Handle invalid routes
  else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 - Page Not Found");
  }
});

// Start server on port 3000
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
