const adminMiddleware = (req,res,next) => {
    if(!req.userScehma.roles ===!req.userScehma.roles ){
        res.status(403).json({message:'Only admin can authenticate this route '})
    }
    next();
}

export default adminMiddleware;