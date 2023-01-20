
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TnvedApp } from './tnvedapp';
import { tnved_manager } from '../tnved_manager';

const TnvedAppConfig = {
    isclasses: true,
    manager: new tnved_manager({})
}

const target = document.querySelector('#ccs-app');

createRoot(target).render(
    <TnvedApp
        search={true}
        header_css='.navbar'
        footer_css='.footer'
        {...TnvedAppConfig}
    />
);
