import csv
import json
import math
import os
import sys
import time

from datetime import datetime

import numpy as np

#from flask import (Flask, flash, jsonify, redirect, render_template, request,session, url_for)

# from fonctions2023 import *
from fonctions2024 import *

basedir = os.path.abspath(os.path.dirname("__file__"))

tic = time.time()
ticstruct = time.localtime()
utc = time.gmtime()
decalage = ticstruct[3] - utc[3]
verbose=3
print ('Repertoire de travail ',basedir)    





filename2='/home/jp/static/js/polars2.json'   
with open(filename2, 'r') as fichier2:
        data1 = json.load(fichier2)    
        
        
        
for key,value in data1.items() :
    polairesjson   = data1[key]
    _id            = polairesjson['polar']['_id']
    tabtwsvr       = np.asarray(polairesjson['polar']['tws'])                                            
    tabtwavr       = np.asarray(polairesjson['polar']['twa'])
    nbtws          = len(tabtwsvr)
    nbtwa          = len(tabtwavr)
    bateau         = polairesjson['polar']['label']
    coeffboat      = polairesjson['polar']['coeffboat']
    nbvoiles       = len(polairesjson['polar']['sail'])
    typevoile      = []
    
    print('key {:30}  id {}  '.format(key ,_id))
    
    toutespolaires = np.zeros((nbtwa,nbtws,nbvoiles))
    for i in range(nbvoiles) :
        typevoile.append( polairesjson['polar']['sail'][i]['name'])
        toutespolaires[:,:,i] = polairesjson['polar']['sail'][i]['speed']
        speedRatio            = polairesjson['polar']['foil']['speedRatio']
        twaMin                = polairesjson['polar']['foil']['twaMin']
        twaMax                = polairesjson['polar']['foil']['twaMax']
        twaMerge              = polairesjson['polar']['foil']['twaMerge']
        twsMin                = polairesjson['polar']['foil']['twsMin']
        twsMax                = polairesjson['polar']['foil']['twsMax']
        twsMerge              = polairesjson['polar']['foil']['twsMerge']
        hull                  = polairesjson['polar']['hull']['speedRatio']
        lws                   = polairesjson['polar']['winch']['lws']
        hws                   = polairesjson['polar']['winch']['hws']
        lwtimer               = polairesjson['polar']['winch']['sailChange']['pro']['lw']['timer']
        hwtimer               = polairesjson['polar']['winch']['sailChange']['pro']['hw']['timer']
        lwratio               = polairesjson['polar']['winch']['sailChange']['pro']['lw']['ratio']
        hwratio               = polairesjson['polar']['winch']['sailChange']['pro']['hw']['ratio']
        tackprolwtimer        = polairesjson['polar']['winch']['tack']['pro']['lw']['timer']
        tackprolwratio        = polairesjson['polar']['winch']['tack']['pro']['lw']['ratio']
        tackprohwtimer        = polairesjson['polar']['winch']['tack']['pro']['hw']['timer']
        tackprohwratio        = polairesjson['polar']['winch']['tack']['pro']['hw']['ratio']
        gybeprolwtimer        = polairesjson['polar']['winch']['gybe']['pro']['lw']['timer']
        gybeprolwratio        = polairesjson['polar']['winch']['gybe']['pro']['lw']['ratio']
        gybeprohwtimer        = polairesjson['polar']['winch']['gybe']['pro']['hw']['timer']
        gybeprohwratio        = polairesjson['polar']['winch']['gybe']['pro']['hw']['ratio']
        polairesmax           = np.amax(toutespolaires,axis=2) 
        
    # fabrication du tableau des polaires     
    polairesunit10   = np.float32(np.zeros((701,181)))
    polairesunit10ttv= np.float32(np.zeros((7,701,181)))   
    tabfoils         = np.float32(np.zeros((701,181)))
    
    for j in range (7):                                 # on calcule les vitesses pour chaque voile
        for i in range (701):                           # creation de polaireunit a laide de polairevecttwa
             polairesunit10[i]=polaire_vect_twa(toutespolaires[:,:,j],tabtwavr,tabtwsvr,np.ones(181)*i/10,np.arange(0,181).reshape(-1,1))
        polairesunit10ttv[j]=polairesunit10
    
        for i in range (701):                                    # Utilisation d un tableau pour les coeffs foils 
            for j in range (181):
                tabfoils[i,j]=foil(j,i/10,speedRatio,twaMin,twaMax,twaMerge,twsMin,twsMax,twsMerge)

    # calcul des vitesses  avec foils des vitesses max et des voiles          
    polairesmaxttv    = np.amax(polairesunit10ttv,axis=0) *tabfoils*1.003  
    polairesttv       = polairesunit10ttv*tabfoils*1.003  
    voiles            = np.argmax(polairesunit10ttv,axis=0)  

    #on regroupe les 3 dans un tableau unique 
    polairesglobales=np.float32(np.zeros((9,701,181)))    
    polairesglobales[0:7,:,:] = polairesttv
    polairesglobales[7,:,:]   = polairesmaxttv
    polairesglobales[8,:,:]   = voiles
    
    # Sauvegarde et chargement dans un fichier 
    filenamelocal1='polairesglobales_'+str(_id)+'.npy'   
    filename1='/home/jp/static/npy/'+filenamelocal1 
    with open(filename1,'wb')as f: 
          np.save (f,polairesglobales) 
            
            
    # on va constituer le tableau des vmg pour chaque bateau          
    Twa=np.arange(180)
    cos=np.cos(Twa/180*math.pi).astype(np.float32)
    tabvmg=np.zeros((701,7),dtype=np.float32)            # on va constituer un tableau (tws,vmgmax,twavmgmax,vmgmin,twavmgmin,vmax,twavmax)
    for tws10 in range (701) :                           # on fait varier le vent de 0a 70 Noeuds
        Tws=(np.ones(len(Twa))*tws10).astype (int)       # on constitue une serie de vents identiques pour calculer pour chaque twa
        Vitesses = polairesglobales[7,Tws,Twa]
        Vmg=Vitesses*cos
        tabvmg[tws10,0]=tws10
        tabvmg[tws10,1]=np.max(Vmg)
        tabvmg[tws10,2]=np.argmax(Vmg)
        tabvmg[tws10,3]=np.min(Vmg)
        tabvmg[tws10,4]=np.argmin(Vmg)
        tabvmg[tws10,5]=np.max(Vitesses)
        tabvmg[tws10,6]=np.argmax(Vitesses)         
    filenamelocal2='vmg_'+str(_id)+'.npy'   
    filename2='/home/jp/static/npy/'+filenamelocal2 
    with open(filename2,'wb')as f: 
          np.save (f,tabvmg) 
            
            
            
#test des valeurs 

_id=18
filenamelocal1='polairesglobales_'+str(_id)+'.npy'   
filename1='/home/jp/static/npy/'+filenamelocal1 

with open(filename1,'rb')as f: 
     polairesglobales = np.load(f)



filenamelocal2='vmg_'+str(_id)+'.npy'   
filename2='/home/jp/static/npy/'+filenamelocal2 
with open(filename2,'rb')as f: 
     tabvmg = np.load(f)

# Exemple calcul des polaires pour  toutes les voiles pour tws et twa donnees
tws=13.6
twa=63
# avec polairesglobales
tws10r = round(tws*10)
twar   = round(twa)
print('\nVerification des polaires')
print (' id {} ---  Pour tws {} et Twa {}'.format(_id,tws,twa))
jib=polairesglobales[0,tws10r,twar] 
spi=polairesglobales[1,tws10r,twar]  
staysail=polairesglobales[2,tws10r,twar]  
lightjib=polairesglobales[3,tws10r,twar]  
code0=polairesglobales[4,tws10r,twar]  
HG=polairesglobales[5,tws10r,twar]  
LG=polairesglobales[6,tws10r,twar]  
Max=polairesglobales[7,tws10r,twar]  
Voile=polairesglobales[8,tws10r,twar]  
print()
print ('jib (0)     {:6.3f}\nlightjib(3) {:6.3f} \nStaysail(2) {:6.3f}\nCode 0(4)   {:6.3f}\nSpi(1)     {:6.3f} \nLG(6)      {:6.3f}\nHG(5)      {:6.3f} \nMax {:6.3f} avec Voile {:6.0f}'.format(  jib,lightjib , staysail, code0,  spi, LG,HG,  Max, Voile))

# Exemple Calcul des vitesses en vectoriel avec une twa en vectoriel et une tws fixe et calcul des voiles correspondantes  
tws=13.6

Twa=np.array([119,120,121,122,123]).astype (int)
Tws=(np.ones(len(Twa))*round(tws*10)).astype (int)
vitesses = polairesglobales[7,Tws,Twa]
voile    = polairesglobales[8,Tws,Twa]
 # np.column_stack(
res=np.column_stack((Twa,vitesses,voile))
print ('\n Calcul des vitesses pour differentes twa  avec tws {}\n'.format(tws))

print('Twa       Vitesse  voile' )

print(np.round(res,3))

print()