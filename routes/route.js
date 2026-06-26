import superAdminRoutes from "./super-admin.router.js";
import schoolAdminRouter from "./school-admin.js";

import { Router } from "express";
 
const  router = Router();

// Super Admin Routes
router.use("/superadmin",  superAdminRoutes  );
router.use("/school",  schoolAdminRouter  );


export default router;