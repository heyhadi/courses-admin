const router = require("express").Router();
const UserController  = require('../controllers/userController')
const authentication = require('../middleware/authentication')


router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(authentication)
router.post('/get-category', UserController.getCategory)
router.get('/get-course', UserController.getCourse)
router.get('/get-course-detail/:id', UserController.getCourseDetail)
router.post('/search-course', UserController.searchCourse)
router.post('/sort-course', UserController.sortCourse)



module.exports = router;
