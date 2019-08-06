'use strict';



class utilidades {

   uploaded(req, res) {

 
    var EDfile = req.files.upload;
	
    var hoy = new Date();

    cad="_"+hoy.getDate()+hoy.getMonth()+1+hoy.getFullYear()+'__'+hoy.getHours()+"_"+hoy.getMinutes()+"_"+hoy.getSeconds(); 

    EDfile.name=cad+EDfile.name;
    
    var dir = `./files/`+EDfile.name;

    
    console.log(EDfile);
   
    EDfile.mv(`./files/`+EDfile.name , err => {
       console.log(err);
        if(err) return res.status(500).send({ message : 'error tal '+ err });

        return res.status(200).send({
    "uploaded": 1,
    "fileName": EDfile.name,
    "url": `/files/`+EDfile.name
});
    });
    	console.log(EDfile.name);
       
    

}

}

module.exports = utilidades;



