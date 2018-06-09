## Standardized Tests Word Lists
This is a collection of word lists for standardized tests, in JSON format with definitions.

### Data Structure
All of the lists are location in the _lists_ folder. The data is structured like so:

```JSON
{
  "WORD": {
    "word": "WORD",
    "meanings": [
      {
        "def": "a definition of the word",
        "speech_part": "partofspeech",
        "synonyms": ["similar phrase", "similarword"]
      },
      {
        ...
      },
    ]
  },
  ...
}
```

### License
All of the word data is available under the CC-BY-SA 4.0 license. The original definition data is from the wordset-dictionary repository.

### Contributing
If you have an array of words without definitions and you'd like to contribute, there are some helpful functions in the src folder. 