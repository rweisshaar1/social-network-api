const router = require('express').Router();
const { Thought, User } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const allThoughts = await Thought.find();
    res.json(allThoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const oneThought = await Thought.findById(req.params.id);
    res.json(oneThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(
      req.body)
    await User.findByIdAndUpdate(req.body.userId,
      { $push: { thoughts: newThought._id } })
    res.json(newThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const putThought = await Thought.findByIdAndUpdate(req.params.id,
      req.body,
      { new: true });
    res.json(putThought);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteThought = await Thought.findByIdAndRemove(req.params.id);
    await User.findByIdAndUpdate(req.body.userId,
      { $pull: { thoughts: { where: { _id: req.body.userId } } } })
    res.json(deleteThought);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// reactions
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const newThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } }, { new: true }) //<--- help here
    res.json(newThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:thoughtId/reactions', async (req, res) => {
  try {
    const deleteReaction = await Thought.findByIdAndUpdate(req.params.thoughtId,
      { $pull: { reactions:  { reactionId: req.body.reactionId } } }, { new: true })
    res.json(deleteReaction);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
