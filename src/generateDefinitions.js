/**
 * Quick and dirty script to fetch the definitions for an array of words.
 */

const fs = require("fs");

/**
 * Promise-based fs reading from dimpiax on StackOverflow.
 * @param {string} path 
 * @param {string} opts 
 */
const readFile = (path, opts = 'utf8') => {
  return new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
        if (err) rej(err)
        else res(data)
    })
  })
}

/**
 * Generate definitions and return data.
 * @param {string[]} words Array of words to get the definitions for.
 * @returns {Promise} Promise containing an object with definitions and failedWords.
 */
const generateDefinitions = words => {
  return new Promise(async (res, rej) => {
    let response = {
      definitions: {},
      failedWords: []
    }, cachedData = {};

    for(const word of words) {
      const firstLetter = word.charAt(0);

      if(!cachedData[firstLetter]) {
        // If we haven't already loaded the file for this letter, load it
        try {
          const data = await readFile(`../wordset-dictionary/data/${firstLetter}.json`);
          cachedData[firstLetter] = JSON.parse(data);
        } catch(e) {
          console.error(`Definition generation failed on "${word}".`);
          rej(e);
        }
      }

      let definition = cachedData[firstLetter][word];

      if(definition) {
        // Delete wordset-dictionary specific IDs
        delete definition.wordset_id;
        definition.meanings.forEach(meaning => {
          delete meaning.id;
        });

        response.definitions[word] = definition;

      } else {
        response.failedWords.push(word);
      }
    }

    res(response);
  });
}

/**
 * Generate definitions and write files. Saves definitions as 'definitions.json'
 * and failed words as 'failedWords.json'.
 * @param {string[]} words Array of words to get the definitions for.
 * @returns {Promise} Empty promise that resolves on write and rejects on error.
 */
const writeDefinitions = words => {
  return new Promise((res, rej) => {
    generateDefinitions(words).then(response => {

      let jsonDefinitions = JSON.stringify(response.definitions);
      fs.writeFile(
        'definitions.json', jsonDefinitions, 'utf8', res()
      );
    
      if(response.failedWords.length) {
        console.error(`Could not find definitions for ${response.failedWords.length} word(s). These words are listen in "failedWords.json".`)
        let jsonFailedWords = JSON.stringify(response.failedWords);
        fs.writeFile(
          'failedWords.json', jsonData, 'utf8'
        );
      }
    
    }).catch(err => {
      rej(err);
    });
  })
}

// Export functions
module.exports.generateDefinitions = generateDefinitions;
module.exports.writeDefinitions = writeDefinitions;