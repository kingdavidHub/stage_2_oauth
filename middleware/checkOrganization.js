import db from "../db/index.js";

async function checkOrgAccess(req, res, next) {
  const {
    user: { id },
  } = req.user;
  // const userId = req.user.id; // Assume req.user contains the authenticated user's info
  const orgId = req.params.orgId; // Assume orgId is passed as a URL parameter

  try {
    const result = await db.query(
      'SELECT * FROM user_organization WHERE userid = $1 AND orgid = $2',
      [id, orgId]
    );

    if (result.rows.length > 0) {
      next(); // User has access, proceed to the next middleware/route handler
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

export default checkOrgAccess;