const router = require('express').Router();
const { User } = require('../../models');


router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const oneUser = await User.findOne({ _id: req.params.id }).populate("thoughts")
      .select('-__v');

    if (!oneUser) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    res.json(oneUser);
  } catch (err) {
    res.status(500).json(err.message);
  }})

router.post("/", async (req, res) => {
  try {
    const postUser = await User.create(req.body);
    res.json(postUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

router.put("/:id", async (req, res) => {
  try {
    const putUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(putUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndRemove(req.params.id);
    res.json(deleteUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const addFriendList = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } }
    );

    if (!addFriendList) {
      return res
        .status(404)
        .json({ message: 'No friend found with that ID :(' });
    }
    res.json(addFriendList);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const addFriendList = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } }
    );

    if (!addFriendList) {
      return res
        .status(404)
        .json({ message: 'No friend found with that ID :(' });
    }
    res.json(addFriendList);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
