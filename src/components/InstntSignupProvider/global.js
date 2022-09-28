export let global = {}
const BLANK = '';
export const globalVarModel = {
    instnt : {
        workflowId : BLANK,
        isAsync : false,
        serviceURL : BLANK,
        visitorId : BLANK,
        instnttxnid : BLANK
    }
}

export const setGlobalVar = ( data ) => {
    global = data
}