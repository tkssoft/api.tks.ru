
class stateobject {

    constructor (props) {
        this.props = {
            ...props
        };
        this.state = this.get_init_state();
        this.timeout = null;
    }

    get_init_state () {
        return {
            delayed: false,
            pending: false,
            loading: false,
            loadpending: false,
            modified: false,
        }
    }

    setState = (state, callback) => {
        let prevState = {...this.state}
        this.state = {
            ...this.state,
            ...state
        }
        this.stateUpdated(this.props, prevState);
        if (callback !== undefined) {
            callback();
        }
    };

    stateUpdated(prevProps, prevState, source) {
        if (this.props.onChange !== undefined) {
            this.props.onChange(this)
        }
    }

    setDelayedState(state, cb) {
        // ToDo: реализация работы с timeout есть в contract_manager.
        // Посмотреть и перенести сюда.
        // Здесь устанавливается только флаг delayed
        this.setState({
            ...state,
            delayed: true
        }, cb)
    }
}

export {
    stateobject
}
