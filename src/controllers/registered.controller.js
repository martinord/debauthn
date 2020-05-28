exports.getRegisteredCredentials = function(req,res, next) {
    var cred = req.session.registeredCredentials
    if(cred === undefined)  // not stored credentials yet
        cred = []
    res.send(cred)
    next()
}