export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    const expirationTime = Date.now() + 15 * 60 * 1000; 
    return { otp,expirationTime}
  };
  