// Fill the DB with example data on startup
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import { createLocalData } from './localFixtures';

const users = [
    {
        name: 'Agustin Jamardo',
        email: 'agustin@anceu.com',
        password: 'anceuvibe',
        roles: ['admin', 'staff']
    },
    {
        name: 'Edouard',
        email: 'edo.renard@gmail.com',
        password: 'anceuvibe',
        roles: ['admin', 'staff']
    }
];

Meteor.startup(() => {
    if (Meteor.users.find().count() === 0) {
        users.forEach(function(user) {
            const { email, password, name } = user;

            const account = Accounts.users.findOne(
                { 'emails.address': email },
                { fields: { emails: 1 } }
            );

            const userId = account
                ? account._id
                : Accounts.createUser({
                      email,
                      password,
                      profile: { name, code: Meteor.settings.signUpCodes.admin }
                  });
            Roles.addUsersToRoles(userId, user.roles);
        });
    }
    if (Meteor.settings.public.deployMode === 'local') {
        createLocalData();
    }
});
