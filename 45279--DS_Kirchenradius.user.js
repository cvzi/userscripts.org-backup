// ==UserScript==
// @name          DS Kirchenradius
// @version       0.9.3
// @author        cuzi (http://example.com)
// @description   Fügt die Möglichkeit hinzu fü nicht-Kirchen-Dörfer den Glaubensradius zu simulieren.
// @namespace     example.com
// @homepage      http://example.com
// @copyright     2009, cuzi (http://example.com)
// @license       CC Attribution-Noncommercial-Share Alike 3.0 Germany; http://creativecommons.org/licenses/by-nc-sa/3.0/de/legalcode
// @include       http://*.die-staemme.de/game.php*screen=map*
// @include       http://*.die-staemme.de/game.php*screen=info_village*
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


const version = '0.9.3';


//################ Common Functions ##################

function setValue(key,value) { return GM_setValue(world+'_'+key,value); };

function getValue(key) { return GM_getValue(world+'_'+key); };

function rel_top(e)
  {
  var y = 0;
  while(e)
    {
    y += e.offsetTop + e.clientTop;
    e = e.offsetParent;
    }
  return y;
  }

function rel_left(e)
  {
  var x = 0;
  while(e)
    {
      x += e.offsetLeft + e.clientLeft;
      e = e.offsetParent;
    }
  return x;
  }

function dragable(element,pixel)
  {
  var click_position,
  clone = false,
  active = false,
  cursor,
  ref = element,
  y = 0,
  x = 0,
  current_position = [];
  while(ref)
    x += ref.offsetLeft + ref.clientLeft,ref = ref.offsetParent;
  current_position.push(x);
  ref = element;
  while(ref)
    y += ref.offsetTop + ref.clientTop,ref = ref.offsetParent;
  current_position.push(y);
  if(element.style.position != 'absolute' && element.style.position != 'fixed') {
    var placeholder = element.parentNode.insertBefore(element.cloneNode(true),element);
    placeholder.innerHTML = '';
    placeholder.style.height = element.clientHeight+'px';
    placeholder.style.width = element.clientWidth+'px'; }
  with(element) {
    style.position = 'absolute';
    style.left = current_position[0] + 'px';
    style.top = current_position[1] + 'px';
    addEventListener('mousedown',function(e) {
      if(clone) { try {
        clone.parentNode.removeChild(clone);
        clone = false; } catch(e){} }
      current_position[0] = parseInt(this.style.left);
      current_position[1] = parseInt(this.style.top);
      click_position = [e.pageX - current_position[0],e.pageY - current_position[1]];
      if(pixel?(click_position[1] > pixel):(click_position[1] > this.clientHeight / 7))
        return;
      clone = element.cloneNode(true);
      element.parentNode.insertBefore(clone,element);
      element.style.opacity = 0.5;
      cursor = this.style.cursor?this.style.cursor:'default';
      this.style.cursor = 'move';
      active = true;
      },false);
    addEventListener('mouseup',function() {
      this.style.cursor = cursor;
      active = false;
      this.style.opacity = 1.0;
      try { clone.parentNode.removeChild(clone); clone = false; } catch(e){};
      },false);
    }
  document.addEventListener('mousemove',function(e) {
    if(active)
      with(element) {
        style.left = (e.pageX - click_position[0]) + 'px';
        style.top = (e.pageY - click_position[1]) + 'px'; }
    },false);
  }


//################ Special Functions #################

function _map()
  {
  this.current =
    {
    'primaryKeys' :
      {
      'radius' : 0 ,
      'dialog' : 1
      },
    'objects' :
      {
      'radius' :
        {
        },
      'dialog' :
        {
        'zIndex' : 20
        }
      }
    };
  this.srcs = {
    'radius' :
      {

      1 :
        {
        'red'      :    'http://example.com/stuff/ds_churchradius/red_1.png',
        'green'    :    'http://example.com/stuff/ds_churchradius/green_1.png',
        'yellow'   :    'http://example.com/stuff/ds_churchradius/yellow_1.png',
        'blue'     :    'http://example.com/stuff/ds_churchradius/blue_1.png',
        'darkblue' :    'http://example.com/stuff/ds_churchradius/darkblue_1.png'
        } ,

      2 :
        {
        'red'      :    'http://example.com/stuff/ds_churchradius/red_2.png',
        'green'    :    'http://example.com/stuff/ds_churchradius/green_2.png',
        'yellow'   :    'http://example.com/stuff/ds_churchradius/yellow_2.png',
        'blue'     :    'http://example.com/stuff/ds_churchradius/blue_2.png',
        'darkblue' :    'http://example.com/stuff/ds_churchradius/darkblue_2.png'
        } ,

      3 :
        {
        'red'      :    'http://example.com/stuff/ds_churchradius/red_3.png',
        'green'    :    'http://example.com/stuff/ds_churchradius/green_3.png',
        'yellow'   :    'http://example.com/stuff/ds_churchradius/yellow_3.png',
        'blue'     :    'http://example.com/stuff/ds_churchradius/blue_3.png',
        'darkblue' :    'http://example.com/stuff/ds_churchradius/darkblue_3.png'
        }

      }
    };
  };


_map.prototype.addRadius = function(x,y,colour,level)
  {
  // Check Colour
  if(!this.srcs.radius[level][colour])
    return false;

  var id = 'map_addon_radius_'+(this.current.primaryKeys.radius++);

  var render = true;

  // Current Village
  var topoRect = document.getElementById('topoRect');
  if(topoRect)
    {
    var current_x = parseInt(document.getElementsByName('min_x')[0].value) + ( parseInt(topoRect.style.left) / 5) + 3;
    var current_y = parseInt(document.getElementsByName('min_y')[0].value) + ( parseInt(topoRect.style.top) / 5) + 3;
    if(level == 1)
      {
      var left = (parseInt(topoRect.style.left) + 15 ) + ((x - current_x) * 5);
      var top = (parseInt(topoRect.style.top) + 15 ) + ((y - current_y) * 5);
      var width = 46;
      var height = 46;
      var margin_left = -20;
      var margin_top = -20;
      var image = topoRect.parentNode.getElementsByTagName('input')[0];
      }
    else if(level == 2)
      {
      var left = (parseInt(topoRect.style.left) + 15 ) + ((x - current_x) * 5);
      var top = (parseInt(topoRect.style.top) + 15 ) + ((y - current_y) * 5);
      var width = 68;
      var height = 68;
      var margin_left = -31;
      var margin_top = -31;
      var image = topoRect.parentNode.getElementsByTagName('input')[0];
      }
    else if(level == 3)
      {
      var left = (parseInt(topoRect.style.left) + 15 ) + ((x - current_x) * 5);
      var top = (parseInt(topoRect.style.top) + 15 ) + ((y - current_y) * 5);
      var width = 88;
      var height = 88;
      var margin_left = -41;
      var margin_top = -41;
      var image = topoRect.parentNode.getElementsByTagName('input')[0];
      }

    if(top < 0 || left < 0 || top > image.clientHeight || left > image.clientWidth)
      {
      render = false;
      }

    var div = document.createElement('div');
    div.setAttribute('style','position:absolute; height:'+height+'px; width:'+width+'px; margin-left:'+margin_left+'px; margin-top:'+margin_top+'px; background:transparent 0px 0px no-repeat url('+this.srcs.radius[level][colour]+'); opacity:0.8; ');
    div.style.left = left + 'px';
    div.style.top = top + 'px';
    div.setAttribute('id',id);
    if(render)
      {
      //topoRect.previousSibling.appendChild(div);
      div.style.left = left + parseInt( rel_left(topoRect.previousSibling) ) + 'px';
      div.style.top = top + parseInt( rel_top(topoRect.previousSibling) ) + 'px';

      document.getElementsByTagName('body')[0].appendChild(div);
      }
    }

  this.current.objects.radius[id] = { 'x' : x , 'y' : y , 'colour' : colour, 'level' : level, 'object' : div , 'render' : render };
  return id;
  };

_map.prototype.removeRadius = function(x,y)
  {
  if(x && !y) // ID
    {
    var id = x;
    if(this.current.objects.radius[id])
      {
      if(this.current.objects.radius[id].object && this.current.objects.radius[id].object.parentNode)
        this.current.objects.radius[id].object.parentNode.removeChild(this.current.objects.radius[id].object);
      delete this.current.objects.radius[id];
      return true;
      }
    else
      return false;
    }
  else if(x === false && y)  // Colour
    {
    var colour = y;
    for(var attr in this.current.objects.radius)
      {
      if(this.current.objects.radius[attr] && this.current.objects.radius[attr]['colour'] == colour)
        {
        if(this.current.objects.radius[attr].object&& this.current.objects.radius[attr].object.parentNode)
          this.current.objects.radius[attr].object.parentNode.removeChild(this.current.objects.radius[attr].object);
        delete this.current.objects.radius[attr];
        return true;
        }
      }
    return false;
    }
  else   // Co-ords
    {
    for(var attr in this.current.objects.radius)
      {
      if(this.current.objects.radius[attr]['x'] == x && this.current.objects.radius[attr]['y'] == y)
        {
        if(this.current.objects.radius[attr].object&& this.current.objects.radius[attr].object.parentNode)
          this.current.objects.radius[attr].object.parentNode.removeChild(this.current.objects.radius[attr].object);
        delete this.current.objects.radius[attr];
        return true;
        }
      }
    return false;
    }

  };

_map.prototype.exportRadius = function()
  {
  var ar = new Array();
  for(var attr in this.current.objects.radius)
    {
    var obj = this.current.objects.radius[attr];
    ar.push(obj.x+','+obj.y+','+obj.colour+','+obj.level);    // x,y,colour,level
    }
  return ar.join(';');
  };





function newRadius()
  {
  if(document.getElementById('inputx'))
    {
    var x = parseInt(document.getElementById('inputx').value);
    var y = parseInt(document.getElementById('inputy').value);
    }
  else if(document.getElementsByClassName('vis left')[0])
    {
    var tr = document.getElementsByClassName('vis left')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].nextElementSibling;  // ('tr')[1] => Problem with "DS - Unterstützter Spieler"
    var td = tr.getElementsByTagName('td')[1];
    var str = td.firstChild.nodeValue;
    var ar = str.split('|');
    var x = parseInt(ar[0]);
    var y = parseInt(ar[1]);
    }
  else
    {
    return false;
    }

  var div = document.createElement('div');
  div.id = 'map_addon_dialog_'+(map.current.primaryKeys.dialog++);
  div.style.zIndex = (map.current.objects.dialog.zIndex++);
  div.style.position = 'absolute';
  div.style.left = '300px';
  div.style.top = '60px';
  div.style.minHeight = '50px';
  div.style.minWidth = '150px';
  div.style.background = '#F1EBDD';
  div.style.border = '3px solid #c1aa7b';
  div.style.padding = '2px';
  div.style.MozBorderRadius = '10px';
  document.getElementById('ds_body').appendChild(div);

  var title = document.createElement('div');
  title.style.background = '#c1aa7b';
  title.style.minHeight = '15px';
  title.style.margin = '-2px -2px 0px';
  title.style.color = 'Tomato';
  title.style.fontFamily = 'Comic Sans MS,monospace';
  title.appendChild(document.createTextNode('DS Kirchenradius - V'+version));
  div.appendChild(title);

  var table = document.createElement('table');

  var tr = document.createElement('tr');

  var td0 = document.createElement('td');
  td0.setAttribute('style','background:#DFCCA6; font-weight:bolder; ');
  td0.appendChild(document.createTextNode('Koordinaten:'));

  var td1 = document.createElement('td');
  td1.appendChild(document.createTextNode('x: '));
  var input_x = document.createElement('input');
  input_x.setAttribute('type','input');
  input_x.setAttribute('value',x);
  input_x.setAttribute('size',4);
  input_x.setAttribute('id','map_addon_dialog_input_x');
  input_x.style.border = '1px solid Silver';
  input_x.style.MozBorderRadius = '5px';
  td1.appendChild(input_x);

  var td2 = document.createElement('td');
  td2.appendChild(document.createTextNode(' y: '));
  var input_y = document.createElement('input');
  input_y.setAttribute('type','input');
  input_y.setAttribute('value',y);
  input_y.setAttribute('size',4);
  input_y.setAttribute('id','map_addon_dialog_input_y');
  input_y.style.border = '1px solid Silver';
  input_y.style.MozBorderRadius = '5px';
  td2.appendChild(input_y);

  tr.appendChild(td0);
  tr.appendChild(td1);
  tr.appendChild(td2);
  table.appendChild(tr);


  var tr = document.createElement('tr');

  var td0 = document.createElement('td');
  td0.setAttribute('style','background:#DFCCA6; font-weight:bolder; ');
  td0.appendChild(document.createTextNode('Kirchenstufe:'));

  var td1 = document.createElement('td');
  td1.setAttribute('colspan',2);

  var select_level = document.createElement('select');
  select_level.setAttribute('id','map_addon_dialog_input_level');

  var i = 4;
  while(--i)
    {
    var option = document.createElement('option');
    option.setAttribute('value',i);
    if(i == 2)
      option.setAttribute('selected','selected');
    option.appendChild(document.createTextNode(i));
    select_level.appendChild(option);
    }
  td1.appendChild(select_level);

  var hint = document.createElement('span');
  hint.appendChild(document.createTextNode(' Erste Kirche = Stufe 2'));
  hint.setAttribute('style','font-size:smaller; font-style:italic; font-family:Arial,sans-serif');
  td1.appendChild(hint);


  tr.appendChild(td0);
  tr.appendChild(td1);
  table.appendChild(tr);

  div.appendChild(table);


  var table = document.createElement('table');

  var i = 1;
  for(var attr in map.srcs.radius[2])
    {
    var tr = document.createElement('tr');
    var td = document.createElement('td');

    td.setAttribute('id','map_addon_dialog_slot_'+i);
    td.setAttribute('style','text-align:center; background-color:#F7EED3; ');
    td.style.border = '0px';
    td.style.MozBorderRadius = '5px';

    var colorBox = document.createElement('div');
    colorBox.setAttribute('style','background-color:'+attr+'; height:12px; width:12px; display:inline-block; ');
    colorBox.style.border = '0px';
    colorBox.style.MozBorderRadius = '5px';
    colorBox.setAttribute('title',attr);
    td.appendChild(colorBox);

    var empty = true;
    for(var p in map.current.objects.radius)
      {
      if(map.current.objects.radius[p]['colour'] == attr)
        {
        td.appendChild(document.createTextNode(' ' + map.current.objects.radius[p]['x']+'|'+map.current.objects.radius[p]['y']+' @ Stufe '+map.current.objects.radius[p]['level']));
        td.setAttribute('title',p);
        td.style.textAlign = 'left';
        empty = false;
        break;
        }
      }
    if(empty)
      {
      td.appendChild(document.createTextNode(' Slot '+i));
      td.style.color = 'Gray';
      }

    td.addEventListener('click',function() {
      var old = document.getElementById('map_addon_dialog_input_hidden_slot').value;
      if(old != '')
        {
        document.getElementById(old).style.backgroundColor = '#F7EED3';
        }
      this.style.backgroundColor = '#DFCCA6';
      document.getElementById('map_addon_dialog_input_hidden_slot').value = this.id;

      },false);

    td.addEventListener('dblclick',function() {
      if(this.style.color != 'Gray')
        {
        var obj = map.current.objects.radius[this.title];
        document.getElementById('map_addon_dialog_input_x').value = obj.x;
        document.getElementById('map_addon_dialog_input_y').value = obj.y;
        switch(obj.level) {
          case 3:
          document.getElementById('map_addon_dialog_input_level').options[0].selected = true;
          break;
          case 2:
          document.getElementById('map_addon_dialog_input_level').options[1].selected = true;
          break;
          case 1:
          document.getElementById('map_addon_dialog_input_level').options[2].selected = true;
          }
        }

      },false);

    tr.appendChild(td);
    table.appendChild(tr);
    i++;
    }

  div.appendChild(table);

  var input_hidden_slot = document.createElement('input');
  input_hidden_slot.setAttribute('type','hidden');
  input_hidden_slot.setAttribute('value','');
  input_hidden_slot.setAttribute('id','map_addon_dialog_input_hidden_slot');
  div.appendChild(input_hidden_slot);

  var input_save = document.createElement('input');
  input_save.setAttribute('type','button');
  input_save.setAttribute('value','Speichern');
  input_save.addEventListener('click',registerRadius,false);
  div.appendChild(input_save);

  var input_cancel = document.createElement('input');
  input_cancel.setAttribute('type','button');
  input_cancel.setAttribute('value','Abbrechen');
  input_cancel.addEventListener('click',function() { div.parentNode.removeChild(div); },false);
  div.appendChild(input_cancel);

  var input_delete = document.createElement('input');
  input_delete.setAttribute('type','button');
  input_delete.setAttribute('value','L'+String.fromCharCode('0246')+'schen');
  input_delete.addEventListener('click',unregisterRadius,false);
  div.appendChild(input_delete);

  var subtitle = document.createElement('div');
  subtitle.style.background = '#c1aa7b';
  subtitle.style.minHeight = '5px';
  subtitle.style.margin = ' 0px -2px -2px';
  subtitle.style.color = 'Black';
  subtitle.style.fontSize = 'Smaller';
  subtitle.style.fontFamily = 'Times New Roman,Serif';
  subtitle.style.textAlign = 'center';
  subtitle.appendChild(document.createTextNode( String.fromCharCode('0169') + ' example.com'));
  subtitle.addEventListener('click',function() {
  if(confirm('DS Foren Thread besuchen?'))
    document.location.href = 'http://forum.die-staemme.de/showthread.php?t=103826';
  else if(confirm('userscripts.org besuchen?'))
    document.location.href = 'http://userscripts.org/scripts/show/45279';

  },false);
  div.appendChild(subtitle);

  div.scrollIntoView();
  dragable(div,'17');
  }

function registerRadius()
  {
  var x = parseInt(document.getElementById('map_addon_dialog_input_x').value);
  var y = parseInt(document.getElementById('map_addon_dialog_input_y').value);
  var colour = document.getElementById('map_addon_dialog_input_hidden_slot').value;
  var level = parseInt(document.getElementById('map_addon_dialog_input_level').options[document.getElementById('map_addon_dialog_input_level').selectedIndex].value);

  if(colour == '')
    return false;
  else
    colour = document.getElementById(colour).getElementsByTagName('div')[0].title;

  map.removeRadius(false,colour);

  map.addRadius( x , y , colour , level );

  setValue('radius',map.exportRadius());

  this.parentNode.parentNode.removeChild(this.parentNode);

  if(document.getElementsByClassName('vis left')[0])   // Redirect from village info to map
    {
    document.location.search = document.location.search.replace('screen=info_village','screen=map');
    }

  return true;
  }

function unregisterRadius()
  {
  var colour = document.getElementById('map_addon_dialog_input_hidden_slot').value;

  if(colour == '')
    return false;
  else
    colour = document.getElementById(colour).getElementsByTagName('div')[0].title;

  if(!confirm('Wirklich l'+String.fromCharCode('0246')+'schen?'))
    return false;

  map.removeRadius(false,colour);

  setValue('radius',map.exportRadius());

  this.parentNode.parentNode.removeChild(this.parentNode);
  return true;
  }


//################# Procedural Code ##################

var url = document.location.href;
var world = url.split('.').shift().split('de').pop();

var radius_active = getValue('active')==undefined?true:(getValue('active')?true:false);

if(url.indexOf('screen=map') != -1)     // Map
  {
  // Add Checkbox:
  var checkbox = document.createElement('input');
  checkbox.setAttribute('type','checkbox');
  checkbox.setAttribute('id','script_radius_active');
  if(radius_active)
    checkbox.setAttribute('checked','checked');
  checkbox.addEventListener('click',function() {
      if(this.checked)
        {
        setValue('active',true);
        }
      else
        {
        setValue('active',false);
        }

     var oldonclick = document.getElementById('belief_radius').getAttribute('onclick'); //javascript:map_toggle_belief_radius(this, '7cf8', '375', '546')
     var match = oldonclick.match(/'(\w+)', '(\d+)', '(\d+)'/);

     var para = {
       'h' : match[1],
       'x' : match[2],
       'y' : match[3] }

     unsafeWindow.change_url_by_parameters(para);

    },false);

  var label = document.createElement('label');
  label.setAttribute('for','script_radius_active');
  label.appendChild(document.createTextNode('Script anzeigen'));

  var belief_radius = document.getElementById('belief_radius');
  belief_radius.parentNode.insertBefore(checkbox,belief_radius);
  belief_radius.parentNode.insertBefore(label,belief_radius);
  belief_radius.parentNode.insertBefore(document.createElement('br'),belief_radius);



  var map = new _map();

  // Add radiuses
  if(radius_active) {
    var radiuses_string = getValue('radius');
    var radiuses_array = radiuses_string?radiuses_string.split(';'):[];
    var radiuses = new Array();
    for(var i = 0; i < radiuses_array.length; i++)
      {
      if(radiuses_array[i])
        {
        var radius = radiuses_array[i].split(',');
        radiuses.push(map.addRadius( parseInt(radius[0]) , parseInt(radius[1]) , radius[2] , parseInt(radius[3]) ));    // x,y,colour,level
        }
      }
    }

  // Add Button
  var tr = document.getElementById('inputy').parentNode.parentNode.parentNode.appendChild(document.createElement('tr'));
  var td = tr.appendChild(document.createElement('tr'));
  td.setAttribute('colspan',2);

  var input = document.createElement('input');
  input.setAttribute('type','button');
  input.setAttribute('value',String.fromCharCode( '0187' )+' Glaubensradius '+String.fromCharCode( '0171' ));
  input.setAttribute('style','font-size: 10pt;');
  input.addEventListener('click',newRadius,false);
  td.appendChild(input);
  }

else if(url.indexOf('screen=info_village') != -1)     // Village Info
  {
  var map = new _map();

  // Add radiuses (to memory)

  var radiuses_string = getValue('radius');
  var radiuses_array = radiuses_string?radiuses_string.split(';'):[];
  var radiuses = new Array();
  for(var i = 0; i < radiuses_array.length; i++)
    {
    if(radiuses_array[i])
      {
      var radius = radiuses_array[i].split(',');
      radiuses.push(map.addRadius( parseInt(radius[0]) , parseInt(radius[1]) , radius[2] , parseInt(radius[3]) ));    // x,y,colour,level
      }
    }

  var table = document.getElementsByClassName('vis left')[0].getElementsByTagName('tbody')[0];
  var trs = table.getElementsByTagName('tr');
  var Ltr = trs[trs.length-1];
  var tr = table.appendChild(Ltr.cloneNode(true));

  // Add Link

  tr.getElementsByTagName('a')[0].href = '#';
  var len = tr.getElementsByTagName('a')[0].firstChild.nodeValue.length;
  tr.getElementsByTagName('a')[0].firstChild.replaceData(2,len,'Glaubensradius simulieren');
  tr.getElementsByTagName('a')[0].addEventListener('click',newRadius,false);
  }