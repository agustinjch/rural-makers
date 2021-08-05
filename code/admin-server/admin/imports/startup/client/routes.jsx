import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';
import React from 'react';
import { mount } from 'react-mounter';

import NotFoundPage from '../../ui/pages/NotFoundPage';

import AdminContainer from '../../ui/containers/admin/AdminContainer';
import AccountsContainer from '../../ui/containers/accounts/AccountsContainer';

import AuthPageSignIn from '../../ui/pages/accounts/AuthPageSignIn';
import AuthPageJoin from '../../ui/pages/accounts/AuthPageJoin';

import CountersPage from '../../ui/pages/counters/CountersPage';

import DashboardPageContainer from '../../ui/containers/admin/DashboardPageContainer';
import UsersPageContainer from '../../ui/containers/users/UsersPageContainer';
import CounterDetailContainer from '../../ui/containers/counters/CounterDetailContainer';
import DatalessMeasuresContainer from '../../ui/containers/datalessMeasures/DatalessMeasuresContainer';

const APP_NAME = Meteor.settings.public.appName;

const addTitle = function(title) {
    DocHead.setTitle(title);
};

const trackRouteEntry = () => {
    Meteor.setTimeout(() => {
        const userId = Meteor.userId();
        if (!userId) {
            FlowRouter.go('Accounts.signin');
        }
    }, 3000);
};

FlowRouter.notFound = {
    name: 'App.notFound',
    action() {
        addTitle(`${APP_NAME} | Page not found`);
        return mount(NotFoundPage);
    }
};

FlowRouter.route('/signin', {
    name: 'Accounts.signin',
    action() {
        addTitle(`${APP_NAME} | Sign In`);
        return mount(AccountsContainer, { content: <AuthPageSignIn /> });
    }
});

FlowRouter.route('/join', {
    name: 'Accounts.join',
    action() {
        addTitle(`${APP_NAME} | Join`);
        return mount(AccountsContainer, { content: <AuthPageJoin /> });
    }
});

// admin routes
const adminRoutes = FlowRouter.group({
    name: 'admin',
    // prefix: "/admin",
    triggersEnter: [trackRouteEntry]
});

adminRoutes.route('/', {
    name: 'Admin.dashboard',
    action() {
        addTitle(`${APP_NAME} | Dashboard`);
        return mount(AdminContainer, {
            content: { component: DashboardPageContainer }
        });
    }
});
adminRoutes.route('/users', {
    name: 'Admin.users',
    action() {
        addTitle(`${APP_NAME} | Users`);
        return mount(AdminContainer, {
            content: { component: UsersPageContainer }
        });
    }
});

adminRoutes.route('/counters', {
    name: 'Admin.counters',
    action() {
        addTitle(`${APP_NAME} | Counters`);
        return mount(AdminContainer, {
            content: { component: CountersPage }
        });
    }
});
adminRoutes.route('/measures', {
    name: 'Admin.measures',
    action() {
        addTitle(`${APP_NAME} | Measures to do`);
        return mount(AdminContainer, {
            content: { component: DatalessMeasuresContainer }
        });
    }
});

adminRoutes.route('/counters/:counterId/', {
    name: 'Admin.counterDetail',
    action(params) {
        addTitle(`${APP_NAME} | ${params.counterId}`);
        return mount(AdminContainer, {
            content: {
                component: CounterDetailContainer,
                props: { counterId: params.counterId }
            }
        });
    }
});
