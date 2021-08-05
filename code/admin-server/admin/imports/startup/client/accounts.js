import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

const onLogin = () => {
    const next = FlowRouter.getQueryParam('next');
    // console.log("onLogin", { next });
    if (next) {
        FlowRouter.go(next);
        return;
    }
    const currentRouteName = FlowRouter.current().route.name;
    if (currentRouteName == 'Accounts.signin' || currentRouteName == 'Accounts.join') {
        FlowRouter.go('Admin.dashboard');
        return;
    }
    return;
};

Accounts.onLogin(onLogin);
