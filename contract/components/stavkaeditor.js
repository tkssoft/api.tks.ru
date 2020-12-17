/* Редактирование ставок/признаков для структур из contract_manager */

import React from "react"
import { ShowSt } from '../../tnved/showst'
import { get_stavka } from "../../tnved/stavka"

const StavkaEditor = (props) => {
    const { manager, kontdop, skipName, skipIfEmpty } = props
    if (kontdop !== undefined) {
        return <ShowSt
            typ={manager.kontrakt.TYPE}
            data={kontdop.state.data}
            tnved={kontdop.state.tnved}
            G33={kontdop.state.data.G33}
            G312={kontdop.state.data.G312}
            G34={kontdop.state.data.G34}
            key={kontdop.state.data.G33}
            skipName={skipName}
            skipIfEmpty={skipIfEmpty}
            onSelect={(prz, base, tnvedall) => {
                const stavka = get_stavka(prz, kontdop.state.tnved.TNVED, base ? undefined : tnvedall);
                kontdop.setStavka(stavka);
            }}
        />
    } else {
        return <></>
    }
}

export {
    StavkaEditor
}