// ==UserScript==
// @name         quizlet speaker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  speaks sk words
// @author       You
// @match        https://quizlet.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    const FAKE_ID = 'custom_speak_button';

    waitForKeyElements (
        '<div class="StudyModesLayout h7k5ny0">',
        appendSpeakButton
    );

    function addSpeakerButtonToCard(cardHolder) {
        let attr = cardHolder.getAttribute("m");
        if (attr == null || attr != "1") {
            cardHolder.setAttribute("m", "1");
            let skText = cardHolder.childNodes[0].childNodes[0].textContent;
            let speakerButton = document.createElement('span');
            speakerButton.innerHTML = '<svg focusable="false" width="20" height="20" viewBox="0 0 24 24" class=" NMm5M"><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"></path></svg>'
            speakerButton.addEventListener('click', function(event) {
                event.stopPropagation();
                let utterance = new SpeechSynthesisUtterance(skText);
                utterance.lang = 'sk-SK';

                // let voices = speechSynthesis.getVoices();
                // let femaleVoice = voices.find(voice => voice.lang.startsWith('sk') && voice.name.toLowerCase().includes('female'));
                // if (!femaleVoice) {
                //     femaleVoice = voices.find(voice => voice.lang.startsWith('sk'));
                // }
                // if (femaleVoice) {
                //     utterance.voice = femaleVoice;
                // }

                speechSynthesis.speak(utterance);
            });
            cardHolder.childNodes[0].appendChild(speakerButton);
        }
    }

    async function appendSpeakButton() {
        // Learn mode
        let cardHolders = document.querySelectorAll('[class="c10andea"]');
        if (cardHolders.length) {
            cardHolders.forEach(addSpeakerButtonToCard);
        }
        // Flashcards mode
        cardHolders = document.querySelectorAll('[class="t1fidm2"]');
        if (cardHolders.length) {
            cardHolders.forEach(addSpeakerButtonToCard);
        }
        // Match mode
        cardHolders = document.querySelectorAll('[class="t1s3w3lt"]');
        if (cardHolders.length) {
            cardHolders.forEach(addSpeakerButtonToCard);
        }
    }
})();