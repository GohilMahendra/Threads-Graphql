"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        }],
    replies: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            content: {
                type: String,
                required: true
            },
            created_at: {
                type: mongoose_1.default.Schema.Types.Date,
                default: Date.now()
            },
            updated_at: {
                type: mongoose_1.default.Schema.Types.Date,
                default: Date.now()
            }
        }]
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
