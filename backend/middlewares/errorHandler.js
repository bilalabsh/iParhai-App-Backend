const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};//if user accesses api which does not exist

const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode===200?500:res.statusCode;
    res.status(statusCode);
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV==='production'?null:err.stack
    });
}//any other error

module.exports = { notFound, errorHandler };