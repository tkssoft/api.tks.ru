/* Расчет контракта с одним товаром */

import React from 'react'

import { BaseContractApp } from '../app/contract_app';
import { ContractData, ContractDopData } from '../app/contract_data';
import { SimpleResults, SimpleResultTotals } from './simple_results';
import { Errors } from '../../common/errors';
import { ScrollContainer } from '../../common/container';

class SimpleContractApp extends BaseContractApp {

    get_storage_section () {
        return 'CssContract'
    }

    render () {
        const props = this.props
        const manager = this.contract_manager

        return (
            <ScrollContainer {...props}>
                <Errors errors={this.state.errors} toshow="calc" {...props}/>
                <ContractData manager={manager} {...props} />
                <ContractDopData manager={manager} g32={1} {...props} />
                {!manager.any_errors() && (
                    <>
                    <SimpleResults
                        data={this.state.result && this.state.result.kont47}
                        manager={manager}
                        {...props}
                    />
                    <SimpleResultTotals
                        data={this.state.result && this.state.result.totals}
                        manager={manager}
                        {...props}
                    />
                    </>
                )}
            </ScrollContainer>
        )
    }
}


export {
    SimpleContractApp
}