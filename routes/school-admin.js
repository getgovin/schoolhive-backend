import {Router} from "express"

import {  schoolLogin } from "../controller/school.auth.js";
import { verifyToken } from "../utils/jwt.js";
import { classDelete, classFilterList, classList, classUpdate, classView, create } from "../controller/classes.controller.js";
import { sectionCreate, sectionDelete, sectionList, sectionUpdate, sectionView  ,sectionFilterList } from "../controller/section.controller.js";
import { feeeCreate, feeeDelete, feeeUpdate, feeeView, feeList } from "../controller/fee.controller.js";
import { studentCreate, studentdeleted, studentFilterList, studentList, studentUpdate, studentView } from "../controller/student.controller.js";
import uploadFile from "../config/multer.config.js";
import { uploadExcel } from "../middleware/excelUpload.js";
import { importStudents } from "../controller/studentImport.controller.js";
import { downloadReceipt, feeCollectionByStudent, feeCollectionList, feeSubmit } from "../controller/feesCollection.controller.js";
import { promoteStudents } from "../controller/promote.contoller.js";
const router = Router();
// ---------------------- School Routes start ------------------------

router.post("/login", schoolLogin);

// ---------------------- class Routes start ------------------------
router.post("/class/create"  , verifyToken , create )
router.get("/class/list" , verifyToken , classList)
router.get("/class/filter/list" , verifyToken , classFilterList)
router.put("/class/update/:id" , verifyToken , classUpdate)
router.get("/class/view/:id" , verifyToken , classView)
router.delete("/class/delete/:id" , verifyToken , classDelete)

// ---------------------- sections Routes start ------------------------
router.post("/section/create" , verifyToken , sectionCreate)
router.get("/section/list" , verifyToken , sectionList)
router.get("/section/filter/list" , verifyToken , sectionFilterList)
router.put("/section/update/:id" , verifyToken , sectionUpdate)
router.get("/section/view/:id" , verifyToken , sectionView)
router.delete("/section/delete/:id" , verifyToken , sectionDelete)


// ---------------------- Fee Routes start ------------------------

router.post("/fee/create" , verifyToken , feeeCreate);
router.get("/fee/list" , verifyToken , feeList);
router.get("/fee/view/:id" , verifyToken , feeeView);
router.put("/fee/update/:id" , verifyToken , feeeUpdate);
router.delete("/fee/delete/:id" , verifyToken  , feeeDelete)

// ---------------------- Students Routes start ------------------------


router.post("/student/create" , uploadFile("student-photo").single("photo"), verifyToken , studentCreate);
router.get("/student/list" , verifyToken , studentList);
router.get("/student/filter/list" , verifyToken , studentFilterList);
router.get("/student/view/:id" , verifyToken , studentView);
router.put("/student/update/:id" , verifyToken , studentUpdate);
router.delete("/student/delete/:id" , verifyToken , studentdeleted);
// Import Students from Excel
router.post("/student/import", uploadExcel.single("file"), verifyToken , importStudents);


// ---------------------- Fee submission Routes start ------------------------
router.post("/student/feeSubmission" , verifyToken , feeSubmit);
router.get("/fee/download/:id"  , downloadReceipt);
router.get("/fee-collection/student/:studentId", verifyToken, feeCollectionByStudent);
router.get("/fee-collection/list", verifyToken, feeCollectionList);

// ---------------------- Promote Students Routes start ------------------------
router.post("/student/promote" , verifyToken , promoteStudents);




export default router;