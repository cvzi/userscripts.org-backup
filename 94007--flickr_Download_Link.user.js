// ==UserScript==
// @name           flickr Download Link
// @version        1.0
// @namespace      example.com
// @author         cuzi (http://example.com)
// @copyright      2011, cuzi
// @include        http://www.flickr.com/photos/*
// ==/UserScript==

var url = document.getElementsByTagName('link')[0].href;
url = url.substring(0,url.length-6)+'.jpg';

var li = document.createElement('li');
var a = document.createElement('a');
var span = document.createElement('span');
li.appendChild(a);
a.appendChild(span);
document.getElementById('button-bar').insertBefore(li,document.getElementById('button-bar-options').parentNode);

a.setAttribute('class','Butt ywa-track');
a.setAttribute('href',url);
span.appendChild(document.createTextNode('Download'));