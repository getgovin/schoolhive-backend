import {Router} from "express"
import { superAdminLogin } from "../controller/superadmin.auth.js";
import { superAdminCreate } from "../controller/superadmin.js";
import { schoolCreate, schoolDelete, schoolList, schoolUpdate, schoolView } from "../controller/school.auth.js";
import uploadFile from "../config/multer.config.js";
const router = Router();
router.post("/login", superAdminLogin);
router.post("/create", superAdminCreate);
router.post("/school/create",  uploadFile("school-logo").single("schoolLogo"), schoolCreate);
router.get("/school/list", schoolList);
router.put("/school/update/:id",  uploadFile("school-logo").single("schoolLogo") ,schoolUpdate);
router.get("/school/view/:id", schoolView);
router.delete("/school/delete/:id", schoolDelete);





export default router;