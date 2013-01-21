Ext.define('c1.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.Ajax'
    ],
    config: {
        refs: {
            //refs es un simil a un alias para una referencia mas clara o acortada a nivel de clase interna
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
    // Session 
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
        //una mascara es una especie de aviso mientras algo carga hasta que se renderiza
        loginView.setMasked({
            xtype: 'loadmask',
            message: 'Ingresando...'
        });
        //aqui es donde nos comunicamos con algun servicio
        //puede ser java ej : localhost:8080/app.war/rest-service/getLogin , .net u otros
        //TODO : Dejar URL en global
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
                    me.sessionToken = res.sessionToken;
                    me.signInSuccess();     //Just simulating success.
                } else {
                    //enviamos el mensaje a la vista
                    me.singInFailure(res.message);
                }
            },
            failure: function (response) {
                me.sessionToken = null;
                //enviamos el mensaje a la vista
                me.singInFailure('Login ha fallado');
            }
        });
    },
    signInSuccess: function () {
        //obtenemos las vistas
        var loginView = this.getLoginView();
        mainMenuView = this.getMainMenuView();
        //aseguramos que no quede alguna mask de cargado
        loginView.setMasked(false);
        //recargamos la vista de menu en el device
        Ext.Viewport.animateActiveItem(mainMenuView, this.getSlideLeftTransition());
    },
    singInFailure: function (message) {
        //obtenemos la vista y le enviamos el mensaje de error
        var loginView = this.getLoginView();
        loginView.showSignInFailedMessage(message);
        loginView.setMasked(false);
    },
    onSignOffCommand: function () {
        var me = this;
        //servicio para un logoff
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
        //al salir volvemos a cargar la vista de login
        Ext.Viewport.animateActiveItem(this.getLoginView(), this.getSlideRightTransition());
    }
});
