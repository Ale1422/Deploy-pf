const { Router } = require("express");
const userExtractor = require("../middleware/userExtractor");
const authGoogle = require("../middleware/auth");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const timeIp = require("../middleware/timeIp");
const cors =require('cors')

const {
  getAllUsers,
  getUserProfile,
  registerUser,
  editUser,
  registerGoogle,
  getUserBookingHistory,
  updateStatus,
  addfavorite,
  findFavorite,
  delFavorite,
  findOneFav,
} = require("../controllers/user");
const { loginUser, checkedEmail } = require("../controllers/login");
const router = Router();

const registerSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .min(1)
    .max(40)
    .required(),
  email: Joi.string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),

  lastName: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .min(1)
    .max(40)
    .required(),
});
const loginSchema = Joi.object({
  email: Joi.string()
    .regex(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required(),
  password: Joi.string().required(),
});


router.get("/", timeIp, getAllUsers);
router.get("/checkedEmail", timeIp, checkedEmail);
router.get("/bookings", timeIp, userExtractor, authGoogle, getUserBookingHistory);
router.get("/profile",timeIp, userExtractor, authGoogle, getUserProfile);
router.get("/fav",timeIp, userExtractor, authGoogle, findFavorite);
router.get("/onefav", timeIp, userExtractor, authGoogle, findOneFav)
router.post("/googleRegister", timeIp, userExtractor, authGoogle, registerGoogle);
router.post("/register", timeIp, validator.body(registerSchema), registerUser);
router.post("/login", timeIp, validator.body(loginSchema), loginUser);
router.put("/fav",timeIp, userExtractor, authGoogle, addfavorite);
router.options("/edit", cors());
router.put("/edit", cors(),timeIp, userExtractor, authGoogle, editUser);
router.put("/updateStatus",timeIp, userExtractor, authGoogle, updateStatus);
router.delete("/fav/:courtId", userExtractor, authGoogle, delFavorite);

module.exports = router;
