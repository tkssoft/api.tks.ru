
const ccs_class = (cls) => {
    return `ccs-${cls}`
}

const ccs_contract = (cls) => {
    return `${ccs_class('contract')}-${cls}`
}

export {
    ccs_class,
    ccs_contract
}