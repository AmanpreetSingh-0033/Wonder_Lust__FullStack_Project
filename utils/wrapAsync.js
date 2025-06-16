
/////// making customize function to handle async error 



module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}