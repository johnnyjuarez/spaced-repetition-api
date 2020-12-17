const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const bodyParser = express.json();

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  const [nextWord] = await LanguageService.getLanguageWords(
    req.app.get('db'),
    req.language.id
  );
  res.json({
    nextWord: nextWord.original,
    wordCorrectCount: nextWord.correct_count,
    wordIncorrectCount: nextWord.incorrect_count,
    totalScore: req.language.total_score,
  });
  next();
});

languageRouter.post('/guess', bodyParser, async (req, res, next) => {
  const { guess } = req.body;
  console.log('console', guess);
  if (!guess) {
    return res.status(400).json({
      error: "Missing 'guess' in request body",
    });
  }

  const listWords = LanguageService.getLanguageWords(
    req.app.get('db'),
    req.language.id
  );

  const [{ head }] = LanguageService.getLinkHead(
    req.app.get('db'),
    req.language.id
  );

  // implement me
  res.send('implement me!');
});

module.exports = languageRouter;
