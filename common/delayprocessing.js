/* Отложенная обработка */

import { isFunction } from './utils'

class DelayError extends Error {}

class DelayManager {
    constructor (props) {
        this.props = {...props}
        this.procs = {}
    }

    add(action) {
        this.procs[action.name] = { ...action }
    }

    run(name, cb) {
        let proc = this.procs[name]
        let that = this
        if (proc) {
            const { timeout, params } = proc
            if (timeout) {
                clearTimeout(timeout)
            }
            this.add(
                {
                    ...proc,
                    timeout: setTimeout(
                        () => {
                            that.procs[proc.name].timeout = 0
                            let prms = params
                            if (isFunction(params)) {
                                prms = params(proc)
                            }
                            let r = proc.action(proc, prms)
                            if (Promise.resolve(r) == r) {
                                r.then(() => {
                                    if (cb) {
                                        return cb(proc)
                                    }
                                })
                            }
                            return r
                        }, proc.delay
                    )
                }
            )
        }
    }
}

export {
    DelayManager
}


