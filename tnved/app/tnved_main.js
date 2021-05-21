
import React from 'react'
import ReactDOM from 'react-dom'
import { TnvedApp } from './tnvedapp'
import { tnved_manager } from '../tnved_manager'

const TnvedAppConfig = {
    isclasses: true,
    manager: new tnved_manager({})
}

const target = document.querySelector('#ccs-app')

ReactDOM.render(<TnvedApp {...TnvedAppConfig} />, target)