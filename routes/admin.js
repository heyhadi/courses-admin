const router = require("express").Router();
const AdminController  = require('../controllers/AdminController')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')

router.use(authentication)


router.post('/create-course', authorization, AdminController.multerImg, AdminController.createCourse)
router.put('/update-course/:id', authorization, AdminController.multerImg, AdminController.updateCourse)
router.delete('/delete-course/:id', authorization, AdminController.deleteCourse)
router.put('/delete-user/:id', authorization, AdminController.deleteUser)
router.get('/get-course', authorization, AdminController.getCourse)
router.get('/get-statistic', authorization, AdminController.getStatistic)


module.exports = router;
