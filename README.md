# Kanji Display

Kanji app that supports handwriting gestures to easily look up Japanese kanji, with focus on 熟語(jukugo)/compound words.

Goal of the app is to output correct translations and context information. 

# Original app setup:

```
├── src
    ├── assets
    ├── components
    ├── index.css
    ├── main.jsx
    └── pages
        ├── App.css
        └── App.jsx

% npm create vite@latest
    React + TypeScript
% npm i react-router-dom

% touch .gitignore

```

# Attributions & Licenses:

Handwriting and character recognition originally written by [ChenYuHo](https://github.com/ChenYuHo/handwriting.js), handwriting.js [MIT License](https://github.com/ChenYuHo/handwriting.js/blob/master/LICENSE).

This project was inspired by [thekanjimap](https://github.com/gabor-kovacs/the-kanji-map) by [gabor-kovacs](https://github.com/gabor-kovacs/).

The monolingual dictionaries [provided by Shoui](https://learnjapanese.moe/monolingual/) were used, with [license here](https://github.com/shoui520/shoui520.github.io/blob/master/LICENSE).

Kana list data was a modification to json files created by [mdzhang](https://gist.github.com/mdzhang/53b362cadebf2785ca43), [dehmer](https://gist.github.com/dehmer/3ba550aeb453da52f08c3c99217b95c2), and [rdunk](https://gist.github.com/rdunk/6eed1a49ce6456ddcc9dc36af8bca992)

