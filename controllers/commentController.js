const commentModel = require("../models/comment-model");
const utilities = require("../utilities");

async function addComment(req, res) {
  const { vehicle_id, user_id, comment_text } = req.body;
  try {
    await commentModel.addComment(vehicle_id, user_id, comment_text);
    req.flash("success", "Comment added successfully.");
    res.redirect(`/inv/detail/${vehicle_id}`);
  } catch (error) {
    console.error("addComment error: " + error);
    req.flash("error", "Failed to add comment.");
    res.redirect(`/inv/detail/${vehicle_id}`);
  }
}

module.exports = {
  addComment,
};
