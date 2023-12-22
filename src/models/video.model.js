import { Schema, model } from "mongoose";
import mongooseAggregate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videoFiles: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    likes: {
      type: Number,
      required: true,
      trim: true,
      index: true,
    },
    isPublishes: {
      type: Boolean,
      default: false,
    },
  },
  { timstamps: true }
);

videoSchema.plugin(mongooseAggregate);

export const Video = model("Video", videoSchema);
