const fs = require("fs");
const path = require("path");
const express = require("express"); // Ensure express is required for instanceof checks
const productRoutes = require("./productRoutes");

exports.loadAppRoutes = (app) => {
  const registeredRoutes = []; // Store all routes for logging

  const loadRoutes = (baseRoute, routesPath) => {
    const files = fs.readdirSync(routesPath).sort();
    files.forEach((file) => {
      if (file.endsWith(".js")) {
        const routePath = path.join(routesPath, file);
        const route = require(routePath);

        // Validate the route is a middleware function or Router
        if (typeof route === "function" || route instanceof express.Router) {
          const routeName = file.replace(".js", "");
          const fullPath = `/${baseRoute}/${routeName}`;
          app.use(fullPath, route);
          registeredRoutes.push(fullPath); // Add the route to the list
          console.log(`Loaded route: ${fullPath}`);
        } else {
          console.error(
            `Invalid route in file: ${file}. Expected a middleware function or Router.`
          );
        }
      }
    });
  };

  loadRoutes("v1", productRoutes);

  console.log("\nRegistered Routes:");
  registeredRoutes.forEach((route) => console.log(route));
};
