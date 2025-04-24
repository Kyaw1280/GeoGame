const Session = require('../models/session_models');
const db = require('../database/connect');

jest.mock('../database/connect'); // Mock the DB connection module when we have it

describe('Session Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all sessions as Session instances', async () => {
      const mockSessions = [
        { session_id: 1, user_id: 101, session_type: 'quiz', session_score: 85 },
        { session_id: 2, user_id: 102, session_type: 'challenge', session_score: 92 },
      ];

      db.query.mockResolvedValueOnce({ rows: mockSessions });

      const result = await Session.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Session);
      expect(result[0].id).toBe(1);
      expect(result[1].session_score).toBe(92);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM sessions;');
    });

    it('should throw an error if no sessions are found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(Session.getAll()).rejects.toThrow("No sessions available in DB.");
    });
  });

  describe('getOneById', () => {
    it('should return a session when a valid ID is passed', async () => {
      const mockSession = { session_id: 1, user_id: 101, session_type: 'quiz', session_score: 88 };
      db.query.mockResolvedValueOnce({ rows: [mockSession] });

      const result = await Session.getOneById(1);

      expect(result).toBeInstanceOf(Session);
      expect(result.id).toBe(1);
      expect(result.user_id).toBe(101);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM sessions WHERE id = $1;", [1]);
    });

    it('should throw an error if no session is found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(Session.getOneById(999)).rejects.toThrow("Unable to locate session.");
    });

    it('should throw an error if multiple sessions are found (data error)', async () => {
      const mockSessions = [
        { session_id: 1, user_id: 101, session_type: 'quiz', session_score: 88 },
        { session_id: 1, user_id: 101, session_type: 'quiz', session_score: 88 }
      ];
      db.query.mockResolvedValueOnce({ rows: mockSessions });

      await expect(Session.getOneById(1)).rejects.toThrow("Unable to locate session.");
    });
  });

  describe('create', () => {
    it('should create a new session and return it', async () => {
      const inputData = {
        user_id: 101,
        session_type: 'quiz',
        session_score: 95
      };

      const insertedRow = {
        id: 123,
        user_id: 101,
        session_type: 'quiz',
        session_score: 95
      };

      const getRow = {
        session_id: 123,
        user_id: 101,
        session_type: 'quiz',
        session_score: 95
      };

      db.query
        .mockResolvedValueOnce({ rows: [insertedRow] }) // insert
        .mockResolvedValueOnce({ rows: [getRow] }); // getOneById

      const result = await Session.create(inputData);

      expect(result).toBeInstanceOf(Session);
      expect(result.id).toBe(123);
      expect(result.session_score).toBe(95);
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('destroy', () => {
    it('should delete a session and return the deleted session instance', async () => {
      const mockData = {
        id: 321,
        user_id: 105,
        session_type: 'practice',
        session_score: 77
      };

      const dbReturn = {
        session_id: 321,
        user_id: 105,
        session_type: 'practice',
        session_score: 77
      };

      db.query.mockResolvedValueOnce({ rows: [dbReturn] });

      const session = new Session(dbReturn);
      const result = await session.destroy({ id: 321 });

      expect(result).toBeInstanceOf(Session);
      expect(result.id).toBe(321);
      expect(result.user_id).toBe(105);
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM sessions WHERE id = $1 RETURNING *;',
        [321]
      );
    });

    it('should throw an error if the session cannot be deleted', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const session = new Session({ session_id: 321, user_id: 105, session_type: 'practice', session_score: 77 });

      await expect(session.destroy({ id: 321 })).rejects.toThrow("Unable to delete session.");
    });
  });
});
