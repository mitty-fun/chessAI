function getScore(grid) {
    var score = 0
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (grid[x][y] == 'b_pawn') score += 10
            if (grid[x][y] == 'b_rook') score += 100
            if (grid[x][y] == 'b_knight') score += 50
            if (grid[x][y] == 'b_bishop') score += 80
            if (grid[x][y] == 'b_queen') score += 250
            if (grid[x][y] == 'b_king') score += 1000

            if (grid[x][y] == 'w_pawn') score -= 10
            if (grid[x][y] == 'w_rook') score -= 100
            if (grid[x][y] == 'w_knight') score -= 50
            if (grid[x][y] == 'w_bishop') score -= 80
            if (grid[x][y] == 'w_queen') score -= 250
            if (grid[x][y] == 'w_king') score -= 1000
        }
    }
    return score
}


