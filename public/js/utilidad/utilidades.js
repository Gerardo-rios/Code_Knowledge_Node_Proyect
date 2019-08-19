


$(document).ready(function () {
    
     $.ajax({
        url: "http://localhost:567/admin/cat/supertoken",
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            
            var html =  '<option value="" selected> Seleccione una categoria.. </option>';
            $.each(data, function (index, item) {
                    html += '<option value="' + item.id + '" >' + item.nombre + '</option>'; 
            console.log(html);
            });
            $("#cat").html(html);
            console.log(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
            console.log(jqXHR.responseText);
        }
    });
      
        
});



