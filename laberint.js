let prompt = require("prompt-sync")({ sigint: true });
let term = require("terminal-kit").terminal;

// These are the different variables used during the game.

let playing = false;
let userEmoji = '🐭';
let tile = '🔲';
let wall = '🧱';
let goal = '🏆';
let warp = '🌀';
let cheese = '🧀';

let warpPosition;
let movements = 0;
let userMoveCounter = 0;
let warpArray = [];
let userPosition;
let activeMap = [];

let timer = '00:00';
let minuts;
let seconds;

// This function formats the timer to display the minutes and seconds played.

function clock() {
  if (seconds === 59) {
    seconds = 0;
    minuts++
  } else {
    seconds++
  }
  timer = `${minuts.toString().length == 2 ? minuts : '0' + minuts}:${seconds.toString().length == 2 ? seconds : '0' + seconds}`
};
let interval;

/**
 * @author Jason Steven Gamba Manzano
 * @since 19/11/2024
 * @version 1-0-0
 */

/**
 * - This is the array that contains all the maps in the form of a 2D array.
 */

let mazeArr = [
  [
    ["🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱"],
    ["🌀", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱"],
    ["🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱"],
    ["🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🌀"],
    ["🧱", "🐭", "🧱", "🧀", "🧱", "🧱", "🏆", "🧱"],
    ["🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱"]
  ],
  [
    ["🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱"],
    ["🧱", "🐭", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🌀", "🧱"],
    ["🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🌀", "🏆", "🧱"],
    ["🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🌀", "🧱"],
    ["🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧀", "🔲", "🧱"],
    ["🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱"],
    ["🌀", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱"],
    ["🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱", "🧱", "🧱"]
  ],
  [
    ["🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱",],
    ["🌀", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱",],
    ["🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🏆", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧀", "🔲", "🧱", "🔲", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🧀", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🐭", "🧱", "🧀", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🌀",],
    ["🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱", "🧱", "🧱",]
  ],
  [
    ["🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱",],
    ["🧱", "🔲", "🧀", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🔲", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🧱", "🔲", "🧀", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🌀",],
    ["🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🌀", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲",],
    ["🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🧀", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲",],
    ["🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🧀", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧀", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🌀", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🏆", "🧱", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲",],
    ["🌀", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🏆", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🧱", "🔲", "🌀",],
    ["🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🌀", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🌀", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱",],
    ["🧱", "🧱", "🧱", "🧱", "🔲", "🌀", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🧱", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🧱",],
    ["🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🧀", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧀",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲",],
    ["🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🧱", "🔲", "🧱", "🔲", "🧱",],
    ["🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🔲", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱", "🔲", "🧱", "🧀", "🧱", "🔲", "🧱", "🔲", "🔲", "🧱", "🧱", "🔲", "🔲", "🔲", "🧱",],
    ["🧱", "🐭", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱",],
    ["🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🌀", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱", "🧱",]
  ]
];

/**
 * - Displays the maze maps, formatted to fit the terminal.
 */

function showMazes() {
  term("\n\n");
  term("     Mapa 1                         Mapa 2                              Mapa 3")
  term("\n\n");
  term(mazeArr[0][0].toString().split(",").join(" "), "   ", mazeArr[1][0].toString().split(",").join(" "), "   ", mazeArr[2][0].toString().split(",").join(" "));
  term("\n");
  term(mazeArr[0][1].toString().split(",").join(" "), "   ", mazeArr[1][1].toString().split(",").join(" "), "   ", mazeArr[2][1].toString().split(",").join(" "));
  term("\n");
  term(mazeArr[0][2].toString().split(",").join(" "), "   ", mazeArr[1][2].toString().split(",").join(" "), "   ", mazeArr[2][2].toString().split(",").join(" "));
  term("\n");
  term(mazeArr[0][3].toString().split(",").join(" "), "   ", mazeArr[1][3].toString().split(",").join(" "), "   ", mazeArr[2][3].toString().split(",").join(" "));
  term("\n");
  term(mazeArr[0][4].toString().split(",").join(" "), "   ", mazeArr[1][4].toString().split(",").join(" "), "   ", mazeArr[2][4].toString().split(",").join(" "));
  term("\n");
  term(mazeArr[0][5].toString().split(",").join(" "), "   ", mazeArr[1][5].toString().split(",").join(" "), "   ", mazeArr[2][5].toString().split(",").join(" "));
  term("\n");
  term("                          ", mazeArr[1][6].toString().split(",").join(" "), "   ", mazeArr[2][6].toString().split(",").join(" "));
  term("\n");
  term("                          ", mazeArr[1][7].toString().split(",").join(" "), "   ", mazeArr[2][7].toString().split(",").join(" "));
  term("\n");
  term("                                                          ", mazeArr[2][8].toString().split(",").join(" "));
  term("\n");
  term("                                                          ", mazeArr[2][9].toString().split(",").join(" "));
  term("\n\n");
  term("                                    Mapa 4 Especial                               ")
  term("\n\n");
  mazeArr[3].forEach(el => {
    console.log(el.toString().split(",").join(" "))
  })
  term("\n")
  prompt("Pressiona enter per a continuar...")
  init()
}
/**
 * - This function displays a message in case the player wins the game.
 */

function win() {
  term.reset()
  term("\n")
  term.green("  ¡Felicitat! Has sortit del laberint! 🎉")
  term("\n\n")
  term("  Després d'una gran aventura, has aconseguit superar tots els obstacles i \n  resoldre els enigmes que el laberint tenia preparats per a tu.")
  term("\n\n  T'atreveixes a començar una nova aventura?")
  term("\n  Les portes del següent laberint estan obertes per a tu. 😎")
  term("\n\n")
  term("  ^GMaxim de moviments permesos:^ ", userMoveCounter)
  term("\n\n")
  term("  ^GTotal moviments:^ ", movements)
  term("\n\n")
  term("  ^GTemps total:^ ", timer)
  term("\n\n")
  clearInterval(interval)
  prompt("  Pressiona enter per a continuar...")
  terminate();
  init();
}

/**
 * - This function displays a message in case the player loses the game.
 */

function lose() {
  term.reset()
  term("\n")
  term.red("  Has perdut 😹   ...però no et rendeixis! ")
  term("\n\n")
  term("  T'has quedat atrapat en el laberint, però no passa res, cada derrota és una oportunitat \n  per aprendre i millorar! Ara és el moment perfecte per analitzar les teves decisions\n  i provar un altre enfocament.")
  term("\n\n")
  term("  Intenta-ho de nou: A la propera, potser siguis tu qui surti victoriós.\n  Amb una mica de paciència i estratègia, el laberint serà teu!")
  term("\n\n")
  term("  Repensa la teva ruta, ajusta la teva tàctica, i... torna a intentar-ho!")
  term("\n\n")
  term("  ^RMaxim de moviments permesos:^ ", userMoveCounter)
  term("\n\n")
  term("  ^RTotal moviments:^ ", movements)
  term("\n\n")
  term("  ^RTemps total:^ ", timer)
  term("\n\n")
  clearInterval(interval)
  prompt("  Pressiona enter per a continuar...")
  init();
}

/**
 * - This function displays the game board every time the user makes a move.
 */

function update() {
  term.clear();
  term("\n")
  term("  ^MMaxim de moviments permesos:^ ", userMoveCounter)
  term("\n\n")
  term("  ^MTotal moviments:^ ", movements)
  term("\n\n")
  term("  ^Mtemps total:^ ", timer)
  term("\n\n")
  term("  ^R¡¡¡ Per surtir press 'q' !!!^")
  term("\n\n")
  term.green("  Fes servir les tecles de direccio.")
  term("\n\n")
  term("             ⬆️")
  term("\n")
  term("          ⬅️     ➡️")
  term("\n")
  term("             ⬇️")
  term("\n\n")
  activeMap.forEach(row => {
    console.log(row.toString().split(",").join(" "))
  })
}


/**
 * - This ensure the game is over and the event loop is done.
 */

function terminate() {
  term.removeListener("key", "juego");
  playing = false;
}


/**
 * - This use the terminal-kit to capture the keyboard events.
 * - Validates and controls the movements of the game.
 */

function playGame() {
  playing = true;

  update();

  term.addListener('key', (key) => {
    if (!playing) return;
    if (key === "Q" || key === "q" || key === "CTRL_C") {
      terminate();
      init();
    } else {
      if (key === "UP") {
        if (userMoveCounter === 0) {
          terminate();
          lose();
        } else {
          if (activeMap[userPosition[0] - 1] === undefined) {
            update()
            term.red(" No es pot moure cap amunt.");
          } else if (activeMap[userPosition[0] - 1][userPosition[1]] === wall) {
            update()
            term.red(" No es pot moure cap amunt.");
          } else if (activeMap[userPosition[0] - 1][userPosition[1]] === goal) {
            terminate();
            win();
          } else if (activeMap[userPosition[0] - 1][userPosition[1]] === warp) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[0]--;
            let randomPos = Math.floor(Math.random() * warpArray.length);
            userPosition = warpArray[randomPos].slice()
            warpPosition = warpArray[randomPos].slice()
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            update()
          } else if (activeMap[userPosition[0] - 1][userPosition[1]] === cheese) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[0]--;
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            movements -= 5
            userMoveCounter += 5
            update()
          } else {
            if (JSON.stringify(userPosition) === JSON.stringify(warpPosition)) {
              activeMap[userPosition[0]][userPosition[1]] = warp;
              userPosition[0]--;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            } else {
              activeMap[userPosition[0]][userPosition[1]] = tile;
              userPosition[0]--;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            }
          }
        }
      } else if (key === "DOWN") {
        if (userMoveCounter === 0) {
          terminate();
          lose();
        } else {
          if (activeMap[userPosition[0] + 1] === undefined) {
            update()
            term.red(" No es pot moure per baix.");
          } else if (activeMap[userPosition[0] + 1][userPosition[1]] === wall) {
            update()
            term.red(" No es pot moure per baix.");
          } else if (activeMap[userPosition[0] + 1][userPosition[1]] === goal) {
            terminate();
            win();
          } else if (activeMap[userPosition[0] + 1][userPosition[1]] === warp) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[0]++;
            let randomPos = Math.floor(Math.random() * warpArray.length);
            userPosition = warpArray[randomPos].slice()
            warpPosition = warpArray[randomPos].slice()
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            update()
          } else if (activeMap[userPosition[0] + 1][userPosition[1]] === cheese) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[0]++;
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            movements -= 5
            userMoveCounter += 5
            update()
          } else {
            if (JSON.stringify(userPosition) === JSON.stringify(warpPosition)) {
              activeMap[userPosition[0]][userPosition[1]] = warp;
              userPosition[0]++;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            } else {
              activeMap[userPosition[0]][userPosition[1]] = tile;
              userPosition[0]++;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            }
          }
        }
      } else if (key === "RIGHT") {
        if (userMoveCounter === 0) {
          terminate();
          lose();
        } else {
          if (activeMap[userPosition[0]][userPosition[1] + 1] === undefined) {
            update()
            term.red(" No es pot moure per la dreta.");
          } else if (activeMap[userPosition[0]][userPosition[1] + 1] === wall) {
            update()
            term.red(" No es pot moure per la dreta.");
          } else if (activeMap[userPosition[0]][userPosition[1] + 1] === goal) {
            terminate();
            win();
          } else if (activeMap[userPosition[0]][userPosition[1] + 1] === warp) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[1]++;
            let randomPos = Math.floor(Math.random() * warpArray.length);
            userPosition = warpArray[randomPos].slice()
            warpPosition = warpArray[randomPos].slice()
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            update()
          } else if (activeMap[userPosition[0]][userPosition[1] + 1] === cheese) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[0]++;
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            movements -= 5
            userMoveCounter += 5
            update()
          } else {
            if (JSON.stringify(userPosition) === JSON.stringify(warpPosition)) {
              activeMap[userPosition[0]][userPosition[1]] = warp;
              userPosition[1]++;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            } else {
              activeMap[userPosition[0]][userPosition[1]] = tile;
              userPosition[1]++;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            }
          }
        }
      } else if (key === "LEFT") {
        if (userMoveCounter === 0) {
          terminate();
          lose();
        } else {
          if (activeMap[userPosition[0]][userPosition[1] - 1] === undefined) {
            update()
            term.red(" No es pot moure per l'esquerra.");
          } else if (activeMap[userPosition[0]][userPosition[1] - 1] === wall) {
            update()
            term.red(" No es pot moure per l'esquerra.");
          } else if (activeMap[userPosition[0]][userPosition[1] - 1] === goal) {
            terminate();
            win();
          } else if (activeMap[userPosition[0]][userPosition[1] - 1] === warp) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[1]--;
            let randomPos = Math.floor(Math.random() * warpArray.length);
            userPosition = warpArray[randomPos].slice()
            warpPosition = warpArray[randomPos].slice()
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            update()
          } else if (activeMap[userPosition[0]][userPosition[1] - 1] === cheese) {
            activeMap[userPosition[0]][userPosition[1]] = tile;
            userPosition[1]--;
            activeMap[userPosition[0]][userPosition[1]] = userEmoji;
            movements -= 5
            userMoveCounter += 5
            update()
          } else {
            if (JSON.stringify(userPosition) === JSON.stringify(warpPosition)) {
              activeMap[userPosition[0]][userPosition[1]] = warp;
              userPosition[1]--;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            } else {
              activeMap[userPosition[0]][userPosition[1]] = tile;
              userPosition[1]--;
              activeMap[userPosition[0]][userPosition[1]] = userEmoji;
              movements++
              userMoveCounter--
              update()
            }
          }
        }
      }
    }
  }, { id: "juego" }
  );
}

/**
 * - This function is responsible for preparing the entire game based on the player's choice.
 */

function setUpGame() {
  mazeArr.forEach((map, i) => {
    term("\n\n")
    term(`Mapa: ${i + 1} amb alt: ${map.length - 2} y ample ${map[0].length - 2}`)
  })

  term("\n")
  let userSel = 0;

  do {
    term("\n")
    term("¡¡¡ Si vols sortir solamnent presiona enter. !!!")
    term("\n\n")
    let num = prompt("Escull un del mapes per jugar: ");
    if (num === " " || num === "") {
      init()
      return
    }
    userSel = Number.parseInt(num);
  } while (isNaN(userSel) || userSel <= 0 || userSel >= 5)

  movements = 0;
  movements = 0;userMoveCounter
  minuts = 0;
  seconds = 0;
  timer = '00:00';
  interval = setInterval(clock, 1000);

  activeMap = JSON.parse(JSON.stringify(mazeArr[userSel - 1]));

  activeMap.forEach((row, indx) => row.forEach((value, i) => {
    if (value === tile) {
      userMoveCounter++
    } else if (value === warp) {
      warpArray.push([indx, i])
    }
  }));

  let height = activeMap.length;
  let width = activeMap[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (activeMap[i][j] === '🐭') {
        userPosition = [];
        userPosition.push(i, j);
      }
    }
  }
  playGame();
}

/**
 * - Displays a small manual to help the player enjoy the game
 */

function showHelp() {
  term('\n\n')
  term.bgMagenta("                        El joc Laberint està creat per que puguis disfrutar                     \n                                         del teu temp lliure.                                   ")
  term("\n  ^B1. Veure mapes                               🌐                                              :")
  term("\n   Vols consultar el mapa del laberint per a veure el camí? Aquí pots veure una                        \n   representació visual del laberint per ajudar-te a planificar la teva ruta.\n")
  term("\n  ^B2. Jugar                                     📝                                              :");
  term("\n   Estàs preparat per afrontar el repte? Fes clic aquí per començar a jugar! Conduiràs                 \n   el teu personatge a través del laberint amb les teves habilitats d'orientació \n  i resolució de problemes.\n")
  term("\n  ^B3. Sortir                                    🔄                                              :");
  term("\n   Si has decidit que no vols jugar més o necessites una pausa, fes clic aquí per sortir del joc.      \n   Podràs continuar més tard des de la teva última sessió.\n")
  term("\n  ^B4. Ajuda                                     ♻️                                              :");
  term("\n   Necessites consells o instruccions sobre com jugar? Aquí trobaràs guies i suggeriments              \n   que et seran útils per avançar pel laberint i sortir-ne victoriós!\n")
  term("\n")
  prompt("  Pressiona enter per a continuar...")
  init()
}

/**
 * Show and error.
 */

function showError() {
  term("\n\n\n\n\n");
  term("Error a l'aplicació");
  term("\n\n\n");
  term(
    "Ups! Sembla que alguna cosa ha fallat. No s'ha pogut processar la teva sol·licitud."
  );
  term("\n\n\n");
  term(
    "Si us plau, torna-ho a intentar més tard o posa't en contacte amb el nostre suport tècnic per obtenir ajuda."
  );
  term("\n\n\n");
  term("Gràcies per la teva paciència!");
  term("\n\n\n");
  term("\n\n\n");
  term("\n")
  prompt("Pressiona enter per a continuar...")
  init()
}

/**
 * Show the menu to the user.
 */

function menu() {
  term.clear();
  term("\n");
  term.green(
    "\n🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱\n"
  );
  term.red(`                                        
            @@@@@@@  @@@@@@@@ @@@  @@@ @@@  @@@ @@@ @@@  @@@  @@@@@@@  @@@  @@@ @@@@@@@             
            @@!  @@@ @@!      @@!@!@@@ @@!  @@@ @@! @@!@!@@@ !@@       @@!  @@@   @@!               
            @!@!@!@  @!!!:!   @!@@!!@! @!@  !@! !!@ @!@@!!@! !@! @!@!@ @!@  !@!   @!!               
            !!:  !!! !!:      !!:  !!!  !: .:!  !!: !!:  !!! :!!   !!: !!:  !!!   !!:               
            :: : ::  : :: ::: ::    :.    ::    :   ::    ::  :: :: :   :.:: ::   ::                
                                                                                              
       @@@@@@  @@@           @@@       @@@@@@  @@@@@@@  @@@@@@@@ @@@@@@@  @@@ @@@  @@@ @@@@@@@
      @@!  @@@ @@!           @@!      @@!  @@@ @@!  @@@ @@!      @@!  @@@ @@! @@!@!@@@   @@!  
      @!@!@!@! @!!           @!!      @!@!@!@! @!@!@!@  @!!!:!   @!@!!@!  !!@ @!@@!!@!   @!!  
      !!:  !!! !!:           !!:      !!:  !!! !!:  !!! !!:      !!: :!!  !!: !!:  !!!   !!:  
      ::   ::: : ::.: :      : ::.: : ::   :.: :: :.::. :.::.::: ::   : : :.: ::    ::   :: 
 \n`);
  term.green(
    "\n🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱\n"
  );
}

/**
 * - Uses a "switch" to choose the function to execute based on the user's selection.
 * @param {*} value  It is the number that returns the selected item in the menu.
 */

function menuSelection(value) {
  switch (value) {
    case 0:
      showMazes();
      break;
    case 1:
      setUpGame();
      break;
    case 2:
      term.clear();
      process.exit();
    case 3:
      showHelp();
      break;
    default:
      showError();
      break;
  }
}
/**
 * This is the main function, it is the first function that is executed 
 * and the entire operation of the game depends on it.
 */
function init() {
  let menuItems = [
    "      Veure mapes 👀     ",
    "      Jugar ▶️      ",
    "      Sortir 🛫       ",
    "      Ajuda ℹ️      "
  ];

  let options = {
    separator: " | ",
    style: term.bold.inverse,
    selectedStyle: term.dim.blue.bgBrightRed
  };

  menu();

  term.singleLineMenu(menuItems, options, (error, response) => {
    if (error) {
      term("ERROR: ", error);
    } else {
      menuSelection(response.selectedIndex);
    }
  });
}

init();