function AI(turn, depth) {
    let virtualChess = chess.clone()
    let { from, to } = alphabeta(virtualChess, -Infinity, +Infinity, depth, turn)
    chess.move(from.x, from.y, to.x, to.y)
}

function alphabeta(chess, alpha, beta, depth, turn) {

    if (depth === 0) return { score: getScore(chess.grid) }

    let from = {}
    let to = {}

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let arr = chess.getReachedBlock(x, y)
            for (let i = 0; i < arr.length; i++) {
                let pos = arr[i]
                chess.move(x, y, pos.x, pos.y)
                let { score } = alphabeta(chess, alpha, beta, depth - 1, turn === 'b' ? 'w' : 'b')

                if (turn === 'b' && score > alpha) {
                    alpha = score
                    from = { x, y }
                    to = pos
                }
                if (turn === 'w' && score < beta) {
                    beta = score
                    from = { x, y }
                    to = pos
                }

                chess.undo()

                if (alpha >= beta) return { score: (turn === 'b' ? alpha : beta), from, to }
            }
        }
    }
    return { score: (turn === 'b' ? alpha : beta), from, to }
}