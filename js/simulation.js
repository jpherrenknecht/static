
 function textsimultwa(i,choix,signe,twai,dureei)
 { 
 //console.log ('choix dans textsimultwa = '+ choix)

  if (choix=='twa'){   
  texte=' '
      +"<select  id='twacap"+i+"' class= 'black'  onChange ='majdonnees();' )'     >"       //onChange ='selecttwacap(this.value)';
      +"<option value='twa'> Twa </option> <option value='cap'> Cap </option>"
      +"</select>" 
      +"<select  id='signetwacap"+i+"'   class= 'black'  name='signe'    onChange ='majdonnees()'  >"
      if (signe=='+') {texte+= "<option  value="+"'+'"+"  selected>+</option><option> - </option>";classcolor='classinputgreen'}
      if (signe=='-') {texte+= "<option  value= "+"'-'"+"  selected>-</option><option> + </option>";classcolor='classinputred'}

      texte+="</select>"
      +"<input  type='number' min='30' max= '160'   step='1' id='twaid"+i+"'    class="+classcolor+"  value='"+twai+"'  onChange ='majdonnees()';   size='20'> "
      +" Pour "
      +"<input  type='number' min='10' max= '1500' step='10' id='dureeid"+i+"'  class='classinput' value='"+dureei+"'  onChange ='majdonnees()';  size='20'>mn "
      +"<input type='button' id='simulplus'  class= 'black12' onClick ='ajoutesimul()'; value='+'>"
      +"<input type='button' id='simulplus'  class= 'black12' onClick ='retiresimul()'; value='-'>"}
    
  else{
      texte= " "
      +"<select   id='twacap"+i+"'  class= 'black'  onChange ='majdonnees()';  >"                             //onChange ='selecttwacap(this.value)'; 
      +"<option value='twa'> Twa </option> <option selected value='cap'> Cap </option>"
      +"</select>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"  
      +" <input type='hidden' id='signetwacap"+i+"' value='+'   > "            
      +"<input  type='number' min='0' max= '360'   step='1'  id='twaid"+i+"' class='classinput'  value='"+twai+"'  onChange ='majdonnees()';   size='20'> "
      +" Pour "
      +"<input  type='number' min='10' max= '1500' step='10' id='dureeid"+i+"'  class='classinput'  value='"+dureei+"'  onChange ='majdonnees()';  size='20'>mn "
      +"<input type='button' id='simulplus' class= 'black12' onClick ='ajoutesimul()'; value='+'>"
      +"<input type='button' id='simulplus'  class= 'black12' onClick ='retiresimul()'; value='-'>"
     
      }
      return texte
 }



 function textsimultwa2(i,choix,signe,twai,dureei)
 { 
 //console.log ('choix dans textsimultwa = '+ choix)

  if (choix=='twa'){   
  texte2=' '
      +"<select  id='twacap2"+i+"' class= 'black' onChange ='majdonnees2();' )'     >"       //onChange ='selecttwacap(this.value)';
      +"<option value='twa'> Twa </option> <option value='cap'> Cap </option>"
      +"</select>" 
      +"<select  id='signetwacap2"+i+"'  class= 'black'   name='signe2'    onChange ='majdonnees2()'  >"
      if (signe=='+') {texte2+= "<option  value="+"'+'"+"  selected>+</option><option> - </option>";classcolor='classinputgreen'}
      if (signe=='-') {texte2+= "<option  value= "+"'-'"+"  selected>-</option><option> + </option>";classcolor='classinputred'}

      texte2+="</select>"
      +"<input  type='number' min='30' max= '160'   step='1' id='twaid2"+i+"'    class="+classcolor+"  value='"+twai+"'  onChange ='majdonnees2()';   size='20'> "
      +" Pour "
      +"<input  type='number' min='10' max= '1500' step='10' id='dureeid2"+i+"'  class='classinput' value='"+dureei+"'  onChange ='majdonnees2()';  size='20'>mn "
      +"<input type='button' id='simulplus2' class= 'black12' onClick ='ajoutesimul2()'; value='+'>"
      +"<input type='button' id='simulmoins2' class= 'black12' onClick ='retiresimul2()'; value='-'>"}
    
  else{
      texte2= " "
      +"<select   id='twacap2"+i+"'  class= 'black'  onChange ='majdonnees2()';  >"                             //onChange ='selecttwacap(this.value)'; 
      +"<option value='twa'> Twa </option> <option selected value='cap'> Cap </option>"
      +"</select>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"  
      +" <input type='hidden' id='signetwacap2"+i+"' value='+'   > "            
      +"<input  type='number' min='0' max= '360'   step='1'  id='twaid2"+i+"' class='classinput'  value='"+twai+"'  onChange ='majdonnees2()';   size='20'> "
      +" Pour "
      +"<input  type='number' min='10' max= '1500' step='10' id='dureeid2"+i+"'  class='classinput'  value='"+dureei+"'  onChange ='majdonnees2()';  size='20'>mn "
      +"<input type='button' id='simulplus2' class= 'black12' onClick ='ajoutesimul2()'; value='+'>"
      +"<input type='button' id='simulmoins2' class= 'black12' onClick ='retiresimul2()'; value='-'>"
     
      }
      return texte2
 }


function majdonnees()
{
  for (var indice=0;indice<donnees.length;indice++)
  {
  donnees[indice][1]=   document.getElementById('twacap'+indice).value 
  donnees[indice][2]=   document.getElementById('signetwacap'+indice).value
  donnees[indice][3]=   document.getElementById('twaid'+indice).value
  donnees[indice][4]=   document.getElementById('dureeid'+indice).value
  }
  //console.log ('Donnees modifiees :'+donnees)
  //texte=affichedonnees(donnees)
  //document.getElementById('achoix').innerHTML=texte
  //trace_simul()
  return donnees
}


function majdonnees2()
{
  for (var indice=0;indice<donnees2.length;indice++)
  {
  donnees2[indice][1]=   document.getElementById('twacap2'+indice).value 
  donnees2[indice][2]=   document.getElementById('signetwacap2'+indice).value
  donnees2[indice][3]=   document.getElementById('twaid2'+indice).value
  donnees2[indice][4]=   document.getElementById('dureeid2'+indice).value
  }
  return donnees2
}








// function trace_simul()
// { console.log ('donnees dans tracesimul'+donnees)
// // les valeurs y0 et x0 sont des valeurs globales des coordonnees du depart
// console.log (' y0 : ' +y0+' x0 '+x0+' t0 '+t0)
// meteo=vit_angle_vent (y0,x0,t0)     // meteo au point de depart permet de calculer la twa par rapport au cap suivi
// tws_ini=meteo[0]
// twd_ini=meteo[1]
// twa_ini_abs=Math.abs(twa_ini)
// res=vitessepolaire (twa_ini_abs,meteo[0])       // utilisation de la nouvelle fonction pour le calcul des polaires avec les voiles
// vit_polaire=res[0]
// nvoile0 =res[1]
// console.log ( 'tws : '+tws_ini+' twd : '+twd_ini+'twa : '+twa_ini+ 'vit : '+res[0]+' voile : '+res[1])
// coordis=[[2,30],[4,50]]
// //L.polyline(coordis).setStyle({ color: 'green', weight:2, opacity:0.3, }).addTo(map);
// }



function affichedonnees(donnees) 
{   var texte=' '
  deltat=0
  for (var j=0;j<donnees.length;j++)
  {  
  texte +="<div>"+ intlhmn.format(t0*1000+deltat)+textsimultwa(donnees[j][0],donnees[j][1],donnees[j][2],donnees[j][3],donnees[j][4])+"</div>"
  deltat+=donnees[j][4]*1000*60
  }
  return texte
}


function affichedonnees2(donnees2) 
{   var texte2=' '
  var deltat2=0
  for (var j=0;j<donnees2.length;j++)
  {  
  texte2 +="<div>"+ intlhmn.format(t0*1000+deltat2)+textsimultwa2(donnees2[j][0],donnees2[j][1],donnees2[j][2],donnees2[j][3],donnees2[j][4])+"</div>"
  deltat2+=donnees2[j][4]*1000*60
  }
  return texte2
}





function ajoutesimul()
{
  var k=donnees.length
  donnees.push([k,donnees[k-1][1],donnees[k-1][2],donnees[k-1][3],donnees[k-1][4]])
  texte=affichedonnees(donnees)
  document.getElementById('achoix').innerHTML=texte
}


function ajoutesimul2()
{
  var l=donnees2.length
  donnees2.push([l,donnees2[l-1][1],donnees2[l-1][2],donnees2[l-1][3],donnees2[l-1][4]])
  texte2=affichedonnees2(donnees2)
  document.getElementById('achoix2').innerHTML=texte2
}




function retiresimul()
{if (donnees.length>1)
  {donnees.pop()
  texte=affichedonnees(donnees)
  document.getElementById('achoix').innerHTML=texte}
}

function retiresimul2()
{  if (donnees2.length>1)
  {donnees2.pop()
  texte2=affichedonnees2(donnees2)
  document.getElementById('achoix2').innerHTML=texte2}
}