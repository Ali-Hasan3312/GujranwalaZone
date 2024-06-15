// Create Token and saving in cookie
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    // options for cookie
    // const options = {
    //     expires: 5 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    // };
    res.status(statusCode).cookie("token", token).json({
        success: true,
        user,
        token,
    });
};
export { sendToken };
