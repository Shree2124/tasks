import { User } from '../models/user/user.model.js';
import { ApiError } from './ApiError.util.js';


export const generateAccessAndRefreshTokens = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = await user?.generateAccessToken();
		const refreshToken = await user?.generateRefreshToken();
		console.log(accessToken, refreshToken);

		if (!user) {
			throw new ErrorResponse(404, 'user not found');
		}
		if (!refreshToken) {
			throw new ErrorResponse(500, 'Failed to generate refresh token');
		}
		user.refreshToken = refreshToken.toString();
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(500, 'Something went wrong while generating refresh and access token');
	}
};
