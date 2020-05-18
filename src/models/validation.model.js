const mapToJSON = require('./helpers').mapToJSON

exports.Validation = class Validation {
    /**
     * Constructor. All params but 'complete' are of type Map
     * @param {*} params 
     */
    constructor(params) {
        this.complete = params.complete
        this.warnings = Array.from(params.warning.entries())
        this.data = {
            info: mapToJSON(params.info),
            authnrData: mapToJSON(params.authnrData),
            clientData: mapToJSON(params.clientData)
        }
    }
}