const Session = require('../models/session_models');
const sessionController = require('../controllers/session_controllers');

jest.mock('../models/session_models');

describe('Session Controller', () => {

  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return all sessions with status 200', async () => {
      const mockSessions = [{ id: 1 }, { id: 2 }];
      Session.getAll.mockResolvedValue(mockSessions);

      await sessionController.index(req, res);

      expect(Session.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSessions);
    });

    it('should handle errors and return status 500', async () => {
      Session.getAll.mockRejectedValue(new Error('DB error'));

      await sessionController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('show', () => {
    it('should return a session by ID with status 200', async () => {
      const mockSession = { id: 1 };
      req.params = { id: '1' };

      Session.getOneById.mockResolvedValue(mockSession);

      await sessionController.show(req, res);

      expect(Session.getOneById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSession);
    });

    it('should handle not found error with status 404', async () => {
      req.params = { id: '99' };
      Session.getOneById.mockRejectedValue(new Error('Session not found'));

      await sessionController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Session not found' });
    });
  });

  describe('create', () => {
    it('should create a new session with status 201', async () => {
      const newSession = { id: 10 };
      req.body = { user_id: 1, session_type: 'quiz', session_score: 100 };

      Session.create.mockResolvedValue(newSession);

      await sessionController.create(req, res);

      expect(Session.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newSession);
    });

    it('should handle creation error with status 404', async () => {
      req.body = { user_id: 1 };
      Session.create.mockRejectedValue(new Error('Creation failed'));

      await sessionController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Creation failed' });
    });
  });

  describe('destroy', () => {
    it('should delete a session and return result with status 204', async () => {
      const mockSession = {
        destroy: jest.fn().mockResolvedValue({ success: true })
      };

      req.params = { id: '5' };
      Session.getOneById.mockResolvedValue(mockSession);

      await sessionController.destroy(req, res);

      expect(Session.getOneById).toHaveBeenCalledWith(5);
      expect(mockSession.destroy).toHaveBeenCalledWith({ id: 5 });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle deletion error with status 404', async () => {
      req.params = { id: '999' };
      Session.getOneById.mockRejectedValue(new Error('Not found'));

      await sessionController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});
