Ext.define('c1.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.Ajax'
    ],
    config: {
        refs: {
            loginView: 'loginview',
            mainMenuView: 'mainmenuview'
        },
        control: {
            loginView: {
                signInCommand: 'onSignInCommand'
            },
            mainMenuView: {
                onSignOffCommand: 'onSignOffCommand'
            }
        }
    },

    // Session token

    sessionToken: null,

    // Transitions
    getSlideLeftTransition: function () {
        return { type: 'slide', direction: 'left' };
    },

    getSlideRightTransition: function () {
        return { type: 'slide', direction: 'right' };
    },

    onSignInCommand: function (view, username, password) {
        var me = this,
            loginView = me.getLoginView();

        if (username.length === 0 || password.length === 0) {

            loginView.showSignInFailedMessage('Ingresa usuario y contraseña.');
            return;
        }

        loginView.setMasked({
            xtype: 'loadmask',
            message: 'Ingresando...'
        });

        Ext.Ajax.request({
            scope : this,
            url: 'http://localhost:8888/sencha/c1.core/services/login.php',
            method: 'post',
            params: {
                fn : 'login',
                user: username,
                pwd: password
            },
            success: function (response) {
                var res = Ext.JSON.decode(response.responseText);
                console.log(res)    
                if (res.success == true) {
                    // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
                    me.sessionToken = res.sessionToken;
                    me.signInSuccess();     //Just simulating success.
                } else {
                    me.singInFailure(res.message);
                }
            },
            failure: function (response) {
                me.sessionToken = null;
                me.singInFailure('Login ha fallado');
            }
        });
    },

    signInSuccess: function () {
        console.log('Signed in.');
        var loginView = this.getLoginView();
        mainMenuView = this.getMainMenuView();
        loginView.setMasked(false);

        Ext.Viewport.animateActiveItem(mainMenuView, this.getSlideLeftTransition());
    },

    singInFailure: function (message) {
        var loginView = this.getLoginView();
        loginView.showSignInFailedMessage(message);
        loginView.setMasked(false);
    },

    onSignOffCommand: function () {
        var me = this;

        Ext.Ajax.request({
            url: 'http://localhost:8888/sencha/c1.core/services/login.php',
            method: 'post',
            params: {
                fn: 'logoff'
            },
            success: function (response) {
            },
            failure: function (response) {
            }
        });

        Ext.Viewport.animateActiveItem(this.getLoginView(), this.getSlideRightTransition());
    }
});
