const { User, Courses } = require("../models/index");
const { hashPass, comparePass } = require("../helpers/bcrypt");
const { loginToken } = require("../helpers/jwt");
const { Op } = require("sequelize");

const register = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    const checkEmail = await User.findOne({
      where: { email },
      raw: true,
    });

    const checkUser = await User.findOne({
      where: { username },
      raw: true,
    });

    if (!checkEmail && !checkUser) {
      const hashedPass = hashPass(password);
      console.log(hashedPass);
      const obj = {
        name,
        username,
        email,
        password: hashedPass,
        role,
        status: "1",
      };
      const createUser = await User.create(obj);
      //   console.log(createUser);

      res.status(200).json({
        success: true,
        message: "Your registration was successfull",
      });
    } else {
      res.status(400).json({
        success: true,
        message: "Your email / username has already been registered",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//END Register

//Login FUnction
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkAccount = await User.findOne({
      where: { email },
      raw: true,
    });

    if (!checkAccount) {
      res.status(404).json({
        success: true,
        message: "You have no account",
      });
    } else {
      const checkPass = comparePass(password, checkAccount.password);
      if (checkPass) {
        const token = loginToken({
          id: checkAccount.id,
          email: checkAccount.email,
        });

        res.status(200).json({ succes: true, acces_token: token });
      } else {
        res.status(400).json({
          success: false,
          message: "Wrong email or password",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const getCat = await Courses.findAll({
      where: { category },
      raw: true,
    });

    if (getCat) {
      res.status(200).json({
        success: true,
        data: getCat,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No course found in this category",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await Courses.findAll({
      raw: true,
      attributes: ["title", "price"],
    });

    if (course) {
      res.status(200).json({
        success: true,
        data: course,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getCourseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Courses.findOne({
      where: { id },
      raw: true,
    });

    if (course) {
      res.status(200).json({
        success: true,
        data: course,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const searchCourse = async (req, res) => {
  try {
    const search = `%${req.body.search}%`;
    const course = await Courses.findAll({
      where: {
        title: {
          [Op.iLike]: search,
        },
      },
      raw: true,
    });

    if (course) {
      res.status(200).json({
        success: true,
        data: course,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const sortCourse = async (req, res) => {
  try {
    const { search } = req.body;

    if (search == "lowest") {
      const course = await Courses.findAll({
        order: [["price", "ASC"]],
      });

      res.status(200).json({
        success: true,
        data: course,
      });
    } else if (search == "highest") {
      const course = await Courses.findAll({
        order: [["price", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: course,
      });
    }
    if (search == "free") {
      const course = await Courses.findAll({
        where: { price: 0 },
      });

      res.status(200).json({
        success: true,
        data: course,
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  register,
  login,
  getCategory,
  getCourse,
  getCourseDetail,
  searchCourse,
  sortCourse,
};
