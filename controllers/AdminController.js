const { Category, User, Courses } = require("../models/index");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const { Readable } = require("stream");

const multerSingle = multer();

const bufferUpload = async (buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readStream.pipe(writeStream);
  });
};

const multerImg = multerSingle.single("image");

const createCourse = async (req, res) => {
  const { title, description, price, name, category } = req.body;
  const { buffer } = req.file;
  try {
    const { secure_url } = await bufferUpload(buffer);
    const create_course = await Courses.create({
      title,
      description,
      category,
      price: +price,
      img_url: secure_url,
    });

    // console.log(create_course.dataValues);

    res.status(200).json({
      success: true,
      message: "Successfully create course",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const dataCourse = await Courses.findAll({
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: dataCourse,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, name, category } = req.body;
  const { buffer } = req.file;

  try {
    const { secure_url } = await bufferUpload(buffer);
    const updateCourse = await Courses.update(
      {
        title,
        description,
        category,
        price: +price,
        img_url: secure_url,
      },
      {
        where: { id },
      }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated course",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    courseCheck = await Courses.findOne({
      where: { id },
      raw: true,
    });

    if (courseCheck) {
      await Courses.destroy({
        where: { id },
      });
      res.status(200).json({
        success: true,
        message: "Successfully deleted course",
      });
    } else {
      res.status(404).json({
        success: true,
        message: "No course found",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const checkUser = await User.findOne({
      where: { id },
      raw: true,
    });

    if (checkUser) {
      await User.update(
        {
          status: "2",
        },
        {
          where: { id, status: "1" },
        }
      );
      res.status(200).json({
        success: true,
        message: "Successfully deleted user",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No User found",
      });

    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getStatistic = async (req, res) => {
  try {
    const totalCourse = await Courses.findAll({
      raw: true,
    })

    const totalFreeCourse = await Courses.findAll({
      where: { price: 0 },
      raw: true,
    })

    console.log(totalCourse.length);

    const totalUser = await User.findAll({
      where: {status:'1', role: '2'},
      raw: true
    })

    res.status(200).json({
      jumlah_course: totalCourse.length,
      jumlah_freeCourse: totalFreeCourse.length,
      jumlahUser: totalUser.length
    })
    
  } catch (error) {
    res.status(500).json({error: error.message})
    
  }
};

module.exports = {
  multerImg,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  deleteUser,
  getStatistic,
};
