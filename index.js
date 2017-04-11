//load modules
require('draftlog')(console)
const readline = require('readline');

//declare variables
var lines = [],
    amtOfLines = process.stdout.rows - 3,
    arr = [],
    cArr = [];

// I/O settings
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

//make the console lines
for (let i = 0; i <= (amtOfLines - 1); i++) {
  lines = [{
    data: '',
    line: console.draft()
  }, ...lines]
}

//Entering functionality
function enter(msg) {
  //declare variables
  var lineToPlace, buffer;

  //run the loop
  for (let i = 0; i < (amtOfLines - 1); i++) {
    //always put the new message on the first line
    if (i == 0) {
      lineToPlace = lines[i].data;
      lines[i].data = msg;
      lines[i].line(msg);
    }

    /*
      If there is nothing to save on the next line then make
      it the last one. Put the value that was in the previous
      line into this line and take the value in the current
      line and save it with next line, then exit out.
    */
    if (lines[(i+1)].data == '') {
      lines[(i+1)].data = lineToPlace;
      lines[(i+1)].line(lineToPlace);
      currentLine('');
      arr = [];
      break;
      /*
        otherwise we need to save the value that the next line
        and hold onto it for the next pass
      */
    }else {
      buffer = lines[(i+1)].data;
      lines[(i+1)].data = lineToPlace;
      lines[(i+1)].line(lineToPlace);
      lineToPlace = buffer;
    }
    lines[(amtOfLines - 1)].data = '';
  }
}

//keypress events
process.stdin.on('keypress', (str, key) => {

  if (key && key.ctrl && key.name == 'c') {
    run = false;
    process.stdin.pause();

  }else if (key.name == 'return') {
    enter(arr.join(''));

  }else if (key.name == 'backspace') {
    arr.pop();
    currentLine(arr.join('')+cArr);

  }else {
    arr = [...arr,str];
    currentLine(arr.join('')+cArr);
  }
})

//this is the decoritive seperator
console.log('----------------------');
//this is the console line where type is displayed
let currentLine = console.draft()

var run = true;
var cursorIO = true;
(function cursor() {
  if (cursorIO) {
    cArr.push('|');
    currentLine(arr.join('')+cArr);
    cursorIO = false;
  }else {
    cArr.pop('|');
    currentLine(arr.join('')+cArr);
    cursorIO = true;
  }
  if (run) {
    setTimeout(cursor, 750);
  }
})();
