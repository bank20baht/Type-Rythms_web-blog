const { User } = require("../models/user")

const getUser = async (req, res) => {
    try {
      const user = await User.findOne({ name: req.params.id });
      if (user) {
        const response = {
            name:user.name,
            email: user.email,
            image: user.image,
        }
        res.status(200).send(response);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  };
  

module.exports = {getUser}