Demo
----

<http://gaurav0.github.com/Old-School-RPG-Map>

Introduction
------------

This is a demo of an old school console style JRPG, perhaps like Dragon Warrior
or Final Fantasy for the original NES. It is written in 100% HTML5, CSS, and
JavaScript, with no server side processing or client side plugins. A modern
HTML5 capable browser is required to run the game.

Contributing
------------

Contributions are welcome! Just fork the source, and when you have something
you'd like to see added here, submit a pull request.

Any art contributed must be clearly licensed. The following licenses are
preferred: Public Domain, CC0, CC-BY. Please place a link to the art's
source in the credits at the bottom of `index.html`. If you created the art
yourself, please submit it to opengameart.org and then use the link from there.

Building
--------

There is **no** build or bundle step. Open `index.html` in a modern browser; scripts
are listed in dependency order (`js/i18n.js`, `js/lang/en-ui.js`, game data under `js/game/`, etc.).

**i18n:** `js/lang/en-ui.js` registers locale `en` (canonical English strings). `zh-ui.js` / `ja-ui.js`
add `zh` / `ja`. Optional `?lang=ja` forces a registered locale code.

License
-------

HTML5 Canvas Old School RPG Demo is licensed under the MPL/GPL/LGPL tri-license.
Under this license, you may use the engine to make your own commercial game.
However, any changes to the engine code must be made public under the same
license. The engine and game code have been placed in separate directories
for your convenience.

Note that all of the art is available under separate licenses, for details see
the credits. Much of the art used is under non-commercial licenses.
