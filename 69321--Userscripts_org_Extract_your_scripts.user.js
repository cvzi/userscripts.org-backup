// ==UserScript==
// @name           Userscripts.org - Extract your scripts
// @namespace      example.com
// @description    Adds a link to the pagination, which creates a JSON object of your scripts from the data of the following page: http://userscripts.org/home/scripts
// @version        1.1
// @homepage       http://example.com
// @copyright      2009-2010, cuzi (http://example.com)
// @license        CC Attribution-Noncommercial-Share Alike 3.0 Germany; http://creativecommons.org/licenses/by-nc-sa/3.0/de/legalcode
// @include        http://userscripts.org/home/scripts*
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


var GMVAR_extracting = GM_getValue('extracting',false);
var GMVAR_result = GM_getValue('result','[]');


var pagination = document.getElementsByClassName('pagination')[0];


var a = document.createElement('a');
a.setAttribute('href','#');
a.appendChild(document.createTextNode('Extract'));
a.addEventListener('click',startExtraction,false);

pagination.appendChild(document.createTextNode(' '));
pagination.appendChild(a);


if(GMVAR_extracting)
  {
  var table = document.getElementsByClassName('wide forums')[0];
  if(!table)
    {
    GM_setValue('extracting',false);
    showResult();
    }
  else
    {
    var new_result = ExtractScripts();

    var result = JSON.parse(GMVAR_result);

    for(var i = 0, len = new_result.length; i < len; i++)
      {
      result.push(new_result[i]);
      }

    GM_setValue('result',JSON.stringify(result));

    document.location.href = 'http://userscripts.org/home/scripts?page=' + (parseInt(document.location.href.split('=')[1])+1);
    }
  }


function showResult()
  {
  var result = JSON.parse(GMVAR_result);

  var objs = [];

  for(var i = 0, len = result.length; i < len; i++)
    {
    objs.push(JSON.stringify(result[i]));
    }

  var output = '[\n  '+objs.join(',\n\n  ')+'\n]';

  output += '\n\n\n################################## Now without line breaks : ###################\n\n';


  var pre = document.createElement('pre');
  pre.appendChild(document.createTextNode(output));

  var textarea = document.createElement('textarea');
  textarea.appendChild(document.createTextNode(GMVAR_result));
  pre.appendChild(textarea);

  pagination.parentNode.insertBefore(pre,pagination.nextSibling);
  }


function startExtraction(e)
  {
  GM_setValue('extracting',true);
  GM_setValue('result','[]');
  document.location.href = 'http://userscripts.org/home/scripts?page=1';
  }


function ExtractScripts()
  {
  var table = document.getElementsByClassName('wide forums')[0];
  var tr = table.getElementsByTagName('tr');

  var objs = new Array();

  for(var i = 1, len = tr.length; i < len; i++)
    {
    var td = tr[i].getElementsByTagName('td');

    var id = tr[i].getAttribute('id').split('-').pop();

    var name = td[0].getElementsByClassName('title')[0].firstChild.nodeValue;
    var desc = td[0].getElementsByClassName('desc')[0].firstChild?td[0].getElementsByClassName('desc')[0].firstChild.nodeValue:'';
    var installs = parseInt(td[5].firstChild.nodeValue);
    var update = td[6].getElementsByClassName('updated')[0].getAttribute('title');
    objs.push({'id':id,'name':name,'desc':desc,'installs':installs,'update':update});
    }

  return objs;
  }
