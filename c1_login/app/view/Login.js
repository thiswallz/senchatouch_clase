//definimos el package
Ext.define('c1.view.Login', {
    //componente de donde extiende
    //con esto asume atributos y comportamientos de la clase padre
    extend: 'Ext.tab.Panel',
    //alias para llamar despues al panel de la forma xtype : 'loginview'
    alias: "widget.loginview",    
    //clases que ocuparemos dentro de login
    requires: [
        'Ext.TitleBar',
        'Ext.form.FieldSet', 
        'Ext.form.Password', 
        'Ext.Label', 
        'Ext.Img', 
        'Ext.util.DelayedTask'    
    ],
    //funcion que llama a signInCommand del controller Login
    onLogInButtonTap: function () {

        var me = this,
            usernameField = me.down('#userNameTextField'),
            passwordField = me.down('#passwordTextField'),
            label = me.down('#signInFailedLabel'),
            username = usernameField.getValue(),
            password = passwordField.getValue();

        label.hide();

        var task = Ext.create('Ext.util.DelayedTask', function () {

            label.setHtml('');
            //desencadenamos el evento que llama a la funcion signInCommand, pasando
            //el scope, usuario y password
            me.fireEvent('signInCommand', me, username, password);
            //limpiamos el form
            usernameField.setValue('');
            passwordField.setValue('');
        });
        //pequeño delay para simular un loading
        task.delay(500);

    },
    //funcion para dejar un mensaje si existe algun error
    showSignInFailedMessage: function (message) {
        //navega hacia abajo hasta encontrar el itemId con el nombre signInFailedLabel
        var label = this.down('#signInFailedLabel');
        //setea el mensaje proviniente del servicio
        label.setHtml(message);
        //como esta oculto el label, le hacemos un "show" para mostrarlo
        label.show();
    },
    config: {
        //posicion de los menubar top || bottom
        tabBarPosition: 'bottom',
        items: [
            {
                title: 'Welcome',
                iconCls: 'home',
                styleHtmlContent: true,
                scrollable: true,
                items : [
                    {
                    title: 'Login',
                    items: [
                    {
                        xtype: 'image',
                        src: 'resources/img/lock.png',
                        style: Ext.Viewport.getOrientation() == 'portrait' ? 'width:80px;height:80px;margin:auto' : 'width:40px;height:40px;margin:auto'
                    },
                    {
                        xtype: 'label',
                        html: 'Login ha fallado.',
                        itemId: 'signInFailedLabel',
                        hidden: true,
                        hideAnimation: 'fadeOut',
                        showAnimation: 'fadeIn',
                        style: 'color:#990000;margin:5px 0px;'
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Login Sistema',
                        items: [
                            {
                                xtype: 'textfield',
                                placeHolder: 'Usuario',
                                itemId: 'userNameTextField',
                                name: 'userNameTextField',
                                required: true
                            },
                            {
                                xtype: 'passwordfield',
                                placeHolder: 'Password',
                                itemId: 'passwordTextField',
                                name: 'passwordTextField',
                                required: true
                            }
                        ]
                    },
                    {
                        xtype: 'button',
                        itemId: 'logInButton',
                        ui: 'action',
                        padding: '10px',
                        text: 'Log In'
                    }
                ]
            }]
        }],
        listeners: [{
            delegate: '#logInButton',
            event: 'tap',
            fn: 'onLogInButtonTap'
        }]
    }
});
