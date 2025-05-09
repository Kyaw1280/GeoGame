const User = require('../models/user_models');
const db = require('../database/connect');

jest.mock('../database/connect'); // Mock the DB

describe('User Model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users as User instances', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'alice',
          email: 'alice@example.com',
          password: 'hashed123',
          total_score: 120,
          isAdmin: false,
          session_ids: []
        },
        {
          id: 2,
          username: 'bob',
          email: 'bob@example.com',
          password: 'hashed456',
          total_score: 200,
          isAdmin: true,
          session_ids: []
        }
      ];

      db.query.mockResolvedValueOnce({ rows: mockUsers });

      const result = await User.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].username).toBe('alice');
      expect(result[1].isAdmin).toBe(true);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users;');
    });

    it('should throw an error if no users are found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getAll()).rejects.toThrow("No users available.");
    });
  });

  describe('getOneById', () => {
    it('should return a user when a valid ID is passed', async () => {
      const mockUser = {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
        password: 'hashed123',
        total_score: 120,
        isAdmin: false,
        session_ids: []
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.getOneById(1);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.username).toBe('alice');
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1;", [1]);
    });

    it('should throw an error if user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getOneById(999)).rejects.toThrow("Unable to locate user.");
    });
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const inputData = {
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'securePass'
      };

      const insertResponse = {
        id: 10,
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'securePass',
        total_score: 0,
        isAdmin: false,
        session_ids: []
      };

      const fetchResponse = {
        id: 10,
        username: 'charlie',
        email: 'charlie@example.com',
        password: 'securePass',
        total_score: 0,
        isAdmin: false,
        session_ids: []
      };

      db.query
        .mockResolvedValueOnce({ rows: [insertResponse] }) // insert
        .mockResolvedValueOnce({ rows: [fetchResponse] }); // getOneById

      const result = await User.create(inputData);

      expect(result).toBeInstanceOf(User);
      expect(result.username).toBe('charlie');
      expect(result.id).toBe(10);
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('should update the user fields and return updated User instance', async () => {
      const initialUser = new User({
        id: 5,
        username: 'delta',
        email: 'delta@web.com',
        password: 'init',
        total_score: 50,
        isAdmin: false,
        session_ids: []
      });

      const updatedRow = {
        id: 5,
        username: 'delta_new',
        email: 'delta_new@web.com',
        password: 'updatedpass',
        total_score: 100,
        isAdmin: true,
        session_ids: []
      };

      db.query.mockResolvedValueOnce({ rows: [updatedRow] });

      const result = await initialUser.update({
        username: 'delta_new',
        email: 'delta_new@web.com',
        password: 'updatedpass',
        total_score: 50, // increment
        isAdmin: true
      });

      expect(result).toBeInstanceOf(User);
      expect(result.username).toBe('delta_new');
      expect(result.total_score).toBe(100);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), [
        'delta_new', 'delta_new@web.com', 'updatedpass', 50, true, 5
      ]);
    });

    it('should throw an error if update fails', async () => {
      const user = new User({
        id: 3,
        username: 'erroruser',
        email: 'fail@web.com',
        password: 'pass',
        total_score: 10,
        isAdmin: false,
        session_ids: []
      });

      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(user.update({ username: 'fail_update' })).rejects.toThrow("Unable to update user.");
    });
  });

  describe('destroy', () => {
    it('should delete a user and return the deleted user instance', async () => {
      const mockUser = {
        id: 6,
        username: 'to_delete',
        email: 'bye@web.com',
        password: 'pass',
        total_score: 0,
        isAdmin: false,
        session_ids: []
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const user = new User(mockUser);
      const result = await user.destroy({ id: 6 });

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(6);
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = $1 RETURNING *;',
        [6]
      );
    });

    it('should throw an error if the user cannot be deleted', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const user = new User({
        id: 6,
        username: 'ghost',
        email: 'ghost@web.com',
        password: 'nope',
        total_score: 0,
        isAdmin: false,
        session_ids: []
      });

      await expect(user.destroy({ id: 6 })).rejects.toThrow("Unable to delete user.");
    });
  });
});