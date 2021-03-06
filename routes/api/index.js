const router = require("express").Router();
const companyRoutes = require("./companies");
const categoryRoutes = require("./categories");
const adRoutes = require("./ads");
const userRoutes = require("./users");
const meetRoutes = require("./meets");

// Company routes
router.use("/companies", companyRoutes);
router.use("/categories", categoryRoutes);
router.use("/ads", adRoutes);
router.use("/users", userRoutes);
router.use("/meets", meetRoutes);

module.exports = router;
