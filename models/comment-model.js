const pool = require("../database/");

/* ***************************
 *  Add a new comment
 * ************************** */
async function addComment(vehicle_id, user_id, comment_text) {
  try {
    const sql = `INSERT INTO public.comments (vehicle_id, user_id, comment_text) 
                     VALUES ($1, $2, $3) RETURNING *`;
    const data = await pool.query(sql, [vehicle_id, user_id, comment_text]);
    return data.rows[0];
  } catch (error) {
    console.error("addComment error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get comments by vehicle ID
 * ************************** */
async function getCommentsByVehicleId(vehicle_id) {
  try {
    const sql = `SELECT c.comment_id, c.comment_text, c.comment_date, a.account_firstname, a.account_lastname
                     FROM public.comments AS c
                     JOIN public.account AS a ON c.user_id = a.account_id
                     WHERE c.vehicle_id = $1
                     ORDER BY c.comment_date DESC`;
    const data = await pool.query(sql, [vehicle_id]);
    return data.rows;
  } catch (error) {
    console.error("getCommentsByVehicleId error: " + error);
    throw error;
  }
}

module.exports = {
  addComment,
  getCommentsByVehicleId,
};
