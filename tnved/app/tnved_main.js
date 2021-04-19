
import React from 'react'
import ReactDOM from 'react-dom'
import { TnvedApp } from './tnvedapp'

const TnvedAppConfig = {
    isclasses: true
}

ReactDOM.render(<TnvedApp {...TnvedAppConfig} />, document.querySelector('.ccs-app'))