const chess = new Chess()

new Vue({
    el: '#game',
    data: {
        chess,
        grid: chess.grid,
        black: false,
        depth: 4,
        message: 'Player first. Press the button to exchange.',
        focusOn: {},
        board: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} },
        logs: [],
    },
    methods: {
        click(x, y) {
            x = Number(x)
            y = Number(y)

            if (this.focusOn.x === undefined) {
                this.chess.getReachedBlock(x, y).forEach(pos => {
                    this.board[pos.x][pos.y] = true
                })
                this.focusOn = { x, y }
            } else if (this.board[x][y]) {
                this.chess.move(this.focusOn.x, this.focusOn.y, x, y)
                this.runAI()
            } else {
                this.clear()
            }
        },

        color(x, y) {
            x = Number(x)
            y = Number(y)
            let odd = (x + y) % 2 === 0

            if (x == this.focusOn.x && y == this.focusOn.y) return 'blue'

            return this.board[x][y] ? 'red' : odd ? '#512a2a' : '#7c4c3e'
        },

        clear() {
            this.focusOn = {}
            this.board = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} }
        },

        runAI() {
            this.clear()
            this.message = 'thinking...'
            
            let startTime = Date.now()
            if (window.AI !== undefined) window.AI(this.chess.turn, this.depth)
            let costTime = Date.now() - startTime
            
            this.message = 'Cost: ' + (costTime / 1000) + 'sec'
            this.logs.push({ cost: costTime, depth: this.depth })
            if (this.chess.status !== 'playing') this.message = this.chess.status
        }
    }
})

