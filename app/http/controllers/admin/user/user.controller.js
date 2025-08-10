const Controller = require("../../controller");
const createError = require("http-errors");
const { UserModel } = require("../../../../models/user");
const bcrypt = require("bcryptjs");

const {
  generateToken,
  setAccessToken,
  setRefreshToken,
} = require("../../../../../utils/functions");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const {
  updateProfileSchema,
} = require("../../../validators/admin/user.schema");

class UserAuthController extends Controller {
  async checkUserExist(phoneNumber) {
    const user = await UserModel.findOne({ phoneNumber });
    return user;
  }

  async registerUser(req, res) {
    const user = await this.checkUserExist(req.body.phoneNumber);
    if (user)
      throw createError.BadRequest("کاربر با این شماره موبایل وجود دارد!");

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const newUser = new UserModel({
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    // if (!savedUser) throw createError.InternalServerError('خطای داخلی');
    await setAccessToken(res, savedUser);
    // await setRefreshToken(res, savedUser);
    return res.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OKk,
      data: {
        message: "ثبت نام با موفقیت انجام شد",
        user: savedUser,
      },
    });
  }

  async login(req, res) {
    const users = await UserModel.find();
    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!user) throw createError.BadRequest("ایمیل یا رمز عبور اشتباه است");
    const isValidPass = bcrypt.compareSync(req.body.password, user.password);
    if (isValidPass) {
      await setAccessToken(res, user);
      // await setRefreshToken(res, user);
      return res.status(HttpStatus.OK).json({
        data: {
          message: "ورود با موفقیت انجام شد",
          user: user,
        },
      });
    } else throw createError.BadRequest("ایمیل یا رمز عبور اشتباه است");
  }

  async logout(req, res) {
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: false,
      signed: true,
      sameSite: "Lax",
      secure: true,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? "shayan-real-estate.liara.run"
          : "localhost",
    };
    res.cookie("accessToken", null, cookieOptions);
    // res.cookie("refreshToken", null, cookieOptions);

    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      roles: null,
      auth: false,
    });
  }

  async getAllUser(req, res) {
    const users = await UserModel.find();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }

  async getUserProfile(req, res) {
    const user = await UserModel.findById(req.user._id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { user },
    });
  }

  async removeUser(req, res) {
    const { id } = req.params;
    await this.findUserById(id);
    const deleteResult = await UserModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount == 0)
      throw createError.InternalServerError("حدف کاربر انجام نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "حذف کاربر با موفقیت انجام شد",
      },
    });
  }

  async updateUserProfile(req, res) {
    const { id } = req.params;
    await updateProfileSchema.validateAsync(req.body);
    const { fullName, email, phoneNumber } = req.body;

    const updateResult = await UserModel.updateOne(
      { _id: id },
      {
        $set: { fullName, email, phoneNumber },
      }
    );
    if (updateResult.modifiedCount == 0)
      throw createError.BadRequest("اطلاعات ویرایش نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات با موفقیت آپدیت شد",
      },
    });
  }

  async findUserById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه کاربر ارسال شده صحیح نمیباشد");
    const user = await UserModel.findById(id);
    if (!user) throw createHttpError.NotFound("کاربری یافت نشد.");
    return user;
  }
}

module.exports = {
  UserController: new UserAuthController(),
};
