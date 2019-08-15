$(document).ready(function () {
     
    $("#form_inicio_sesion").validate({
        rules: {
            username: {
                required: true,
                maxlength: 80
            },
            pass: {
                required: true,
                minlength: 8,
                maxlength: 15
            }
        },
        messages: {
            username: {
                required: "Hey vamos, no podemos dejarte iniciar sin tu correo",
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            pass: {
                required: "Necesitamos comprobar tu contraseña",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            }
        }
    });

    $("#form_registro").validate({
        rules: {
            nombre_u: {
                required: true,
                minlenght: 3,
                maxlength: 80
            },
            apellido_u: {
                required: true,
                minlength: 3,
                maxlength: 80
            },
            username: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            email: {
                required: true,
                minlength: 10,
                maxlength: 80
            },
            clave: {
                required: true,
                minlength: 8,
                maxlength: 15
            }
        },
        messages: {
            nombre_u: {
                required: "Hey tienes que decirnos cual es tu nombre",
                minlength: $.format("Los nombres reales no tienen tan pocos caracteres"),
                maxlength: $.format("Tu nombre es demaciado largo o no es real")
            },
            apellido_u: {
                required: "Hey tienes que decirnos cual es tu apellido",
                minlength: $.format("Los apellidos reales no tienen tan pocos caracteres"),
                maxlength: $.format("Tu apellido es demaciado largo o no es real")
            },
            username: {
                required: "Hey vamos, Necesitas un nombre de usuario",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            },
            email: {
                required: "Debes poner tu correo para luego poder ingresar",
                minlength: $.format("Los correos reales no tienen tan pocos caracteres"),
                maxlength: $.format("Tu correo es demaciado largo o no es real")
            },
            clave: {
                required: "Necesitas una contraseña para proteger tu cuenta",
                minlength: $.format("Necesitamos por lo menos {0} caracteres"),
                maxlength: $.format("{0} caracteres son demasiados!")
            }
        }
    });

});
