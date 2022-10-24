const jwt = require("jsonwebtoken");
const Fypclients= require("../model/Fypclient");


const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        //console.log(token);
        // yahan pr jwt.verify method token ko verify kara secret key ka sath
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        //console.log( "Ya ha token baba" + verifyToken._id);
        const rootUser = await Fypclients.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) { throw new Error('User not Found') }
        req.token = token;
        //agr kal ko mujha data chaya hova user ka tu ma easily get karsakon is liya ma req.rootUser bana
        // raha hn... ta ka agr ko request kara rootUser ka data ki tu us mil ja data...
        // isi liya ma na  req.rootUser = rootUser kiya ha
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        req.message = rootUser.message;
        next();

    } catch (err) {
        res.status(401).send('No token Provided hahahaha')
        console.log(err)
    }
}

module.exports = Authenticate;