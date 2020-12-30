
import { DelayManager } from './delayprocessing'

const DELAY_MODIFIED = 'MODIFIED'
const DELAY_STATE = 'STATE'
const DELAY_CHANGE = 'CHANGE'
const DELAY_LOAD = 'LOAD'

class stateobject {

    constructor (props) {
        this.props = {
            ...props
        };
        this.state = this.get_init_state()
        this.deman = new DelayManager()
        this.register_delay(this.deman)
    }

    register_delay(deman) {
        // nothing
    }

    get_init_state () {
        return {
            modified: false
        }
    }

    setState = (state, callback) => {
        let prevState = {...this.state}
        this.state = {
            ...this.state,
            ...state
        }
        this.stateUpdated(prevState, state);
        if (callback !== undefined) {
            callback();
        }
    };

    doStateUpdated(prevState, delta) {

    }

    stateUpdated(prevState, delta) {
        if (this.state.modified) {
            this.state = {
                ...this.state,
                modified: false,
            }
            this.doStateUpdated(prevState, delta)
            if (this.props.onChange !== undefined) {
                this.props.onChange(this)
            }
        }
    }

    setDelayedState(state, delayname) {
        let that = this
        this.setState(state, () => {
            if (delayname) {
                that.deman.run(delayname)
            }
        })
    }
}

export {
    stateobject,
    DELAY_MODIFIED,
    DELAY_STATE,
    DELAY_CHANGE,
    DELAY_LOAD
}
