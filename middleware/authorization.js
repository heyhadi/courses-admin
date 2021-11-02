const { User } = require('../models/index')

async function authorization(req, res, next) {
    // console.log(req.loggedInUser);
    const { id } = req.loggedInUser
    // console.log(id);
    try {
        console.log(id);
      let user = await User.findOne({
          where:{
            id
          }
      })
    //   console.log(user);
      if (user.email === "admin@mail.com"){
        next()
      }
      else {
        res.status(401).json('not authorized')
      }
    } catch (error) {
      res.status(500).json(error.message)
    }
}
module.exports= authorization