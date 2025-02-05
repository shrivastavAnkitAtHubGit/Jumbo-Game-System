const SALT_WORK_FACTOR = 10;
const mobileRegex = /^[0-9]*$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const DEFAULT_GAME_ID = '67a2fec28a875581a292f7a4';

const SESSION_STATUS = {
    INITIATED: 'initiated',
    MATCHED: 'matched',
    COMPLETED: 'completed',
    DISCARDED: 'discarded',
};

module.exports = {
    SALT_WORK_FACTOR,
    mobileRegex,
    emailRegex,
    SESSION_STATUS,
    DEFAULT_GAME_ID,
};