$(document).ready(function () {
    
     $.ajax({
        url: "http://localhost:567/admin/cat/supertoken",
        type: 'GET',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            
            var html =  '';
            $.each(data, function (index, item) {
                var nombre = item.nombre.replace(/ /gm,'+');
                    html += '<li><a href="/search?texto='+nombre+'&criterio=categoria">'+item.nombre+'<span>'+item.categorium.length+'</span></a>'; 
          
            });
            
            $("#cate").html(html);
           
            //console.log(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
            console.log(jqXHR.responseText);
        }
    });
      
        
});