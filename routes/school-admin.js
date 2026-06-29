import {Router} from "express"

import {  schoolLogin } from "../controller/school.auth.js";
import { verifyToken } from "../utils/jwt.js";
import { classDelete, classList, classUpdate, create } from "../controller/classes.controller.js";
import { sectionCreate, sectionDelete, sectionList, sectionUpdate, sectionView } from "../controller/section.controller.js";
import { feeeCreate, feeeDelete, feeeUpdate, feeeView, feeList } from "../controller/fee.controller.js";
const router = Router();
// ---------------------- School Routes start ------------------------

router.post("/login", schoolLogin);

// ---------------------- class Routes start ------------------------
router.post("/class/create"  , verifyToken , create )
router.get("/class/list" , verifyToken , classList)
router.put("/class/update/:id" , verifyToken , classUpdate)
router.delete("/class/delete/:id" , verifyToken , classDelete)

// ---------------------- sections Routes start ------------------------
router.post("/section/create" , verifyToken , sectionCreate)
router.get("/section/list" , verifyToken , sectionList)
router.put("/section/update/:id" , verifyToken , sectionUpdate)
router.get("/section/view/:id" , verifyToken , sectionView)
router.delete("/section/delete/:id" , verifyToken , sectionDelete)


// ---------------------- Fee Routes start ------------------------

router.post("/fee/create" , verifyToken , feeeCreate);
router.get("/fee/list" , verifyToken , feeList);
router.get("/fee/view/:id" , verifyToken , feeeView);
router.put("/fee/update/:id" , verifyToken , feeeUpdate);
router.delete("/fee/delete/:id" , verifyToken  , feeeDelete)








export default router;