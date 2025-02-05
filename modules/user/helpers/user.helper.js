const jwt = require('jsonwebtoken');
const {
    jwt: { secret: jwtSecret },
} = require('../../../development.config.json');
const { UserModel } = require('../../../mongodb/models/index');
const { statusCodes } = require('../../../utils/response/response.handler');
const { ERROR_MESSAGES } = require('../constants/user.constant');

async function isUserAlreadyExists({ email, mobile }) {
    const findQuery = {
        $or: [
            { email },
        ]
    };
    if (mobile) {
        findQuery.$or.push({mobile});
    }
    const isUserExist = await UserModel.countDocuments(findQuery);
    return isUserExist;
}

async function userAccoutCreation({ name, email, mobile, password }) {
    const userObj = new UserModel({
        name,
        email,
        password,
        isAvailable: false,
    });
    if (mobile) {
        // console.log(mobile);
        userObj.mobile = mobile;
    }
    await userObj.save();
}

function generateToken(userData) {
    const {
        email, mobile, name, _id,
    } = userData;
    const options = {};
    const jwtValues = { _id };
    if (email) {
        jwtValues.email = email;
    }
    if (mobile) {
        jwtValues.mobile = mobile;
    }
    if (name) {
        jwtValues.name = name;
    }
    const token = jwt.sign(jwtValues, jwtSecret, options);
    return token;
};

async function updateUser({ userId, token }) {
    const findQuery = {
        _id: userId,
    };
    const updateQuery = {
        $set: {
            token,
        }
    };
    await UserModel.updateOne(findQuery, updateQuery);
}

async function loginUser({ email, password }) {
    const findQuery = {
        email,
    };
    const projectQuery = {
        email: 1,
        name: 1,
        mobile: 1,
        password: 1,
        token: 1,
    };
    const userData = await UserModel.findOne(findQuery, projectQuery);
    if (!userData) {
        throw {
            code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
            message: ERROR_MESSAGES.USER_NOT_FOUND,
        }
    }
    const isPasswordMatched = userData.comparePassword(password);
    if (!isPasswordMatched) {
        throw {
            code: statusCodes.STATUS_CODE_UNAUTHORIZED,
            message: ERROR_MESSAGES.INCORRECT_PASSWORD,
        }
    }
    if (userData.token) {
        return { token: userData.token };
    }
    const token = generateToken(userData);
    await updateUser({ userId: userData, token });
    return { token };
}

async function markUserAvailable({ userId }) {
    await UserModel.updateOne({ _id: userId }, { $set: { isAvailable: true } });
}

async function markUserUnavailable({ userId }) {
    await UserModel.updateOne({ _id: userId }, { $set: { isAvailable: false } });
}

module.exports = {
    userAccoutCreation,
    loginUser,
    isUserAlreadyExists,
    markUserAvailable,
    markUserUnavailable,
}