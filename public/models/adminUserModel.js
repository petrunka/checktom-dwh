/**
 * Created by Bjarke E. Andersen on 13-10-2014.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore')

/**
 * User Schema
 */

var adminUserSchema = new Schema({
    _id: {type: Schema.ObjectId},
    email: {
        type: String,
        required: [true, 'Email is required.' ],
        unique: [true, 'This email is already registered'],
        index: true,
        pattern: 'email'
    },
    hashed_password: {
        type: String,
        required: [true, 'Password is required']
    },
    salt: String,
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    adminType: String
    //uniqueRecoveryString: String
})

adminUserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    });

adminUserSchema.virtual('repeat_password')
    .get(function () {
        return this._repeatPassword;
    })
    .set(function (value) {
        this._repeatPassword = value;
    });

/**
 * Validations
 */

var total;
var emailNotExists = function (email, _callback) {
    mongoose.model('User', UserSchema).
        count({
            email: email
        }, function (err, count) {
            if (err)
                return _callback(count);
            return _callback(null, ((count == 0) ? true : false));
        });
};

var validatePresenceOf = function (value) {
    return value && value.length
}

/**
 * Methods
 */

adminUserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return ''
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    }
}


mongoose.model('AdminUserSchema', adminUserSchema, 'adminUserSchema')