// ==UserScript==
// @name          DS Moral im Profil
// @version       1.3
// @author        cuzi (http://example.com)
// @description   Fügt die Anzeige der Moral zum Spielerprofil hinzu
// @namespace     example.com
// @homepage      http://example.com
// @copyright     2009-2011, cuzi (http://example.com)
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
const world = parseInt(url.match(/(\d+)/)[1]);

// Get own points
var own_points = unsafeWindow.game_data.player.points;
  
 
var moral = 'Moral';  
  
if(world > 4 && !!~url.indexOf('info_player'))
  { 
  // Get player points
  var player_points = parseInt(document.getElementById('content_value').getElementsByTagName('td')[2].textContent.replace('.','')); 

  // Calculate
  var value = Math.ceil(((player_points / own_points) * 3 + 0.3)*100);
  value = value<30?30:value>100?100:value;

  // Create table row
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  td1.appendChild(document.createTextNode(moral));
  var td2 = document.createElement('td');
  if(value != 100)
    td2.setAttribute('style','font-weight:bold;');
  td2.appendChild(document.createTextNode(value+'%'));
  tr.appendChild(td1);
  tr.appendChild(td2);

  // Insert into table
  var table = document.getElementById('content_value').getElementsByClassName('vis')[0];
  table.appendChild(tr);
  }
/*
else if(world > 4 && !!~url.indexOf('map')) {
  document.getElementById('info_owner').addEventListener('DOMSubtreeModified',function() {
	// Get player points
    var str = this.innerHTML.match(/\((.+)\)/)[1];
	if(str) {
	  str = str.replace('.','');
      var player_points = parseInt(str); 
      
	  // Calculate
      var value = Math.ceil(((player_points / own_points) * 3 + 0.3)*100);
      value = value<30?30:value>100?100:value;	
	  
      if(document.getElementById('info_moral_info_row'))  {
	    // Insert		
	    document.getElementById('info_moral_info').replaceChild(document.createTextNode(value+'%'),document.getElementById('info_moral_info').firstChild);
        document.getElementById('info_moral_info_row').style.display = 'table-row';	
	    }
	  else {
	    // Create table row
	    var tr = document.createElement('tr');
		tr.setAttribute('id','info_moral_info_row');
	    var td1 = document.createElement('td');
	    td1.appendChild(document.createTextNode(moral));
	    var td2 = document.createElement('td');
		td2.setAttribute('id','info_moral_info');
	    if(value != 100)
	      td2.setAttribute('style','font-weight:bold;');
	    td2.appendChild(document.createTextNode(value+'%'));
	    tr.appendChild(td1);
	    tr.appendChild(td2);
		document.getElementById('info_content').appendChild(tr);
        document.getElementById('info_moral_info_row').style.display = 'table-row';		
	    }
	
	  }  
  
    },false);
  }
*/