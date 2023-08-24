const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      max_length: 280,
      minlength: 4,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      getters: true,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: {},
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return `${this.reactions}`;
  })
  // Setter to set the first and last name
  .set(function (v) {
    const reactions = v.length
    this.set({ reactions });
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
