import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import { _ } from 'meteor/underscore'
// import OAuthEncryption from 'meteor/oauth-encryption'

Accounts.emailTemplates.siteName = Meteor.settings.public.appName;
Accounts.emailTemplates.from = `${Meteor.settings.public.appName} <${Meteor.settings.public.appEmail}>`;

// http://docs.meteor.com/api/accounts-multi.html#AccountsCommon-config
Accounts.config({
    sendVerificationEmail: false
});

Accounts.onCreateUser(function(options, user) {
    const { profile } = options;
    const { code } = profile;
    const newUser = Object.assign({}, user);

    if (code !== Meteor.settings.signUpCodes.admin) {
        throw new Meteor.Error('Accounts.onCreateUser', 'Sorry, the code is wrong');
    }

    newUser.credits = 1000;
    newUser.roles = ['admin'];
    newUser.profile = profile;
    return newUser;
});
