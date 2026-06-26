import {Router} from "express"

import {  schoolLogin } from "../controller/school.auth.js";
import { verifyToken } from "../utils/jwt.js";
import { classDelete, classList, classUpdate, create } from "../controller/classes.controller.js";
import { sectionCreate, sectionDelete, sectionList, sectionUpdate, sectionView } from "../controller/section.controller.js";
const router = Router();
router.post("/login", schoolLogin);

// ---------------------- class Routes start ------------------------
router.post("/class/create"  , verifyToken , create )
router.get("/class/list" , verifyToken , classList)
router.put("/class/update/:id" , verifyToken , classUpdate)
router.delete("/class/delete/:id" , verifyToken , classDelete)

// ---------------------- sections Routes start ------------------------
router.post("/section/create" , verifyToken , sectionCreate)
router.get("/section/list" , verifyToken , sectionList)
router.put("/section/update" , verifyToken , sectionUpdate)
router.get("/section/view" , verifyToken , sectionView)
router.delete("/section/delete" , verifyToken , sectionDelete)




export default router;