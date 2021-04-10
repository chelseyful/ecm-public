export const Settings = {
    "pbkdf2" : {
        "itterations": 11337,
        "length": 64,
        "digest": "sha512"
    },
    "token_iss_duration": 57600,
    "token_validator": /^[Bb]earer ([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/,
};
