$.validator.addMethod("solo_letras", function (value, element) {
    return this.optional(element) || /^[a-z\s]+$/i.test(value);
}, "Necesitamos que solo ingreses letras");

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



});

jQuery(function () {
    jQuery("#form_registro").validate({

        rules: {
            nombre_u: {
                solo_letras: true
            },
            apellido_u: {
                solo_letras: true
            }
        },
        messages: {
            nombre_u: {
                solo_letras: "Ingresa un nombre real, los nombres no tienen numeros"
            },
            apellido_u: {

                solo_letras: "Ingresa un apellido real, los apellidos no tienen numeros"
            }
        }
    });
});
