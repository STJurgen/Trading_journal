const { register } = require('../src/controllers/authController');

describe('Auth Controller', () => {
  it('returns 400 when required fields are missing during registration', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    expect(next).not.toHaveBeenCalled();
  });
});
