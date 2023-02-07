/*кнопка, окрывающая модальное окно*/

const React  = require('react');
const { debug } = require('./debug');
const classNames = require('classnames');
const { IconX, IconThreeDots, IconThreeDotsVertical } = require('./icons');

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);
        this.modal = null;
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp, false);
        document.addEventListener('click', this.handleOutsideClick, false);
        window.modalwindow_count = window.modalwindow_count === undefined ? 1: (window.modalwindow_count + 1);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp, false);
        document.removeEventListener('click', this.handleOutsideClick, false);
        window.modalwindow_count = window.modalwindow_count === undefined ? 0: (window.modalwindow_count - 1);
    }

    handleKeyUp(e) {
        const {onCloseRequest} = this.props;
        const keys = {
            27: () => {
                e.preventDefault();
                e.stopPropagation();
                onCloseRequest();
                window.removeEventListener('keyup', this.handleKeyUp, false);
            },
        };

        if (keys[e.keyCode]) {
            keys[e.keyCode]();
        }
    }

    handleOutsideClick(e) {

        const {onCloseRequest} = this.props;

        if (e.detail !== 0) {
            if (this.modal !== null) {
                if (!this.modal.contains(e.target)) {
                    onCloseRequest();
                    document.removeEventListener('click', this.handleOutsideClick, false);
                }
            }
        }
    }

    get_className() {
        return this.props.className !== undefined ? this.props.className : ''
    }

    render() {
        const {
            onCloseRequest,
            children,
            isclasses,
            contentref
        } = this.props;

        return (
            <div className={"modalbutton-overlay " + this.get_className()}>
                <div
                    className={"modalbutton-modal " + this.get_className()}
                    ref={node => (this.modal = node)}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div className={'modalbutton-caption'}>
                        <div className={'modalbutton-title'}>{this.props.title}</div>
                        <button
                            type="button"
                            className={classNames("close border modalbutton-close")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCloseRequest();
                            }}>
                            <span><IconX /></span>
                        </button>
                    </div>
                    <div className={'modalbutton-content'} ref={contentref}>
                        {children}
                    </div>
                </div>

            </div>
        );
    }
}


class ModalButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    handleToggleModal() {
        debug('handleToggleModal');
        let that = this;
        setTimeout(
            that.setState({
                showModal: !that.state.showModal
            }), 100
        );
    }

    render() {
        const {buttonLabel, children, isclasses, btnClassName, contentref, onIcon} = this.props;
        const {showModal} = this.state;
        debug('ModalButton render', btnClassName);
        return (
            <div className={this.props.className}>
                <button
                    className={classNames({
                        'w-100 text-truncate': isclasses,
                        [btnClassName]: !!btnClassName && isclasses
                    })}
                    type="button"
                    onClick={!this.state.showModal ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleToggleModal();
                    } : undefined}
                >
                    {onIcon && onIcon(this.props) || buttonLabel}
                </button>
                {showModal &&
                <ModalWindow
                    onCloseRequest={() => this.handleToggleModal()}
                    title={this.props.title}
                    className={this.props.windowclassName}
                    isclasses={isclasses}
                    contentref={contentref}
                >
                    {children}
                </ModalWindow>}
            </div>
        );
    }
}

const DotsModalButton = (props) => {
    return (
        <ModalButton {...props} onIcon={() => <IconThreeDots />} />
    )
};

const DotsModalButtonVertical = (props) => {
    return (
        <ModalButton {...props} onIcon={() => <IconThreeDotsVertical />} />
    )
};

module.exports = {
    ModalWindow,
    ModalButton,
    DotsModalButton,
    DotsModalButtonVertical
};