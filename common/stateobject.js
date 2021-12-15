
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
        this.state = this.get_init_state();
        this.deman = new DelayManager();
        this.register_delay(this.deman);
    }

    register_delay(deman) {
        // nothing
    }

    get_init_state () {
        return {
            modified: false,
            update_count: 0,
        }
    }

    begin_update () {
        this.setState({update_count : this.state.update_count + 1});
    }

    end_update (cb) {
        this.setState({update_count : this.state.update_count - 1}, cb);
    }

    setState = (state, callback) => {
        let prevState = {...this.state};
        this.state = {
            ...this.state,
            ...state
        };
        this.stateUpdated(prevState, state);
        if (callback !== undefined) {
            callback(this);
        }
    };

    doStateUpdated(prevState, delta) {

    }

    can_update () {
        return true;
    }

    stateUpdated(prevState, delta) {
        if (this.state.modified && !this.state.update_count && this.can_update()) {
            this.state = {
                ...this.state,
                modified: false,
            };
            this.doStateUpdated(prevState, delta);
            if (this.props.onChange !== undefined) {
                this.props.onChange(this);
            }
        }
    }

    setDelayedState(state, delayname, cb) {
        let that = this
        this.setState(state, () => {
            if (delayname) {
                that.deman.run(delayname, cb)
            } else {
                if (cb !== undefined) {
                    cb()
                }
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
