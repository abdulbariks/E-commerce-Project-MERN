const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById, } = require('../controllers/userController');
const { upload } = require('../middlewares/uploadImage');
const { validateUserRegistration } = require('../validators/auth');
const { runValidation } = require('../validators');
const userRouter = express.Router();



userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.post("/process-register", upload.single("image"), validateUserRegistration,runValidation, processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.put("/:id", upload.single("image"), updateUserById);

module.exports ={userRouter}