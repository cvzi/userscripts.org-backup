// ==UserScript==
// @name          DS Moral im Profil
// @version       1.0
// @author        cuzi (http://example.com)
// @description   Fügt die Anzeige der Moral zum Spielerprofil hinzu
// @namespace     example.com
// @homepage      http://example.com
// @copyright     2009, cuzi (http://example.com)
// @license       CC Attribution-Noncommercial-Share Alike 3.0 Germany; http://creativecommons.org/licenses/by-nc-sa/3.0/de/legalcode
// @include       http://*.die-staemme.de/game.php*screen=info_player*
// @exclude       http://forum.die-staemme.de/*
// ==/UserScript==

/*

############## Distribution Information ##############

All content by example.com
Do not distribute this script without this logo.

######################## Logo ########################
   ____ _   _ ________ 
  / ___| | | |__  /_ _|
 | |   | | | | / / | | 
 | |___| |_| |/ /_ | | 
  \____|\___//____|___|

######################################################

If you have any questions, comments,
ideas, etc, feel free to contact me
and I will do my best to respond.

         mail:cuzi@openmail.cc

         skype:cuzi_se

         http://example.com

         twitter: http://twitter.com/cuzi

####################### License ######################

Shared under the 'CC Attribution-Noncommercial-Share Alike 3.0 Germany' License:
http://creativecommons.org/licenses/by-nc-sa/3.0/de/legalcode

English Summary of that license:
http://creativecommons.org/licenses/by-nc-sa/3.0/de/deed.en

*/


const url = document.location.href;
const world = parseInt(url.split('.').shift().split('de').pop());

if(world > 4)
  {
  // Get own points
  var xpr = document.evaluate('id("menu_row")//td//a[contains(@href,"screen=ranking")]//..//text()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(xpr.snapshotItem(3))
    var str = xpr.snapshotItem(1).nodeValue + xpr.snapshotItem(3).nodeValue;
  else
    var str = xpr.snapshotItem(1).nodeValue;

  var own_points = parseFloat(str.match(/(\d+) P/)[1]);

  // Get player points
  var xpr = document.evaluate('//table[@class="vis"]//tr//td[contains(.,"Punkte")]/../td[2]/text()', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(xpr.snapshotItem(1))
    var str = xpr.snapshotItem(0).nodeValue + xpr.snapshotItem(1).nodeValue;
  else
    var str = xpr.snapshotItem(0).nodeValue;

  var player_points = parseFloat(str);

  // Calculate
  var value = Math.ceil(((player_points / own_points) * 3 + 0.3)*100);
  value = value<30?30:value>100?100:value;

  // Create table row
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  td1.appendChild(document.createTextNode('Moral'));
  var td2 = document.createElement('td');
  if(value != 100)
    td2.setAttribute('style','font-weight:bold;');
  td2.appendChild(document.createTextNode(value+'%'));
  tr.appendChild(td1);
  tr.appendChild(td2);

  // Insert into table
  var table = document.getElementsByClassName('vis')[0];
  table.appendChild(tr);
  }

