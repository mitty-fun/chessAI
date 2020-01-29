let node = 0
let leave = 0
let cut = 0
let uncut = 0

function AI(turn, depth) {
    count = 0
    let virtualChess = chess.clone()
    let obj = minmax(virtualChess, turn, depth)
    chess.move(obj.bestFrom.x, obj.bestFrom.y, obj.bestTo.x, obj.bestTo.y)
    
    console.log('node:', node)
    console.log('leave:', leave)
}


function minmax(chess, turn, depth) {

    

    if (depth === 0) {
        leave++
        return {bestScore: getScore(chess.grid)}
    } else {
        node++
    }

    let bestFrom = {}
    let bestTo = {}
    let bestScore = turn === 'b' ? -Infinity : +Infinity

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (chess.grid[x][y][0] == turn) {
                chess.getReachedBlock(x, y).forEach((pos) => {
                    chess.move(x, y, pos.x, pos.y)
                    let result = minmax(chess, turn === 'b' ? 'w' : 'b', depth - 1)
                    if (turn === 'b' && result.bestScore > bestScore) {
                        bestScore = result.bestScore
                        bestFrom = { x: x, y: y }
                        bestTo = pos
                        
                    }
                    if (turn === 'w' && result.bestScore < bestScore) {
                        bestScore = result.bestScore
                        bestFrom = { x: x, y: y }
                        bestTo = pos
                    }
                    chess.undo()
                })
            }
        }
    }
    return { bestScore: bestScore, bestFrom: bestFrom, bestTo: bestTo }
}