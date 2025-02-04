const SALT_WORK_FACTOR = 10;
const mobileRegex = /^[0-9]*$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

module.exports = {
    SALT_WORK_FACTOR,
    mobileRegex,
    emailRegex,
};