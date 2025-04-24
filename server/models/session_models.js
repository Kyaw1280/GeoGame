const db = require('../database/connect.js');

class Session {

 constructor({ session_id, user_id, session_type, session_score }) {
     this.id = session_id;
     this.user_id = user_id;
     this.session_type = session_type;
     this.session_score = session_score;
   }
 
   static async getAll() {
     const response = await db.query("SELECT * FROM sessions;");
     if (response.rows.length === 0) {
       throw new Error("No sessions available in DB.")
     }
 
     return response.rows.map(s => new Session(s));
   }
 
   static async getOneById(id) {
     const response = await db.query("SELECT * FROM sessions WHERE id = $1;", [id]);
 
     if (response.rows.length != 1) {
       throw new Error("Unable to locate session.")
     }
 
     return new Session(response.rows[0]);
   }
 
   static async create(data) { // this method will only be used by the game logic itself, to log a session when it is completed
     const { user_id, session_type, session_score } = data;
     const response = await db.query('INSERT INTO sessions (user_id, session_type, session_score) VALUES ($1, $2, $3) RETURNING *;', [user_id, session_type, session_score]);
     const sessionId = response.rows[0].id;
     const newSession = await Session.getOneById(sessionId);
     return newSession;
   }
 
   async destroy(data) {
     const response = await db.query('DELETE FROM sessions WHERE id = $1 RETURNING *;', [data.id]);
     if (response.rows.length != 1) {
       throw new Error("Unable to delete session.")
     }
 
     return new Session(response.rows[0]);
   }
 }

 // no update method is needed for the session model, as sessions are immutable once created

module.exports = Session;