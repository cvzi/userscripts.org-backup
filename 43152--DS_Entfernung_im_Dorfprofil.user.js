// ==UserScript==
// @name          DS Entfernung im Dorfprofil
// @namespace     example.com
// @include       http://de*.die-staemme.de/game.php*screen=info_village*id=*
// ==/UserScript==


// ds.distanceOnVillageProfile.user.js

/*
DS Entfernung im Dorfprofil

Version 1.1

(c) by cuzi
         cuzi@openmail.cc
         http://example.com

You may change string values if it's necessary for your language area.
Do not republish, use in other scripts, change or reproduce this code nor a part of this code without permission from cuzi.

This script may be forbidden in some language areas.
Please look in the respective forum for further information!
I won't take responsibility.

*/

// Local Village
var tds = document.getElementById('menu_row2').getElementsByTagName('td');
if(tds[tds.length-1].getElementsByTagName('b')[0])
  var local_village = tds[tds.length-1].getElementsByTagName('b')[0].firstChild.nodeValue.split(')').shift().split('(').pop().split('|');
else
  var local_village = tds[tds.length-2].getElementsByTagName('b')[0].firstChild.nodeValue.split(')').shift().split('(').pop().split('|');
local_village[0] = parseInt(local_village[0]);
local_village[1] = parseInt(local_village[1]);

// Remote Village
var table = document.getElementsByClassName('vis left')[0];
var remote_village = table.getElementsByTagName('td')[1].firstChild.nodeValue.split(')').shift().split('(').pop().split('|');
remote_village[0] = parseInt(remote_village[0]);
remote_village[1] = parseInt(remote_village[1]);

// Calc Distance
var distance = Math.round ( Math.pow( Math.pow(local_village[0] - remote_village[0],2) + Math.pow(local_village[1] - remote_village[1],2) , 0.5 ) * 100 ) / 100;

// Insert Content
var trs = table.getElementsByTagName('tr');
var tr = trs[1].cloneNode(true);
tr.getElementsByTagName('td')[0].replaceChild(document.createTextNode('Entfernung'),tr.getElementsByTagName('td')[0].firstChild);
tr.getElementsByTagName('td')[1].replaceChild(document.createTextNode(distance.toString(10).replace(/\W/,',')+ ' Felder'),tr.getElementsByTagName('td')[1].firstChild);
table.appendChild(tr);
