const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let maze = [];
let rep = [];
let energy = [];
let minPath = 0;
let costA = 1;
let costB = 10;
let costC = 100;
let costD = 1000;

function solvep(p) {
  return (p[2][0] === "A" && 
          p[2][1] === "A" && 
          p[4][0] === "B" && 
          p[4][1] === "B" &&
          p[6][0] === "C" && 
          p[6][1] === "C" &&
          p[8][0] === "D" && 
          p[8][1] === "D");
}

function deepCopy(p) {
  let c = [...p];
  c[2] = [...p[2]];
  c[4] = [...p[4]];
  c[6] = [...p[6]];
  c[8] = [...p[8]];
  return c;
}

function caveS(p) {
  return "" + p[0] + "," + p[1] + ",(" + p[2][0] + "," + p[2][1] + ")," + p[3] + ",(" + p[4][0] + "," + p[4][1] + ")," + p[5] + ",(" + p[6][0] + "," + p[6][1] + ")," + p[7] + ",(" + p[8][0] + "," + p[8][1] + ")," + p[9] + "," + p[10]; 
}

function errorEst(p) {
  let e = 0;
  for(let i=0;i<11;i++) {
    if(i!==2&&i!==4&&i!==6&&i!==8) {
      switch(p[i]) {
        case 'A':
          e += (Math.abs(2-i)+1)*costA;
          break;
        case 'B':
          e += (Math.abs(4-i)+1)*costB;
          break;
        case 'C':
          e += (Math.abs(6-i)+1)*costC;
          break;
        case 'D':
          e += (Math.abs(8-i)+1)*costD;
          break;
      }
    } else {
      for(let j=0;j<2;j++) {
        switch(p[i][j]) {
          case 'A':
            if(i!==2) {
              e += (Math.abs(2-i)+4+j)*costA;
            }
            break;
          case 'B':
            if(i!==4) {
              e += (Math.abs(4-i)+4+j)*costB;
            }
            break;
          case 'C':
            if(i!==6) {
              e += (Math.abs(6-i)+4+j)*costC;
            }
            break;
          case 'D':
            if(i!==8) {
              e += (Math.abs(8-i)+4+j)*costD;
            }
            break;
        }
      }
    }
  }
  return e;
}

function track(p,c) {
  let est = c;
  // A* it up with a best case estimate
  est += errorEst(p);
  if(energy[est] === undefined) {
    energy[est] = [];
  }
  energy[est].push([p,c]);
//  console.log(`At path length cost ${c} estimate ${est} cave ${caveS(p)}`);
}

function expand(p, c) {
  let copy = deepCopy(p);

  // pos 0
  if(p[1]==='.') {
    switch(p[0]) {
      case 'A':
        if(p[2][0]==='.') {
          if(p[2][1]==='.') {
            copy[0] = '.';
            copy[2][1] = 'A';
            track(copy,c+4*costA);
          } else if(p[2][1]==='A') {
            copy[0] = '.';
            copy[2][0] = 'A';
            track(copy,c+3*costA);
          }
        }
        break;
      case 'B':
        if(p[3]==='.' && p[4][0]==='.') {
          if(p[4][1]==='.') {
            copy[0] = '.';
            copy[4][1] = 'B';
            track(copy,c+6*costB);
          } else if(p[4][1]==='B') {
            copy[0] = '.';
            copy[4][0] = 'B';
            track(copy,c+5*costB);
          }
        }
        break;
      case 'C':
        if(p[3]==='.' && p[5]==='.' && p[6][0]==='.') {
          if(p[6][1]==='.') {
            copy[0] = '.';
            copy[6][1] = 'C';
            track(copy,c+8*costC);
          } else if(p[6][1]==='C') {
            copy[0] = '.';
            copy[6][0] = 'C';
            track(copy,c+7*costC);
          }
        }
        break;
      case 'D':
        if(p[3]==='.' && p[5]==='.' && p[7]==='.' && p[8][0]==='.') {
          if(p[8][1]==='.') {
            copy[0] = '.';
            copy[8][1] = 'D';
            track(copy,c+10*costD);
          } else if(p[8][1]==='D') {
            copy[0] = '.';
            copy[8][0] = 'D';
            track(copy,c+9*costD);
          }
        }
        break;
    }
  }

  // pos 1
  copy = deepCopy(p);
  switch(p[1]) {
    case 'A':
      if(p[2][0]==='.') {
        if(p[2][1]==='.') {
          copy[1] = '.';
          copy[2][1] = 'A';
          track(copy,c+3*costA);
        } else if(p[2][1]==='A') {
          copy[1] = '.';
          copy[2][0] = 'A';
          track(copy,c+2*costA);
        }
      }
      break;
    case 'B':
      if(p[3]==='.' && p[4][0]==='.') {
        if(p[4][1]==='.') {
          copy[1] = '.';
          copy[4][1] = 'B';
          track(copy,c+5*costB);
        } else if(p[4][1]==='B') {
          copy[1] = '.';
          copy[4][0] = 'B';
          track(copy,c+4*costB);
        }
      }
      break;
    case 'C':
      if(p[3]==='.' && p[5]==='.' && p[6][0]==='.') {
        if(p[6][1]==='.') {
          copy[1] = '.';
          copy[6][1] = 'C';
          track(copy,c+7*costC);
        } else if(p[6][1]==='C') {
          copy[1] = '.';
          copy[6][0] = 'C';
          track(copy,c+6*costC);
        }
      }
      break;
    case 'D':
      if(p[3]==='.' && p[5]==='.' && p[7]==='.' && p[8][0]==='.') {
        if(p[8][1]==='.') {
          copy[1] = '.';
          copy[8][1] = 'D';
          track(copy,c+9*costD);
        } else if(p[8][1]==='D') {
          copy[1] = '.';
          copy[8][0] = 'D';
          track(copy,c+8*costD);
        }
      }
      break;
  }

  // pos 3
  copy = deepCopy(p);
  switch(p[3]) {
    case 'A':
      if(p[2][0]==='.') {
        if(p[2][1]==='.') {
          copy[3] = '.';
          copy[2][1] = 'A';
          track(copy,c+3*costA);
        } else if(p[2][1]==='A') {
          copy[3] = '.';
          copy[2][0] = 'A';
          track(copy,c+2*costA);
        }
      }
      break;
    case 'B':
      if(p[4][0]==='.') {
        if(p[4][1]==='.') {
          copy[3] = '.';
          copy[4][1] = 'B';
          track(copy,c+3*costB);
        } else if(p[4][1]==='B') {
          copy[3] = '.';
          copy[4][0] = 'B';
          track(copy,c+2*costB);
        }
      }
      break;
    case 'C':
      if(p[5]==='.' && p[6][0]==='.') {
        if(p[6][1]==='.') {
          copy[3] = '.';
          copy[6][1] = 'C';
          track(copy,c+5*costC);
        } else if(p[6][1]==='C') {
          copy[3] = '.';
          copy[6][0] = 'C';
          track(copy,c+4*costC);
        }
      }
      break;
    case 'D':
      if(p[5]==='.' && p[7]==='.' && p[8][0]==='.') {
        if(p[8][1]==='.') {
          copy[3] = '.';
          copy[8][1] = 'D';
          track(copy,c+7*costD);
        } else if(p[8][1]==='D') {
          copy[3] = '.';
          copy[8][0] = 'D';
          track(copy,c+6*costD);
        }
      }
      break;
  }

  // pos 5
  copy = deepCopy(p);
  switch(p[5]) {
    case 'A':
      if(p[3]==='.' && p[2][0]==='.') {
        if(p[2][1]==='.') {
          copy[5] = '.';
          copy[2][1] = 'A';
          track(copy,c+5*costA);
        } else if(p[2][1]==='A') {
          copy[5] = '.';
          copy[2][0] = 'A';
          track(copy,c+4*costA);
        }
      }
      break;
    case 'B':
      if(p[4][0]==='.') {
        if(p[4][1]==='.') {
          copy[5] = '.';
          copy[4][1] = 'B';
          track(copy,c+3*costB);
        } else if(p[4][1]==='B') {
          copy[5] = '.';
          copy[4][0] = 'B';
          track(copy,c+2*costB);
        }
      }
      break;
    case 'C':
      if(p[6][0]==='.') {
        if(p[6][1]==='.') {
          copy[5] = '.';
          copy[6][1] = 'C';
          track(copy,c+3*costC);
        } else if(p[6][1]==='C') {
          copy[5] = '.';
          copy[6][0] = 'C';
          track(copy,c+2*costC);
        }
      }
      break;
    case 'D':
      if(p[7]==='.' && p[8][0]==='.') {
        if(p[8][1]==='.') {
          copy[5] = '.';
          copy[8][1] = 'D';
          track(copy,c+5*costD);
        } else if(p[8][1]==='D') {
          copy[5] = '.';
          copy[8][0] = 'D';
          track(copy,c+4*costD);
        }
      }
      break;
  }
  

  // pos 7
  copy = deepCopy(p);
  switch(p[7]) {
    case 'A':
      if(p[3]==='.' && p[5]==='.' && p[2][0]==='.') {
        if(p[2][1]==='.') {
          copy[7] = '.';
          copy[2][1] = 'A';
          track(copy,c+7*costA);
        } else if(p[2][1]==='A') {
          copy[7] = '.';
          copy[2][0] = 'A';
          track(copy,c+6*costA);
        }
      }
      break;
    case 'B':
      if(p[5]==='.' && p[4][0]==='.') {
        if(p[4][1]==='.') {
          copy[7] = '.';
          copy[4][1] = 'B';
          track(copy,c+5*costB);
        } else if(p[4][1]==='B') {
          copy[7] = '.';
          copy[4][0] = 'B';
          track(copy,c+4*costB);
        }
      }
      break;
    case 'C':
      if(p[6][0]==='.') {
        if(p[6][1]==='.') {
          copy[7] = '.';
          copy[6][1] = 'C';
          track(copy,c+3*costC);
        } else if(p[6][1]==='C') {
          copy[7] = '.';
          copy[6][0] = 'C';
          track(copy,c+2*costC);
        }
      }
      break;
    case 'D':
      if(p[8][0]==='.') {
        if(p[8][1]==='.') {
          copy[7] = '.';
          copy[8][1] = 'D';
          track(copy,c+3*costD);
        } else if(p[8][1]==='D') {
          copy[7] = '.';
          copy[8][0] = 'D';
          track(copy,c+2*costD);
        }
      }
      break;
  }

  // pos 9
  copy = deepCopy(p);
  switch(p[9]) {
    case 'A':
      if(p[3]==='.' && p[5]==='.' && p[7]==='.' && p[2][0]==='.') {
        if(p[2][1]==='.') {
          copy[9] = '.';
          copy[2][1] = 'A';
          track(copy,c+9*costA);
        } else if(p[2][1]==='A') {
          copy[9] = '.';
          copy[2][0] = 'A';
          track(copy,c+8*costA);
        }
      }
      break;
    case 'B':
      if(p[5]==='.' && p[7]==='.' && p[4][0]==='.') {
        if(p[4][1]==='.') {
          copy[9] = '.';
          copy[4][1] = 'B';
          track(copy,c+7*costB);
        } else if(p[4][1]==='B') {
          copy[9] = '.';
          copy[4][0] = 'B';
          track(copy,c+6*costB);
        }
      }
      break;
    case 'C':
      if(p[7]==='.' && p[6][0]==='.') {
        if(p[6][1]==='.') {
          copy[9] = '.';
          copy[6][1] = 'C';
          track(copy,c+5*costC);
        } else if(p[6][1]==='C') {
          copy[9] = '.';
          copy[6][0] = 'C';
          track(copy,c+4*costC);
        }
      }
      break;
    case 'D':
      if(p[8][0]==='.') {
        if(p[8][1]==='.') {
          copy[9] = '.';
          copy[8][1] = 'D';
          track(copy,c+3*costD);
        } else if(p[8][1]==='D') {
          copy[9] = '.';
          copy[8][0] = 'D';
          track(copy,c+2*costD);
        }
      }
      break;
  }


  // pos 10
  copy = deepCopy(p);
  if(p[9]==='.') {
    switch(p[9]) {
      case 'A':
        if(p[3]==='.' && p[5]==='.' && p[7]==='.' && p[2][0]==='.') {
          if(p[2][1]==='.') {
            copy[10] = '.';
            copy[2][1] = 'A';
            track(copy,c+10*costA);
          } else if(p[2][1]==='A') {
            copy[10] = '.';
            copy[2][0] = 'A';
            track(copy,c+9*costA);
          }
        }
        break;
      case 'B':
        if(p[5]==='.' && p[7]==='.' && p[4][0]==='.') {
          if(p[4][1]==='.') {
            copy[10] = '.';
            copy[4][1] = 'B';
            track(copy,c+8*costB);
          } else if(p[4][1]==='B') {
            copy[10] = '.';
            copy[4][0] = 'B';
            track(copy,c+7*costB);
          }
        }
        break;
      case 'C':
        if(p[7]==='.' && p[6][0]==='.') {
          if(p[6][1]==='.') {
            copy[10] = '.';
            copy[6][1] = 'C';
            track(copy,c+6*costC);
          } else if(p[6][1]==='C') {
            copy[10] = '.';
            copy[6][0] = 'C';
            track(copy,c+5*costC);
          }
        }
        break;
      case 'D':
        if(p[8][0]==='.') {
          if(p[8][1]==='.') {
            copy[10] = '.';
            copy[8][1] = 'D';
            track(copy,c+4*costD);
          } else if(p[8][1]==='D') {
            copy[10] = '.';
            copy[8][0] = 'D';
            track(copy,c+3*costD);
          }
        }
        break;
    }
  }

  // pos 2,0
  copy = deepCopy(p);
  switch(p[2][0]) {
    case 'A':
      if(p[2][1]!=='A') {
        // go left
        if(p[1]==='.') {
          if(p[0]==='.') {
            copy[0]='A';
            copy[2][0]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          copy[1]='A';
          copy[2][0]='.';
          track(copy,c+2*costA);
          copy=deepCopy(p);
        }
        // go right
        if(p[3]==='.') {
          if(p[5]==='.') {
            if(p[7]==='.') {
              if(p[9]==='.') {
                if(p[10]==='.') {
                  copy[10]='A';
                  copy[2][0]='.';
                  track(copy,c+9*costA);
                  copy=deepCopy(p);
                }
                copy[9]='A';
                copy[2][0]='.';
                track(copy,c+8*costA);
                copy=deepCopy(p);
              }
              copy[7]='A';
              copy[2][0]='.';
              track(copy,c+6*costA);
              copy=deepCopy(p);
            }
            copy[5]='A';
            copy[2][0]='.';
            track(copy,c+4*costA);
            copy=deepCopy(p);
          }
          copy[3]='A';
          copy[2][0]='.';
          track(copy,c+2*costA);
          copy=deepCopy(p);
        }
      }
      break;
    case 'B':
      // go left
      if(p[1]==='.') {
        if(p[0]==='.') {
          copy[0]='B';
          copy[2][0]='.';
          track(copy,c+3*costB);
          copy=deepCopy(p);
        }
        copy[1]='B';
        copy[2][0]='.';
        track(copy,c+2*costB);
        copy=deepCopy(p);
      }
      // go right
      if(p[3]==='.') {
        if(p[4][0]==='.') {
          if(p[4][1]==='.') {
            copy[4][1]='B';
            copy[2][0]='.';
            track(copy,c+5*costB);
            copy=deepCopy(p);
          } else if(p[4][1]==='B') {
            copy[4][0]='B';
            copy[2][0]='.';
            track(copy,c+4*costB);
            copy=deepCopy(p);
          }
        }
        if(p[5]==='.') {
          if(p[7]==='.') {
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='B';
                copy[2][0]='.';
                track(copy,c+9*costB);
                copy=deepCopy(p);
              }
              copy[9]='B';
              copy[2][0]='.';
              track(copy,c+8*costB);
              copy=deepCopy(p);
            }
            copy[7]='B';
            copy[2][0]='.';
            track(copy,c+6*costB);
            copy=deepCopy(p);
          }
          copy[5]='B';
          copy[2][0]='.';
          track(copy,c+4*costB);
          copy=deepCopy(p);
        }
        copy[3]='B';
        copy[2][0]='.';
        track(copy,c+2*costB);
        copy=deepCopy(p);
      }
      break;
    case 'C':
      // go left
      if(p[1]==='.') {
        if(p[0]==='.') {
          copy[0]='C';
          copy[2][0]='.';
          track(copy,c+3*costC);
          copy=deepCopy(p);
        }
        copy[1]='C';
        copy[2][0]='.';
        track(copy,c+2*costC);
        copy=deepCopy(p);
      }
      // go right
      if(p[3]==='.') {
        if(p[5]==='.') {
          if(p[6][0]==='.') {
            if(p[6][1]==='.') {
              copy[6][1]='C';
              copy[2][0]='.';
              track(copy,c+7*costC);
              copy=deepCopy(p);
            } else if(p[6][1]==='C') {
              copy[6][0]='C';
              copy[2][0]='.';
              track(copy,c+6*costC);
              copy=deepCopy(p);
            }
          }
          if(p[7]==='.') {
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='C';
                copy[2][0]='.';
                track(copy,c+9*costC);
                copy=deepCopy(p);
              }
              copy[9]='C';
              copy[2][0]='.';
              track(copy,c+8*costC);
              copy=deepCopy(p);
            }
            copy[7]='C';
            copy[2][0]='.';
            track(copy,c+6*costC);
            copy=deepCopy(p);
          }
          copy[5]='C';
          copy[2][0]='.';
          track(copy,c+4*costC);
          copy=deepCopy(p);
        }
        copy[3]='C';
        copy[2][0]='.';
        track(copy,c+2*costC);
        copy=deepCopy(p);
      }
      break;
    case 'D':
      // go left
      if(p[1]==='.') {
        if(p[0]==='.') {
          copy[0]='D';
          copy[2][0]='.';
          track(copy,c+3*costD);
          copy=deepCopy(p);
        }
        copy[1]='D';
        copy[2][0]='.';
        track(copy,c+2*costD);
        copy=deepCopy(p);
      }
      // go right
      if(p[3]==='.') {
        if(p[5]==='.') {
          if(p[7]==='.') {
            if(p[8][0]==='.') {
              if(p[8][1]==='.') {
                copy[8][1]='D';
                copy[2][0]='.';
                track(copy,c+9*costD);
                copy=deepCopy(p);
              } else if(p[8][1]==='D') {
                copy[8][0]='D';
                copy[2][0]='.';
                track(copy,c+8*costD);
                copy=deepCopy(p);
              }
            }
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='D';
                copy[2][0]='.';
                track(copy,c+9*costD);
                copy=deepCopy(p);
              }
              copy[9]='D';
              copy[2][0]='.';
              track(copy,c+8*costD);
              copy=deepCopy(p);
            }
            copy[7]='D';
            copy[2][0]='.';
            track(copy,c+6*costD);
            copy=deepCopy(p);
          }
          copy[5]='D';
          copy[2][0]='.';
          track(copy,c+4*costD);
          copy=deepCopy(p);
        }
        copy[3]='D';
        copy[2][0]='.';
        track(copy,c+2*costD);
        copy=deepCopy(p);
      }
      break;
    case '.':
      switch(p[2][1]) {
        case 'B':
          // go left
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='B';
              copy[2][1]='.';
              track(copy,c+4*costB);
              copy=deepCopy(p);
            }
            copy[1]='B';
            copy[2][1]='.';
            track(copy,c+3*costB);
            copy=deepCopy(p);
          }
          // go right
          if(p[3]==='.') {
            if(p[4][0]==='.') {
              if(p[4][1]==='.') {
                copy[4][1]='B';
                copy[2][1]='.';
                track(copy,c+6*costB);
                copy=deepCopy(p);
              } else if(p[4][1]==='B') {
                copy[4][0]='B';
                copy[2][1]='.';
                track(copy,c+5*costB);
                copy=deepCopy(p);
              }
            }
            if(p[5]==='.') {
              if(p[7]==='.') {
                if(p[9]==='.') {
                  if(p[10]==='.') {
                    copy[10]='B';
                    copy[2][1]='.';
                    track(copy,c+10*costB);
                    copy=deepCopy(p);
                  }
                  copy[9]='B';
                  copy[2][1]='.';
                  track(copy,c+9*costB);
                  copy=deepCopy(p);
                }
                copy[7]='B';
                copy[2][1]='.';
                track(copy,c+7*costB);
                copy=deepCopy(p);
              }
              copy[5]='B';
              copy[2][1]='.';
              track(copy,c+5*costB);
              copy=deepCopy(p);
            }
            copy[3]='B';
            copy[2][1]='.';
            track(copy,c+3*costB);
            copy=deepCopy(p);
          }
          break;
        case 'C':
          // go left
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='C';
              copy[2][1]='.';
              track(copy,c+4*costC);
              copy=deepCopy(p);
            }
            copy[1]='C';
            copy[2][1]='.';
            track(copy,c+3*costC);
            copy=deepCopy(p);
          }
          // go right
          if(p[3]==='.') {
            if(p[5]==='.') {
              if(p[6][0]==='.') {
                if(p[6][1]==='.') {
                  copy[6][1]='C';
                  copy[2][1]='.';
                  track(copy,c+8*costC);
                  copy=deepCopy(p);
                } else if(p[6][1]==='C') {
                  copy[6][0]='C';
                  copy[2][1]='.';
                  track(copy,c+7*costC);
                  copy=deepCopy(p);
                }
              }
              if(p[7]==='.') {
                if(p[9]==='.') {
                  if(p[10]==='.') {
                    copy[10]='C';
                    copy[2][1]='.';
                    track(copy,c+10*costC);
                    copy=deepCopy(p);
                  }
                  copy[9]='C';
                  copy[2][1]='.';
                  track(copy,c+9*costC);
                  copy=deepCopy(p);
                }
                copy[7]='C';
                copy[2][1]='.';
                track(copy,c+7*costC);
                copy=deepCopy(p);
              }
              copy[5]='C';
              copy[2][1]='.';
              track(copy,c+5*costC);
              copy=deepCopy(p);
            }
            copy[3]='C';
            copy[2][1]='.';
            track(copy,c+3*costC);
            copy=deepCopy(p);
          }
          break;
        case 'D':
          // go left
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='D';
              copy[2][1]='.';
              track(copy,c+4*costD);
              copy=deepCopy(p);
            }
            copy[1]='D';
            copy[2][1]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          // go right
          if(p[3]==='.') {
            if(p[5]==='.') {
              if(p[7]==='.') {
                if(p[8][0]==='.') {
                  if(p[8][1]==='.') {
                    copy[8][1]='D';
                    copy[2][1]='.';
                    track(copy,c+10*costD);
                    copy=deepCopy(p);
                  } else if(p[8][1]==='D') {
                    copy[8][0]='D';
                    copy[2][1]='.';
                    track(copy,c+9*costD);
                    copy=deepCopy(p);
                  }
                }
                if(p[9]==='.') {
                  if(p[10]==='.') {
                    copy[10]='D';
                    copy[2][1]='.';
                    track(copy,c+10*costD);
                    copy=deepCopy(p);
                  }
                  copy[9]='D';
                  copy[2][1]='.';
                  track(copy,c+9*costD);
                  copy=deepCopy(p);
                }
                copy[7]='D';
                copy[2][1]='.';
                track(copy,c+7*costD);
                copy=deepCopy(p);
              }
              copy[5]='D';
              copy[2][1]='.';
              track(copy,c+5*costD);
              copy=deepCopy(p);
            }
            copy[3]='D';
            copy[2][1]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          break;
      }
      break;
  }


  // pos 4,0
  copy = deepCopy(p);
  switch(p[4][0]) {
    case 'A':
      // go left
      if(p[3]==='.') {
        if(p[2][0]==='.') {
          if(p[2][1]==='.') {
            copy[2][1]='A';
            copy[4][0]='.';
            track(copy,c+5*costA);
            copy=deepCopy(p);
          } else if(p[2][1]==='A') {
            copy[2][0]='A';
            copy[4][0]='.';
            track(copy,c+4*costA);
            copy=deepCopy(p);
          }
        }
        if(p[1]==='.') {
          if(p[0]==='.') {
            copy[0]='A';
            copy[4][0]='.';
            track(copy,c+5*costA);
            copy=deepCopy(p);
          }
          copy[1]='A';
          copy[4][0]='.';
          track(copy,c+4*costA);
          copy=deepCopy(p);
        }
        copy[3]='A';
        copy[4][0]='.';
        track(copy,c+2*costA);
        copy=deepCopy(p);
      }
      // go right
      if(p[5]==='.') {
        if(p[7]==='.') {
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='A';
              copy[4][0]='.';
              track(copy,c+7*costA);
              copy=deepCopy(p);
            }
            copy[9]='A';
            copy[4][0]='.';
            track(copy,c+6*costA);
            copy=deepCopy(p);
          }
          copy[7]='A';
          copy[4][0]='.';
          track(copy,c+4*costA);
          copy=deepCopy(p);
        }
        copy[5]='A';
        copy[4][0]='.';
        track(copy,c+2*costA);
        copy=deepCopy(p);
      }
      break;
    case 'B':
      if(p[4][1]!== "B") {
        // go left
        if(p[3]==='.') {
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='B';
              copy[4][0]='.';
              track(copy,c+5*costB);
              copy=deepCopy(p);
            }
            copy[1]='B';
            copy[4][0]='.';
            track(copy,c+4*costB);
            copy=deepCopy(p);
          }
          copy[3]='B';
          copy[4][0]='.';
          track(copy,c+2*costB);
          copy=deepCopy(p);
        }
        // go right
        if(p[5]==='.') {
          if(p[7]==='.') {
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='B';
                copy[4][0]='.';
                track(copy,c+7*costB);
                copy=deepCopy(p);
              }
              copy[9]='B';
              copy[4][0]='.';
              track(copy,c+6*costB);
              copy=deepCopy(p);
            }
            copy[7]='B';
            copy[4][0]='.';
            track(copy,c+4*costB);
            copy=deepCopy(p);
          }
          copy[5]='B';
          copy[4][0]='.';
          track(copy,c+2*costB);
          copy=deepCopy(p);
        }
      }
      break;
    case 'C':
      // go left
      if(p[3]==='.') {
        if(p[1]==='.') {
          if(p[0]==='.') {
            copy[0]='C';
            copy[4][0]='.';
            track(copy,c+5*costC);
            copy=deepCopy(p);
          }
          copy[1]='C';
          copy[4][0]='.';
          track(copy,c+4*costC);
          copy=deepCopy(p);
        }
        copy[3]='C';
        copy[4][0]='.';
        track(copy,c+2*costC);
        copy=deepCopy(p);
      }
      // go right
      if(p[5]==='.') {
        if(p[6][0]==='.') {
          if(p[6][1]==='.') {
            copy[6][1]='C';
            copy[4][0]='.';
            track(copy,c+5*costC);
            copy=deepCopy(p);
          } else if(p[6][1]==='C') {
            copy[6][0]='C';
            copy[4][0]='.';
            track(copy,c+4*costC);
            copy=deepCopy(p);
          }
        }
        if(p[7]==='.') {
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='C';
              copy[4][0]='.';
              track(copy,c+7*costC);
              copy=deepCopy(p);
            }
            copy[9]='C';
            copy[4][0]='.';
            track(copy,c+6*costC);
            copy=deepCopy(p);
          }
          copy[7]='C';
          copy[4][0]='.';
          track(copy,c+4*costC);
          copy=deepCopy(p);
        }
        copy[5]='C';
        copy[4][0]='.';
        track(copy,c+2*costC);
        copy=deepCopy(p);
      }
      break;
    case 'D':
      // go left
      if(p[3]==='.') {
        if(p[1]==='.') {
          if(p[0]==='.') {
            copy[0]='D';
            copy[4][0]='.';
            track(copy,c+5*costD);
            copy=deepCopy(p);
          }
          copy[1]='D';
          copy[4][0]='.';
          track(copy,c+4*costD);
          copy=deepCopy(p);
        }
        copy[3]='D';
        copy[4][0]='.';
        track(copy,c+2*costD);
        copy=deepCopy(p);
      }
      // go right
      if(p[5]==='.') {
        if(p[7]==='.') {
          if(p[8][0]==='.') {
            if(p[8][1]==='.') {
              copy[8][1]='D';
              copy[4][0]='.';
              track(copy,c+7*costD);
              copy=deepCopy(p);
            } else if(p[8][1]==='D') {
              copy[8][0]='D';
              copy[4][0]='.';
              track(copy,c+6*costD);
              copy=deepCopy(p);
            }
          }
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='D';
              copy[4][0]='.';
              track(copy,c+7*costD);
              copy=deepCopy(p);
            }
            copy[9]='D';
            copy[4][0]='.';
            track(copy,c+6*costD);
            copy=deepCopy(p);
          }
          copy[7]='D';
          copy[4][0]='.';
          track(copy,c+4*costD);
          copy=deepCopy(p);
        }
        copy[5]='D';
        copy[4][0]='.';
        track(copy,c+2*costD);
        copy=deepCopy(p);
      }
      break;
    case '.':
      switch(p[4][1]) {
        case 'A':
          // go left
          if(p[3]==='.') {
            if(p[2][0]==='.') {
              if(p[2][1]==='.') {
                copy[2][1]='A';
                copy[4][1]='.';
                track(copy,c+6*costA);
                copy=deepCopy(p);
              } else if(p[2][1]==='A') {
                copy[2][0]='A';
                copy[4][1]='.';
                track(copy,c+5*costA);
                copy=deepCopy(p);
              }
            }
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='A';
                copy[4][1]='.';
                track(copy,c+6*costA);
                copy=deepCopy(p);
              }
              copy[1]='A';
              copy[4][1]='.';
              track(copy,c+5*costA);
              copy=deepCopy(p);
            }
            copy[3]='A';
            copy[4][1]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          // go right
          if(p[5]==='.') {
            if(p[7]==='.') {
              if(p[9]==='.') {
                if(p[10]==='.') {
                  copy[10]='A';
                  copy[4][1]='.';
                  track(copy,c+8*costA);
                  copy=deepCopy(p);
                }
                copy[9]='A';
                copy[4][1]='.';
                track(copy,c+7*costA);
                copy=deepCopy(p);
              }
              copy[7]='A';
              copy[4][1]='.';
              track(copy,c+5*costA);
              copy=deepCopy(p);
            }
            copy[5]='A';
            copy[4][1]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          break;
        case 'C':
          // go left
          if(p[3]==='.') {
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='C';
                copy[4][1]='.';
                track(copy,c+6*costC);
                copy=deepCopy(p);
              }
              copy[1]='C';
              copy[4][1]='.';
              track(copy,c+5*costC);
              copy=deepCopy(p);
            }
            copy[3]='C';
            copy[4][1]='.';
            track(copy,c+3*costC);
            copy=deepCopy(p);
          }
          // go right
          if(p[5]==='.') {
            if(p[6][0]==='.') {
              if(p[6][1]==='.') {
                copy[6][1]='C';
                copy[4][1]='.';
                track(copy,c+6*costC);
                copy=deepCopy(p);
              } else if(p[6][1]==='C') {
                copy[6][0]='C';
                copy[4][1]='.';
                track(copy,c+5*costC);
                copy=deepCopy(p);
              }
            }
            if(p[7]==='.') {
              if(p[9]==='.') {
                if(p[10]==='.') {
                  copy[10]='C';
                  copy[4][1]='.';
                  track(copy,c+8*costC);
                  copy=deepCopy(p);
                }
                copy[9]='C';
                copy[4][1]='.';
                track(copy,c+7*costC);
                copy=deepCopy(p);
              }
              copy[7]='C';
              copy[4][1]='.';
              track(copy,c+5*costC);
              copy=deepCopy(p);
            }
            copy[5]='C';
            copy[4][1]='.';
            track(copy,c+3*costC);
            copy=deepCopy(p);
          }
          break;
        case 'D':
          // go left
          if(p[3]==='.') {
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='D';
                copy[4][1]='.';
                track(copy,c+6*costD);
                copy=deepCopy(p);
              }
              copy[1]='D';
              copy[4][1]='.';
              track(copy,c+5*costD);
              copy=deepCopy(p);
            }
            copy[3]='D';
            copy[4][1]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          // go right
          if(p[5]==='.') {
            if(p[7]==='.') {
              if(p[8][0]==='.') {
                if(p[8][1]==='.') {
                  copy[8][1]='D';
                  copy[4][1]='.';
                  track(copy,c+8*costD);
                  copy=deepCopy(p);
                } else if(p[8][1]==='D') {
                  copy[8][0]='D';
                  copy[4][1]='.';
                  track(copy,c+7*costD);
                  copy=deepCopy(p);
                }
              }
              if(p[9]==='.') {
                if(p[10]==='.') {
                  copy[10]='D';
                  copy[4][1]='.';
                  track(copy,c+8*costD);
                  copy=deepCopy(p);
                }
                copy[9]='D';
                copy[4][1]='.';
                track(copy,c+7*costD);
                copy=deepCopy(p);
              }
              copy[7]='D';
              copy[4][1]='.';
              track(copy,c+5*costD);
              copy=deepCopy(p);
            }
            copy[5]='D';
            copy[4][1]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          break;
      }
      break;
  }


  // pos 6,0
  copy = deepCopy(p);
  switch(p[6][0]) {
    case 'A':
      // go left
      if(p[5]==='.') {
        if(p[3]==='.') {
          if(p[2][0]==='.') {
            if(p[2][1]==='.') {
              copy[2][1]='A';
              copy[6][0]='.';
              track(copy,c+7*costA);
              copy=deepCopy(p);
            } else if(p[2][1]==='A') {
              copy[2][0]='A';
              copy[6][0]='.';
              track(copy,c+6*costA);
              copy=deepCopy(p);
            }
          }
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='A';
              copy[6][0]='.';
              track(copy,c+7*costA);
              copy=deepCopy(p);
            }
            copy[1]='A';
            copy[6][0]='.';
            track(copy,c+6*costA);
            copy=deepCopy(p);
          }
          copy[3]='A';
          copy[6][0]='.';
          track(copy,c+4*costA);
          copy=deepCopy(p);
        }
        copy[5]='A';
        copy[6][0]='.';
        track(copy,c+2*costA);
        copy=deepCopy(p);
      }
      // go right
      if(p[7]==='.') {
        if(p[9]==='.') {
          if(p[10]==='.') {
            copy[10]='A';
            copy[6][0]='.';
            track(copy,c+5*costA);
            copy=deepCopy(p);
          }
          copy[9]='A';
          copy[6][0]='.';
          track(copy,c+4*costA);
          copy=deepCopy(p);
        }
        copy[7]='A';
        copy[6][0]='.';
        track(copy,c+2*costA);
        copy=deepCopy(p);
      }
      break;
    case 'B':
        // go left
      if(p[5]==='.') {
        if(p[4][0]==='.') {
          if(p[4][1]==='.') {
            copy[4][1]='B';
            copy[6][0]='.';
            track(copy,c+5*costB);
            copy=deepCopy(p);
          } else if(p[4][1]==='B') {
            copy[4][0]='B';
            copy[6][0]='.';
            track(copy,c+4*costB);
            copy=deepCopy(p);
          }
        }
        if(p[3]==='.') {
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='B';
              copy[6][0]='.';
              track(copy,c+7*costB);
              copy=deepCopy(p);
            }
            copy[1]='B';
            copy[6][0]='.';
            track(copy,c+6*costB);
            copy=deepCopy(p);
          }
          copy[3]='B';
          copy[6][0]='.';
          track(copy,c+4*costB);
          copy=deepCopy(p);
        }
        copy[5]='B';
        copy[6][0]='.';
        track(copy,c+2*costB);
        copy=deepCopy(p);
      }
      // go right
      if(p[7]==='.') {
        if(p[9]==='.') {
          if(p[10]==='.') {
            copy[10]='B';
            copy[6][0]='.';
            track(copy,c+5*costB);
            copy=deepCopy(p);
          }
          copy[9]='B';
          copy[6][0]='.';
          track(copy,c+4*costB);
          copy=deepCopy(p);
        }
        copy[7]='B';
        copy[6][0]='.';
        track(copy,c+2*costB);
        copy=deepCopy(p);
      }
      break;
    case 'C':
      // go left
      if(p[6][1]!=='C') {
        if(p[5]==='.') {
          if(p[3]==='.') {
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='C';
                copy[6][0]='.';
                track(copy,c+7*costC);
                copy=deepCopy(p);
              }
              copy[1]='C';
              copy[6][0]='.';
              track(copy,c+6*costC);
              copy=deepCopy(p);
            }
            copy[3]='C';
            copy[6][0]='.';
            track(copy,c+4*costC);
            copy=deepCopy(p);
          }
          copy[5]='C';
          copy[6][0]='.';
          track(copy,c+2*costC);
          copy=deepCopy(p);
        }
        // go right
        if(p[7]==='.') {
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='C';
              copy[6][0]='.';
              track(copy,c+5*costC);
              copy=deepCopy(p);
            }
            copy[9]='C';
            copy[6][0]='.';
            track(copy,c+4*costC);
            copy=deepCopy(p);
          }
          copy[7]='C';
          copy[6][0]='.';
          track(copy,c+2*costC);
          copy=deepCopy(p);
        }
      }
      break;
    case 'D':
      // go left
      if(p[5]==='.') {
        if(p[3]==='.') {
          if(p[1]==='.') {
            if(p[0]==='.') {
              copy[0]='D';
              copy[6][0]='.';
              track(copy,c+7*costD);
              copy=deepCopy(p);
            }
            copy[1]='D';
            copy[6][0]='.';
            track(copy,c+6*costD);
            copy=deepCopy(p);
          }
          copy[3]='D';
          copy[6][0]='.';
          track(copy,c+4*costD);
          copy=deepCopy(p);
        }
        copy[5]='D';
        copy[6][0]='.';
        track(copy,c+2*costD);
        copy=deepCopy(p);
      }
      // go right
      if(p[7]==='.') {
        if(p[8][0]==='.') {
          if(p[8][1]==='.') {
            copy[8][1]='D';
            copy[6][0]='.';
            track(copy,c+5*costD);
            copy=deepCopy(p);
          } else if(p[8][1]==='D') {
            copy[8][0]='D';
            copy[6][0]='.';
            track(copy,c+4*costD);
            copy=deepCopy(p);
          }
        }
        if(p[9]==='.') {
          if(p[10]==='.') {
            copy[10]='D';
            copy[6][0]='.';
            track(copy,c+5*costD);
            copy=deepCopy(p);
          }
          copy[9]='D';
          copy[6][0]='.';
          track(copy,c+4*costD);
          copy=deepCopy(p);
        }
        copy[7]='D';
        copy[6][0]='.';
        track(copy,c+2*costD);
        copy=deepCopy(p);
      }
      break;
    case '.':
      switch(p[6][1]) {
        case 'A':
          // go left
          if(p[5]==='.') {
            if(p[3]==='.') {
              if(p[2][0]==='.') {
                if(p[2][1]==='.') {
                  copy[2][1]='A';
                  copy[6][1]='.';
                  track(copy,c+8*costA);
                  copy=deepCopy(p);
                } else if(p[2][1]==='A') {
                  copy[2][0]='A';
                  copy[6][1]='.';
                  track(copy,c+7*costA);
                  copy=deepCopy(p);
                }
              }
              if(p[1]==='.') {
                if(p[0]==='.') {
                  copy[0]='A';
                  copy[6][1]='.';
                  track(copy,c+8*costA);
                  copy=deepCopy(p);
                }
                copy[1]='A';
                copy[6][1]='.';
                track(copy,c+7*costA);
                copy=deepCopy(p);
              }
              copy[3]='A';
              copy[6][1]='.';
              track(copy,c+5*costA);
              copy=deepCopy(p);
            }
            copy[5]='A';
            copy[6][1]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          // go right
          if(p[7]==='.') {
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='A';
                copy[6][1]='.';
                track(copy,c+6*costA);
                copy=deepCopy(p);
              }
              copy[9]='A';
              copy[6][1]='.';
              track(copy,c+5*costA);
              copy=deepCopy(p);
            }
            copy[7]='A';
            copy[6][1]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          break;
        case 'B':
          // go left
          if(p[5]==='.') {
            if(p[4][0]==='.') {
              if(p[4][1]==='.') {
                copy[4][1]='B';
                copy[6][1]='.';
                track(copy,c+6*costB);
                copy=deepCopy(p);
              } else if(p[4][1]==='B') {
                copy[4][0]='B';
                copy[6][1]='.';
                track(copy,c+5*costB);
                copy=deepCopy(p);
              }
            }
            if(p[3]==='.') {
              if(p[1]==='.') {
                if(p[0]==='.') {
                  copy[0]='B';
                  copy[6][1]='.';
                  track(copy,c+8*costB);
                  copy=deepCopy(p);
                }
                copy[1]='B';
                copy[6][1]='.';
                track(copy,c+7*costB);
                copy=deepCopy(p);
              }
              copy[3]='B';
              copy[6][1]='.';
              track(copy,c+5*costB);
              copy=deepCopy(p);
            }
            copy[5]='B';
            copy[6][1]='.';
            track(copy,c+3*costB);
            copy=deepCopy(p);
          }
          // go right
          if(p[7]==='.') {
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='B';
                copy[6][1]='.';
                track(copy,c+6*costB);
                copy=deepCopy(p);
              }
              copy[9]='B';
              copy[6][1]='.';
              track(copy,c+5*costB);
              copy=deepCopy(p);
            }
            copy[7]='B';
            copy[6][1]='.';
            track(copy,c+3*costB);
            copy=deepCopy(p);
          }
          break;
        case 'D':
          // go left
          if(p[5]==='.') {
            if(p[3]==='.') {
              if(p[1]==='.') {
                if(p[0]==='.') {
                  copy[0]='D';
                  copy[6][1]='.';
                  track(copy,c+8*costD);
                  copy=deepCopy(p);
                }
                copy[1]='D';
                copy[6][1]='.';
                track(copy,c+7*costD);
                copy=deepCopy(p);
              }
              copy[3]='D';
              copy[6][1]='.';
              track(copy,c+5*costD);
              copy=deepCopy(p);
            }
            copy[5]='D';
            copy[6][1]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          // go right
          if(p[7]==='.') {
            if(p[8][0]==='.') {
              if(p[8][1]==='.') {
                copy[8][1]='D';
                copy[6][1]='.';
                track(copy,c+6*costD);
                copy=deepCopy(p);
              } else if(p[8][1]==='D') {
                copy[8][0]='D';
                copy[6][1]='.';
                track(copy,c+5*costD);
                copy=deepCopy(p);
              }
            }
            if(p[9]==='.') {
              if(p[10]==='.') {
                copy[10]='D';
                copy[6][1]='.';
                track(copy,c+6*costD);
                copy=deepCopy(p);
              }
              copy[9]='D';
              copy[6][1]='.';
              track(copy,c+5*costD);
              copy=deepCopy(p);
            }
            copy[7]='D';
            copy[6][1]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          break;
      }
      break;
  }

  // pos 8,0
  copy = deepCopy(p);
  switch(p[8][0]) {
    case 'A':
      // go left
      if(p[7]==='.') {
        if(p[5]==='.') {
          if(p[3]==='.') {
            if(p[2][0]==='.') {
              if(p[2][1]==='.') {
                copy[2][1]='A';
                copy[8][0]='.';
                track(copy,c+9*costA);
                copy=deepCopy(p);
              } else if(p[2][1]==='A') {
                copy[2][0]='A';
                copy[8][0]='.';
                track(copy,c+8*costA);
                copy=deepCopy(p);
              }
            }
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='A';
                copy[8][0]='.';
                track(copy,c+9*costA);
                copy=deepCopy(p);
              }
              copy[1]='A';
              copy[8][0]='.';
              track(copy,c+8*costA);
              copy=deepCopy(p);
            }
            copy[3]='A';
            copy[8][0]='.';
            track(copy,c+6*costA);
            copy=deepCopy(p);
          }
          copy[5]='A';
          copy[8][0]='.';
          track(copy,c+4*costA);
          copy=deepCopy(p);
        }
        copy[7]='A';
        copy[8][0]='.';
        track(copy,c+2*costA);
        copy=deepCopy(p);
      }
      // go right
      if(p[9]==='.') {
        if(p[10]==='.') {
          copy[10]='A';
          copy[8][0]='.';
          track(copy,c+3*costA);
          copy=deepCopy(p);
        }
        copy[9]='A';
        copy[8][0]='.';
        track(copy,c+2*costA);
        copy=deepCopy(p);
      }
      break;
    case 'B':
      // go left
      if(p[7]==='.') {
        if(p[5]==='.') {
          if(p[4][0]==='.') {
            if(p[4][1]==='.') {
              copy[4][1]='B';
              copy[8][0]='.';
              track(copy,c+7*costB);
              copy=deepCopy(p);
            } else if(p[4][1]==='B') {
              copy[4][0]='B';
              copy[8][0]='.';
              track(copy,c+6*costB);
              copy=deepCopy(p);
            }
          }
          if(p[3]==='.') {
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='B';
                copy[8][0]='.';
                track(copy,c+9*costB);
                copy=deepCopy(p);
              }
              copy[1]='B';
              copy[8][0]='.';
              track(copy,c+8*costB);
              copy=deepCopy(p);
            }
            copy[3]='B';
            copy[8][0]='.';
            track(copy,c+6*costB);
            copy=deepCopy(p);
          }
          copy[5]='B';
          copy[8][0]='.';
          track(copy,c+4*costB);
          copy=deepCopy(p);
        }
        copy[7]='B';
        copy[8][0]='.';
        track(copy,c+2*costB);
        copy=deepCopy(p);
      }
      // go right
      if(p[9]==='.') {
        if(p[10]==='.') {
          copy[10]='B';
          copy[8][0]='.';
          track(copy,c+3*costB);
          copy=deepCopy(p);
        }
        copy[9]='B';
        copy[8][0]='.';
        track(copy,c+2*costB);
        copy=deepCopy(p);
      }
      break;
    case 'C':
      // go left
      if(p[7]==='.') {
        if(p[6][0]==='.') {
          if(p[6][1]==='.') {
            copy[6][1]='C';
            copy[8][0]='.';
            track(copy,c+5*costC);
            copy=deepCopy(p);
          } else if(p[6][1]==='C') {
            copy[6][0]='C';
            copy[8][0]='.';
            track(copy,c+4*costC);
            copy=deepCopy(p);
          }
        }
        if(p[5]==='.') {
          if(p[3]==='.') {
            if(p[1]==='.') {
              if(p[0]==='.') {
                copy[0]='C';
                copy[8][0]='.';
                track(copy,c+9*costC);
                copy=deepCopy(p);
              }
              copy[1]='C';
              copy[8][0]='.';
              track(copy,c+8*costC);
              copy=deepCopy(p);
            }
            copy[3]='C';
            copy[8][0]='.';
            track(copy,c+6*costC);
            copy=deepCopy(p);
          }
          copy[5]='C';
          copy[8][0]='.';
          track(copy,c+4*costC);
          copy=deepCopy(p);
        }
        copy[7]='C';
        copy[8][0]='.';
        track(copy,c+2*costC);
        copy=deepCopy(p);
      }
      // go right
      if(p[9]==='.') {
        if(p[10]==='.') {
          copy[10]='C';
          copy[8][0]='.';
          track(copy,c+3*costC);
          copy=deepCopy(p);
        }
        copy[9]='C';
        copy[8][0]='.';
        track(copy,c+2*costC);
        copy=deepCopy(p);
      }
      break;
    case 'D':
      if(p[8][1]!=='D') {
        // go left
        if(p[7]==='.') {
          if(p[5]==='.') {
            if(p[3]==='.') {
              if(p[1]==='.') {
                if(p[0]==='.') {
                  copy[0]='D';
                  copy[8][0]='.';
                  track(copy,c+9*costD);
                  copy=deepCopy(p);
                }
                copy[1]='D';
                copy[8][0]='.';
                track(copy,c+8*costD);
                copy=deepCopy(p);
              }
              copy[3]='D';
              copy[8][0]='.';
              track(copy,c+6*costD);
              copy=deepCopy(p);
            }
            copy[5]='D';
            copy[8][0]='.';
            track(copy,c+4*costD);
            copy=deepCopy(p);
          }
          copy[7]='D';
          copy[8][0]='.';
          track(copy,c+2*costD);
          copy=deepCopy(p);
        }
        // go right
        if(p[9]==='.') {
          if(p[10]==='.') {
            copy[10]='D';
            copy[8][0]='.';
            track(copy,c+3*costD);
            copy=deepCopy(p);
          }
          copy[9]='D';
          copy[8][0]='.';
          track(copy,c+2*costD);
          copy=deepCopy(p);
        }
      }
      break;
    case '.':
      switch(p[8][1]) {
        case 'A':
          // go left
          if(p[7]==='.') {
            if(p[5]==='.') {
              if(p[3]==='.') {
                if(p[2][0]==='.') {
                  if(p[2][1]==='.') {
                    copy[2][1]='A';
                    copy[8][1]='.';
                    track(copy,c+10*costA);
                    copy=deepCopy(p);
                  } else if(p[2][1]==='A') {
                    copy[2][0]='A';
                    copy[8][1]='.';
                    track(copy,c+9*costA);
                    copy=deepCopy(p);
                  }
                }
                if(p[1]==='.') {
                  if(p[0]==='.') {
                    copy[0]='A';
                    copy[8][1]='.';
                    track(copy,c+10*costA);
                    copy=deepCopy(p);
                  }
                  copy[1]='A';
                  copy[8][1]='.';
                  track(copy,c+9*costA);
                  copy=deepCopy(p);
                }
                copy[3]='A';
                copy[8][1]='.';
                track(copy,c+7*costA);
                copy=deepCopy(p);
              }
              copy[5]='A';
              copy[8][1]='.';
              track(copy,c+5*costA);
              copy=deepCopy(p);
            }
            copy[7]='A';
            copy[8][1]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          // go right
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='A';
              copy[8][1]='.';
              track(copy,c+4*costA);
              copy=deepCopy(p);
            }
            copy[9]='A';
            copy[8][1]='.';
            track(copy,c+3*costA);
            copy=deepCopy(p);
          }
          break;
        case 'B':
          // go left
          if(p[7]==='.') {
            if(p[5]==='.') {
              if(p[4][0]==='.') {
                if(p[4][1]==='.') {
                  copy[4][1]='B';
                  copy[8][1]='.';
                  track(copy,c+8*costB);
                  copy=deepCopy(p);
                } else if(p[4][1]==='B') {
                  copy[4][0]='B';
                  copy[8][1]='.';
                  track(copy,c+7*costB);
                  copy=deepCopy(p);
                }
              }
              if(p[3]==='.') {
                if(p[1]==='.') {
                  if(p[0]==='.') {
                    copy[0]='B';
                    copy[8][1]='.';
                    track(copy,c+10*costB);
                    copy=deepCopy(p);
                  }
                  copy[1]='B';
                  copy[8][1]='.';
                  track(copy,c+9*costB);
                  copy=deepCopy(p);
                }
                copy[3]='B';
                copy[8][1]='.';
                track(copy,c+7*costB);
                copy=deepCopy(p);
              }
              copy[5]='B';
              copy[8][1]='.';
              track(copy,c+5*costB);
              copy=deepCopy(p);
            }
            copy[7]='B';
            copy[8][1]='.';
            track(copy,c+3*costB);
            copy=deepCopy(p);
          }
          // go right
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='B';
              copy[8][1]='.';
              track(copy,c+4*costB);
              copy=deepCopy(p);
            }
            copy[9]='B';
            copy[8][1]='.';
            track(copy,c+3*costB);
            copy=deepCopy(p);
          }
          break;
        case 'C':
          // go left
          if(p[7]==='.') {
            if(p[6][0]==='.') {
              if(p[6][1]==='.') {
                copy[6][1]='C';
                copy[8][1]='.';
                track(copy,c+6*costC);
                copy=deepCopy(p);
              } else if(p[6][1]==='C') {
                copy[6][0]='C';
                copy[8][1]='.';
                track(copy,c+5*costC);
                copy=deepCopy(p);
              }
            }
            if(p[5]==='.') {
              if(p[3]==='.') {
                if(p[1]==='.') {
                  if(p[0]==='.') {
                    copy[0]='C';
                    copy[8][1]='.';
                    track(copy,c+10*costC);
                    copy=deepCopy(p);
                  }
                  copy[1]='C';
                  copy[8][1]='.';
                  track(copy,c+9*costC);
                  copy=deepCopy(p);
                }
                copy[3]='C';
                copy[8][1]='.';
                track(copy,c+7*costC);
                copy=deepCopy(p);
              }
              copy[5]='C';
              copy[8][1]='.';
              track(copy,c+5*costC);
              copy=deepCopy(p);
            }
            copy[7]='C';
            copy[8][1]='.';
            track(copy,c+3*costC);
            copy=deepCopy(p);
          }
          // go right
          if(p[9]==='.') {
            if(p[10]==='.') {
              copy[10]='C';
              copy[8][1]='.';
              track(copy,c+4*costC);
              copy=deepCopy(p);
            }
            copy[9]='C';
            copy[8][1]='.';
            track(copy,c+3*costC);
            copy=deepCopy(p);
          }
          break;
      }
      break;
  }
}


eachLine(filename, function(line) {
  maze.push(line);
}).then(function(err) {
  rep = new Array(11).fill('.');
  rep[2] = [maze[2][3],maze[3][3]];
  rep[4] = [maze[2][5],maze[3][5]];
  rep[6] = [maze[2][7],maze[3][7]];
  rep[8] = [maze[2][9],maze[3][9]];
  energy[0] = [];
  energy[0].push([rep,0]);
  console.log(maze);
  console.log(rep);
  console.log(caveS(rep));
  while(answer===0) {
    let found = false;
    for(let i=0;!found;i++) {
      if(energy[i] !== undefined && energy[i].length>0) {
        let e = energy[i].pop();
        let path = e[0];
        let cost = e[1];
        minPath = i;
        found = true;
        //console.log(`I found ${caveS(path)} with cost ${cost} at i ${i}`);
        if(solvep(path)) {
          answer=cost;
        } else {
          expand(path,cost);
        }
      }
    }
  }
  console.log(answer);
});
