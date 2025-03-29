const adminAuth = (req, res, next) => {
    console.log("Admin Auth is getting checked")
    const token = "xyza"
    const isAdminAuthorised = token === "xyz"
    if (!isAdminAuthorised) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log("Admin Auth is getting checked")
    const token = "xyz"
    const isAdminAuthorised = token === "xyz"
    if (!isAdminAuthorised) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next()
    }
}

module.exports = { adminAuth, userAuth }