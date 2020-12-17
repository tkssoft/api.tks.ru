/* Расчет контракта с одним товаром */

import React from 'react'

import { BaseContractApp } from '../app/contract_app'
import { ContractData, ContractDopData } from '../app/contract_data'
import { SimpleResults, SimpleResultTotals } from './simple_results'
import { Errors } from '../../common/errors'

class SimpleContractApp extends BaseContractApp {

    render () {
        const props = this.props
        const manager = this.contract_manager
        return (
            <>
                <Errors errors={this.state.errors} toshow="calc" {...props}/>
                <ContractData manager={manager} {...props} />
                <ContractDopData manager={manager} g32={1} {...props} />
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
        )
    }
}


export {
    SimpleContractApp
}