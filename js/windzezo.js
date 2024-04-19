

"use strict";

console.log ('test essai')
var speed_s2;

var valeur1='taratata'
function miseajour(){

var speed=15;

var res=vr_speed(speed)
document.getElementById('valeur1').innerHTML=res
}






function vr_speed(d) {
	if (d > 127) {
		d  = 256 - d;
    	return -(d*d)*(3600.0/230400.0);
	}	
    return (d*d)*(3600.0/230400.0);
}

function uv2d(u, v) {                                // fonction retournant la direction de u v en degres
	var d = Math.atan2(u,v) * 180/Math.PI  + 180;
	if (d < 0) 
		d += 360;
	else if (d >= 360) 
		d -= 360;
	return d;
}

function uv2s(u,v) {                                    // fonction retournant le module de (u,v)
	return Math.sqrt(u*u + v*v);
}

function get_int_wind(lon,lat,wind_data) {            //recuperation des u et v du vent pour lat et lon  dans wind_data
	if (!wind_data || lat == 0) {                     // je pense que winddata les valeurs sont applaties 
		return [0,0];
	}
	var x = (lon + 180)%360;
	var y = 180 - lat;

	var offset = 4 * (x + 360 * y);
	var u =  vr_speed(wind_data[offset]);
	var v =  vr_speed(wind_data[offset+1]);

	return [u, v];
}

function f(d) {
	return Math.abs(Math.sin(d * Math.PI/180));
}


function get_interp_wind2(lon,lat,u1,v1,u2,v2,t,tig)
{	var b, u, v, x,y,lon1, lat1,fraction,ilati;
	var speed_uv, speed_s, cs_uv, cs_avg, cs_ratio, c_coeff, s_coeff;
	var a=[], d=[], s = [], wu = [],wv = [], c = [];
	ilati=90-lat       // pour passer en systeme de coordonnees gribs
	lat = ilati

	
	console.log ('indice longitude : '+lon)
	console.log ('indice latitude  : '+lat)
	console.log  ('u1   : '+u1)
	console.log  ('v1   : '+v1)
	console.log  ('u2   : '+u2)
	console.log  ('v2   : '+v2)
	
	lon1 = Math.floor(lon);
	lat1 = Math.floor(lat);
	
	x = lon - lon1;                                                     // partie fractionnaire des indices lat et lon
	y = lat - lat1;
	var itemp = (t+1 - tig) / 3600 / 3 
	var ditemp = itemp%1

	
	console.log( 'lon1 : ' +lon1)
	console.log( 'lat1 : ' +lat1)
	console.log( 'x : ' +x)
	console.log( 'y : ' +y)
	console.log ('t : ' +t  )
	console.log ('itemp : ' +itemp  )


	fraction=ditemp
    fraction=Math.floor(ditemp*18)/18
	
    //fraction=Math.floor(ditemp*36)/36


	console.log ('fraction : '+fraction )


	for (var i = 0; i < 4; i++) {                                   // la premiere interpolation est faite  sur le temps pour les 4 valeurs u et v  
		var tu = wu[i] = u1[i] * (1.0-fraction) + u2[i] * fraction;
		var tv = wv[i] = v1[i] * (1.0-fraction) + v2[i] * fraction;
		s[i] = uv2s(tu,tv);
		d[i] = uv2d(tu,tv);                                        //pour les quatre points on a la vitesse et la direction
	}



	console.log ('wu : '+wu)
	console.log  ('wv : '+wv )
	console.log  ('s : '+s )
	console.log  ('d : '+d )

	u = (wu[1]+wu[2]-wu[0]-wu[3])*x*y + (wu[3]-wu[2])*x + (wu[0]-wu[2]) * y + wu[2];     //interpolation bilinaire sur u   au temps interpole 
	v = (wv[1]+wv[2]-wv[0]-wv[3])*x*y + (wv[3]-wv[2])*x + (wv[0]-wv[2]) * y + wv[2];     // interpolation bilinaire sur v

	console.log('u : ',u)
	console.log('v : ',v)

	b = Math.round(((Math.atan2(u,v)) * 180/Math.PI + 180)*10)/10;                        // calcul de l'angle en degres avec arctan2  arrondi a 1 decimale
	b %= 360;
	console.log ('b angle du vent pour la prevision :',b)


	// on applique le calcul de correction de la vitesse

    speed_s = (s[1]+s[2]-s[0]-s[3])*x*y + (s[3]-s[2])*x + (s[0]-s[2]) * y + s[2];          // interpolation bilineaire pour s x et y sont les fractions decimales de lat et lon 
	speed_uv = uv2s(u,v);  

	console.log ('speed_s  : '+ speed_s)
	console.log ('speed_uv  : '+ speed_uv)


	cs_uv = uv2s((wu[0]+wu[1]+wu[2]+wu[3])/4, (wv[0]+wv[1]+wv[2]+wv[3])/4);      // racine carree de u moyen+vmoyen
	
	cs_avg = (s[0] + s[1] + s[2] + s[3]) / 4;

	cs_ratio = cs_avg>0?(cs_uv/cs_avg):1;            // cs ratio est le rapport entre cs_uv et cs 


	console.log('cs_ratio'+cs_ratio) 




	if (x < 0.5) { // left side
		if (y < 0.5) { //bottom;
			c[0] = f(d[0]-d[2]);          // la fonction f donne le sinus de l'angle en degres d est la direction
			c[1] = cs_ratio;
			c[2] = 1;
			c[3] = f(d[2]-d[3]);
	
	
		} else { // top left
			y -= 0.5;
			c[0] = 1;
			c[1] = f(d[0]-d[1]);
			c[2] = f(d[0]-d[2]);
			c[3] = cs_ratio;
		}
	} else { // right
		x -= 0.5;
		if (y < 0.5) { //bottom;
			c[0] = cs_ratio;
			c[1] = f(d[1]-d[3]);
			c[2] = f(d[2]-d[3]);
			c[3] = 1;
		} else { // top right
			y -= 0.5;
			c[0] = f(d[0]-d[1]);
			c[1] = 1;
			c[2] = cs_ratio;
			c[3] = f(d[1]-d[3]);
		}
	}

   console.log ('valeur de c : '+c )


   x *= 2; y*=2;
   c_coeff = (c[1]+c[2]-c[0]-c[3])*x*y + (c[3]-c[2])*x + (c[0]-c[2]) * y + c[2];            //interpolation bilineaire sur c 
  console.log ('c_coeff'+c_coeff)

   s_coeff = (speed_s > 0)?Math.pow(speed_uv/speed_s , 1 - Math.pow(c_coeff, 0.7)):1;      // la formule compliquee speed s est la vitesse interpolee simple speed u_v est l'interpolle par uv 
   
   console.log('s_coeff : ' +s_coeff)

   speed_s *= s_coeff;
   if (speed_s < 2 * 1.852) speed_s = 2*1.852;  

	console.log ('valeur de speed _s   : '+speed_s)
	console.log ('valeur de speed _s*2   :'+speed_s*2)

	speed_s2=speed_s*2

}



function get_interp_wind(lon, lat, n)                                                          //interpolation de la force du vent en fonction de la lat et de la long 
{
		var b, u, v, x,y,lon1, lat1;
		var speed_uv, speed_s, cs_uv, cs_avg, cs_ratio, c_coeff, s_coeff;

		var a=[], d=[], s = [], wu = [],wv = [], c = [], u1 = [], u2 = [], v1 = [], v2 = [];
	
		var wd1 = [], wd2 = [];
		var t, fraction = 0;
	
		if (lon > 180) {                                                 // transforme la longitude pour etre entre -180 et +180
			lon -= 360;
		} else if (lon < -180) {
			lon += 360;
		}

		lon1 = Math.floor(lon);
		lat1 = Math.floor(lat);
		
		x = lon - lon1;                                                     // partie fractionnaire des indices lat et lon
		y = lat - lat1;
	
		if (n === "current_wind") {
			wd1 = wd2 = wind_array["current_wind"];	
		} else {
			fraction = n % 18;
			t = Math.floor((n - fraction)/18);                               //fractionnement du temps en 18  ( toutes les 10 mn?)
	
			fraction /= 18;

			wd1 = wind_array[t];
			if (!wd1) {
				return [-1, 0];
			}

			wd2 = wind_array[t+1];
			if (!wd2) {
				wd2 = wd1;	
			}
		}

		a = get_int_wind(lon1, lat1 + 1, wd1);                                                  // on recupere les valeurs du vent dans le grib aux 8 positions 
		u1[0] = a[0]; v1[0] = a[1];
		a = get_int_wind(lon1 + 1, lat1 + 1, wd1);                     // a[0] =u  a[1]=v
		u1[1] = a[0]; v1[1] = a[1];
		a = get_int_wind(lon1, lat1, wd1);
		u1[2] = a[0]; v1[2] = a[1];
		a = get_int_wind(lon1 + 1, lat1, wd1);
		u1[3] = a[0]; v1[3] = a[1];
	
		a = get_int_wind(lon1, lat1 + 1, wd2);
		u2[0] = a[0]; v2[0] = a[1];
		a = get_int_wind(lon1 + 1, lat1 + 1, wd2);
		u2[1] = a[0]; v2[1] = a[1];
		a = get_int_wind(lon1, lat1, wd2);
		u2[2] = a[0]; v2[2] = a[1];
		a = get_int_wind(lon1 + 1, lat1, wd2);
		u2[3] = a[0]; v2[3] = a[1];
	
		for (var i = 0; i < 4; i++) {                                   // la premiere interpolation est faite 4 fois sur le temps 
			var tu = wu[i] = u1[i] * (1.0-fraction) + u2[i] * fraction;
			var tv = wv[i] = v1[i] * (1.0-fraction) + v2[i] * fraction;
			s[i] = uv2s(tu,tv);
			d[i] = uv2d(tu,tv);                                  //pour les quatre points on a la vitesse et la direction
		}

		u = (wu[1]+wu[2]-wu[0]-wu[3])*x*y + (wu[3]-wu[2])*x + (wu[0]-wu[2]) * y + wu[2];     //interpolation bilinaire sur u   au temps interpole 
		v = (wv[1]+wv[2]-wv[0]-wv[3])*x*y + (wv[3]-wv[2])*x + (wv[0]-wv[2]) * y + wv[2];     // interpolation bilinaire sur v

		b = Math.round(((Math.atan2(u,v)) * 180/Math.PI + 180)*10)/10;                        // calcul de l'angle en degres avec arctan2  arrondi a 1 decimale
		b %= 360;




		speed_s = (s[1]+s[2]-s[0]-s[3])*x*y + (s[3]-s[2])*x + (s[0]-s[2]) * y + s[2];          // interpolation bilineaire pour s
		speed_uv = uv2s(u,v);                                                                  // racine carree de u2+v2  = norme de (u,v)
 
        cs_uv = uv2s((wu[0]+wu[1]+wu[2]+wu[3])/4, (wv[0]+wv[1]+wv[2]+wv[3])/4);      // racine carree de u moyen+vmoyen
        cs_avg = (s[0] + s[1] + s[2] + s[3]) / 4;

        cs_ratio = cs_avg>0?(cs_uv/cs_avg):1;            // cs ratio est le rapport entre cs_uv et cs 

        if (x < 0.5) { // left side
            if (y < 0.5) { //bottom;
                c[0] = f(d[0]-d[2]);          // la fonction f donne le sinus de l'angle en degres d est la direction
                c[1] = cs_ratio;
                c[2] = 1;
                c[3] = f(d[2]-d[3]);
            } else { // top left
                y -= 0.5;
                c[0] = 1;
                c[1] = f(d[0]-d[1]);
                c[2] = f(d[0]-d[2]);
                c[3] = cs_ratio;
            }
        } else { // right
            x -= 0.5;
            if (y < 0.5) { //bottom;
                c[0] = cs_ratio;
                c[1] = f(d[1]-d[3]);
                c[2] = f(d[2]-d[3]);
                c[3] = 1;
            } else { // top right
                y -= 0.5;
                c[0] = f(d[0]-d[1]);
                c[1] = 1;
                c[2] = cs_ratio;
                c[3] = f(d[1]-d[3]);
            }
        }

		x *= 2; y*=2;
		c_coeff = (c[1]+c[2]-c[0]-c[3])*x*y + (c[3]-c[2])*x + (c[0]-c[2]) * y + c[2];            //interpolation bilineaire sur c 
       
        s_coeff = (speed_s > 0)?Math.pow(speed_uv/speed_s , 1 - Math.pow(c_coeff, 0.7)):1;      // la formule compliquee speed s est la vitesse interpolee simple speed u_v est l'interpolle par uv 
        
        speed_s *= s_coeff;
		if (speed_s < 2 * 1.852) speed_s = 2*1.852;                                             // minoration du vent a 2 noeuds
		return [speed_s, b];
}

function foil_c(twa, ws) {                      // calcul du coeff de foil
		var ct = 0;
		var cv = 0;  

		if (twa <= 70) {
			return 1;
		} else if (twa < 80) {
			ct = (twa - 70) / 10;
		} else if (twa < 160) {
			ct = 1;
		} else if (twa < 170) {
			ct = (170 - twa) / 10;
		} else {
			return 1;
		}

		if (ws <= 11) {
			return 1;
		} else if (ws < 16) {
			cv = (ws - 11) / 5;
		} else if (ws < 35) {
			cv = 1;
		} else if (ws < 40) {
			cv = (40 - ws) / 5;
		} else {
			return 1;
		}

		return 1 + 0.04 * ct * cv;
}

function get_boat_speed(twa, ws) {              // calcul de la polaire du bateau
    if (!polar_data)
        return [0,0];
    if (twa > 180)
        twa = 360 - twa;
    twa = Math.round(twa);
    if (ws >= 129)
        ws = 129;
    var ws1 = Math.floor(ws);
    var frac = ws - Math.floor(ws);
    var offset = 4 * ( 130 * twa + ws1);
    var bs = ((polar_data[offset+1] << 8) | (polar_data[offset+2])) / 100;
    var bs1 = ((polar_data[offset+5] << 8) | (polar_data[offset+6])) / 100;
    var sail = polar_data[ offset + (frac < 0.5?0:4)];
	bs += frac * (bs1 - bs);
	if (pro_options & 16) {
		bs *= foil_c(twa, ws/1.852);
	}
    return [ bs ,sail];
}

