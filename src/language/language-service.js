const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  getNextWord(db, language_id) {
    return db
      .from('word')
      .join('language', 'word_id', '=', 'language.head')
      .select('original', 'language_id', 'correct_count', 'incorrect_count')
      .where({ language_id });
  },
  getLinkHead(db, language_id) {
    return db
      .from('language')
      .join('word', 'word.language_id', '=', 'language.id')
      .select('head')
      .where({ language_id });
  },
};

module.exports = LanguageService;
