class Chess {
    
    constructor() {
        this.status = 'playing' // 'playing', 'white win', 'black win'
        this.turn = 'w' // 'w', 'b'
        this.logs = []
        this.grid = {
            0: { 0: 'b_rook', 1: 'b_knight', 2: 'b_bishop', 3: 'b_king', 4: 'b_queen', 5: 'b_bishop', 6: 'b_knight', 7: 'b_rook' },
            1: { 0: 'b_pawn', 1: 'b_pawn', 2: 'b_pawn', 3: 'b_pawn', 4: 'b_pawn', 5: 'b_pawn', 6: 'b_pawn', 7: 'b_pawn' },
            2: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' },
            3: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' },
            4: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' },
            5: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' },
            6: { 0: 'w_pawn', 1: 'w_pawn', 2: 'w_pawn', 3: 'w_pawn', 4: 'w_pawn', 5: 'w_pawn', 6: 'w_pawn', 7: 'w_pawn' },
            7: { 0: 'w_rook', 1: 'w_knight', 2: 'w_bishop', 3: 'w_king', 4: 'w_queen', 5: 'w_bishop', 6: 'w_knight', 7: 'w_rook' },
        }
    }

    clone() {
        let virtualChess = new Chess()
        virtualChess.turn = this.turn
        virtualChess.logs = JSON.parse(JSON.stringify(this.logs))
        virtualChess.grid = JSON.parse(JSON.stringify(this.grid))
        return virtualChess
    }

    move(fromX, fromY, toX, toY) {
        if (this.status !== 'playing') return
        if (this.grid[fromX][fromY][0] !== this.turn) return

        if (this.grid[toX][toY] == 'w_king') this.status = 'black win'
        if (this.grid[toX][toY] == 'b_king') this.status = 'white win'

        if ((toX === 0 || toX === 7) && this.grid[fromX][fromY].split('_')[1] === 'pawn') {
            this.grid[fromX][fromY] = this.turn + '_queen'
        }

        this._move(fromX, fromY, toX, toY)

        this.turn = this.turn === 'w' ? 'b' : 'w'
    }

    getReachedBlock(fromX, fromY) {
        let from = this.grid[fromX][fromY]
        if (from === '' || from[0] !== this.turn || this.status !== 'playing') return []

        switch (from.split('_')[1]) {
            case 'rook': return this._rook(fromX, fromY)
            case 'bishop': return this._bishop(fromX, fromY)
            case 'queen': return this._queen(fromX, fromY)
            case 'king': return this._king(fromX, fromY)
            case 'knight': return this._knight(fromX, fromY)
            case 'pawn': return this._pawn(fromX, fromY)
        }
    }

    undo() {
        if (this.logs.length == 0) return
        let lastMod = this.logs.pop()
        while (lastMod.length > 0) {
            let mod = lastMod.pop()
            if (mod[0] === 'remove') this.grid[mod[1]][mod[2]] = mod[3]
            if (mod[0] === 'create') this.grid[mod[1]][mod[2]] = ''
        }
        this.turn = this.turn === 'w' ? 'b' : 'w'
        this.status = 'playing'
    }

    _move(fromX, fromY, toX, toY) {
        this.logs.push([
            ['remove', fromX, fromY, this.grid[fromX][fromY]],
            ['remove', toX, toY, this.grid[toX][toY]],
            ['create', toX, toY, this.grid[fromX][fromY]],
        ])
        this.grid[toX][toY] = this.grid[fromX][fromY]
        this.grid[fromX][fromY] = ''
    }

    _rook(fromX, fromY) {
        return this._line(fromX, fromY, 0, 1)
            .concat(this._line(fromX, fromY, 1, 0))
            .concat(this._line(fromX, fromY, 0, -1))
            .concat(this._line(fromX, fromY, -1, 0))
    }

    _bishop(fromX, fromY) {
        return this._line(fromX, fromY, 1, 1)
            .concat(this._line(fromX, fromY, -1, 1))
            .concat(this._line(fromX, fromY, 1, -1))
            .concat(this._line(fromX, fromY, -1, -1))
    }

    _queen(fromX, fromY) {
        return this._bishop(fromX, fromY).concat(this._rook(fromX, fromY))
    }

    _king(x, y) {
        let steps = [            
            {x: x-1,y: y-1}, {x: x+0,y: y-1}, {x: x+1,y: y-1},
            {x: x-1,y: y+0},                  {x: x+1,y: y+0},
            {x: x-1,y: y+1}, {x: x+0,y: y+1}, {x: x+1,y: y+1},
        ]
        return steps.filter(this._isInRange).filter(this._isCover.bind(this))
    }

    _knight(fromX, fromY) {
        let steps = [
            { x: fromX + 2, y: fromY + 1 },
            { x: fromX + 2, y: fromY - 1 },
            { x: fromX - 2, y: fromY + 1 },
            { x: fromX - 2, y: fromY - 1 },
            { x: fromX + 1, y: fromY + 2 },
            { x: fromX + 1, y: fromY - 2 },
            { x: fromX - 1, y: fromY + 2 },
            { x: fromX - 1, y: fromY - 2 },
        ]
        return steps.filter(this._isInRange).filter(this._isCover.bind(this))
    }

    _pawn(fromX, fromY) {
        if (fromX === 0 || fromX === 7) return []
        let steps = []

        if (this.turn == 'b') {
            if (this.grid[fromX + 1][fromY] === '') steps.push({ x: fromX + 1, y: fromY })
            if (fromY !== 7 && this.grid[fromX + 1][fromY + 1][0] === 'w') steps.push({ x: fromX + 1, y: fromY + 1 })
            if (fromY !== 0 && this.grid[fromX + 1][fromY - 1][0] === 'w') steps.push({ x: fromX + 1, y: fromY - 1 })
            if (fromX === 1 && this.grid[fromX + 2][fromY] === '') steps.push({ x: fromX + 2, y: fromY })
        } else {
            if (this.grid[fromX - 1][fromY] === '') steps.push({ x: fromX - 1, y: fromY })
            if (fromY !== 7 && this.grid[fromX - 1][fromY + 1][0] === 'b') steps.push({ x: fromX - 1, y: fromY + 1 })
            if (fromY !== 0 && this.grid[fromX - 1][fromY - 1][0] === 'b') steps.push({ x: fromX - 1, y: fromY - 1 })
            if (fromX === 6 && this.grid[fromX - 2][fromY] === '') steps.push({ x: fromX - 2, y: fromY })
        }
        return steps
    }

    _isCover(pos) {
        return this.grid[pos.x][pos.y] === '' || this.grid[pos.x][pos.y][0] !== this.turn
    }

    _isInRange(pos) {
        return pos.x >= 0 && pos.x <= 7 && pos.y >= 0 && pos.y <= 7
    }

    _line(fromX, fromY, offsetX, offsetY) {
        const steps = []
        for (let i = 1; i < 8; i++) {
            const x = fromX + offsetX * i
            const y = fromY + offsetY * i
            if (!this._isInRange({ x, y })) break
            if (this.grid[x][y] === '' || this.grid[x][y][0] !== this.turn) {
                steps.push({ x, y })
            }
            if (this.grid[x][y] !== '') break
        }
        return steps
    }
}