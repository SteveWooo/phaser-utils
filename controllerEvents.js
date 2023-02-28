export default class ControllerEvent {
    constructor(scene) {
        this.scene = scene
        this.events = {
            move: {
                cb: (way) => {}
            },
            stop: {
                cb: (lastWay) => {}
            }
        }

        // 方向栈
        this.wayStack = []
        this.on = this.on.bind(this)
        this._init()
    }

    _init() {
        this.scene.input.keyboard.on('keydown', (e) => {
            if (this.wayStack.includes(e.keyCode)) {
                return 
            }
            this.wayStack.push(e.keyCode)
            this.events.move.cb(e.keyCode)
        })

        this.scene.input.keyboard.on('keyup', (e) => {
            if (!this.wayStack.includes(e.keyCode)) {
                // 偶尔会发生这个无法复现的问题
                return
            }

            const wayIndex = this.wayStack.indexOf(e.keyCode)
            this.wayStack.splice(wayIndex, 1)
            if (this.wayStack.length === 0) {
                this.events.stop.cb(e.keyCode) // return last keycode
                return
            }

            this.events.move.cb(
                this.wayStack[this.wayStack.length - 1]
            )
        })
    }

    on(eventName, cb) {
        if (!(eventName in this.events)) {
            throw 'enknown event'
        }
        this.events[eventName].cb = typeof cb === 'function' ? cb : (way) => {};
    }
}