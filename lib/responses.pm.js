'use strict';

var messages = [
    'What do you want from me?!',
    'The penguins are in the toilets.',
    'Excuse me, do you mind if I stare at you for a minute? I want to remember your face for my dreams.',
    'I would very much like to see the slides of your liver operation but first I must go and hack my head into tiny pieces with my comb.',
    'If I gave you my phone number, would you keep it or throw it away?',
    'Your breath smells like peaches.',
    'OK, you can stand next to me as long as you don\'t talk about the temperature.',
    'The train has already gone, would you like to hire a bicycle?'
];

exports.random = function () {
    return messages[Math.floor(Math.random() * messages.length)];
};
