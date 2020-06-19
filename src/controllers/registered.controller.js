exports.getRegisteredCredentials = function(req,res, next) {
    var cred = req.session.registeredCredentials
    if(cred === undefined)  // not stored credentials yet
        cred = []
    res.send(cred)
    next()
}

exports.deleteRegisteredCredentials = function(req, res, next) {
    req.session.registeredCredentials = []  // empty stored credentials
    res.sendStatus(200)
    next()
}