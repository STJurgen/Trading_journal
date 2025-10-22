const Strategy = require('../models/Strategy');

const listStrategies = async (req, res, next) => {
  try {
    const strategies = await Strategy.findAllByUser(req.user.id);
    res.json(strategies);
  } catch (error) {
    next(error);
  }
};

const getStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.findById(req.params.id, req.user.id);
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }
    res.json(strategy);
  } catch (error) {
    next(error);
  }
};

const createStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.create(req.user.id, req.body);
    res.status(201).json(strategy);
  } catch (error) {
    next(error);
  }
};

const updateStrategy = async (req, res, next) => {
  try {
    const strategy = await Strategy.update(req.params.id, req.user.id, req.body);
    if (!strategy) {
      return res.status(404).json({ message: 'Strategy not found' });
    }
    res.json(strategy);
  } catch (error) {
    next(error);
  }
};

const deleteStrategy = async (req, res, next) => {
  try {
    await Strategy.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listStrategies,
  getStrategy,
  createStrategy,
  updateStrategy,
  deleteStrategy
};
