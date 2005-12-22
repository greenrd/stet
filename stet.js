// Copyright 2005, Software Freedom Law Center, Inc.
//
// This program is free software: you may copy, modify, or redistribute it
// and/or modify it under the terms of the GNU Affero General Public
// License as published by the Free Software Foundation, either version 3
// of the License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License and/or GNU General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// and the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.
//

// Based on some work from http://www.quirksmode.org/js/selected.html
// That work was copyrighted by Peter-Paul Koch.
//  His license is:
//     You may copy, tweak, rewrite, sell or lease any code example on this site.

// Copyright (C) 2005 Software Freedom Law Center
// Author: Orion Montoya <orion@mdcclv.com>

function XpathSel() {
  var textObj = '';
  var start = '';
  var end = '';
  if (window.getSelection)
    {
      textObj = window.getSelection();
      
    }
  else if (document.getSelection)
    {
      textObj= document.getSelection();
    }
  else if (document.selection)
    {
      textObj= document.selection.createRange().text;
    }
  else return;

      startNode = textObj.anchorNode.parentNode;
      startid= startNode.id;
      start = startNode.nodeName;
      
      endnode = textObj.focusNode.parentNode;
      endid = endnode.id;
      end = endnode.nodeName;
  

    for (var oStr='' ; startNode && startNode.nodeName != '#document'; startNode=startNode.parentNode) { 
      if (startNode.nodeName!='#text') { 
	oStr = startNode.nodeName 
	+ (startNode.id?('[id='+startNode.id+']'):'')
	+ (oStr?('/'+oStr):'');
      }
    }
	myNoteIfy = createNoteDiv();
	textString = textObj.toString();

	//	highlightWord(startNode,textString,'','','');

	thisNode = document.getElementById(startid);

	if ((thisNode.previousSibling) && (thisNode.previousSibling.previousSibling) && (thisNode.previousSibling.previousSibling.appendChild)) {
	thisNode.previousSibling.previousSibling.appendChild(myNoteIfy);
	}
	else 
if ((thisNode.previousSibling) && (thisNode.previousSibling.appendChild)) {
	thisNode.previousSibling.appendChild(myNoteIfy);
	}
	else {
	thisNode.appendChild(myNoteIfy);
	}
	document.getElementById('DomPath').value = oStr;
//	document.getElementById('DomPathTxt').innerHTML = 'xpath: <strong>'+oStr+'</strong>';
	document.getElementById('Selection').value = textString;
	document.getElementById('SelectionTxt').innerHTML = 'comment on: <strong>'+textString+'</strong>';
//	document.getElementById('NoteText').value = startid;
	document.getElementById('StartNodeId').value = startid;
	document.getElementById('EndNodeId').value = endid;
	document.getElementById('StartNode').value = start;
	document.getElementById('EndNode').value = end;
	document.getElementById('NoteUrl').value = location.href;
	//	document.getElementById('cancel').setAttribute('parent',startid);



//    location.href='http://localhost/cgi-bin/stet-submit.pl?url='+escape(location.href)+'&dompath='+oStr+'&selectedtext='+escape(textObj)+'&start='+escape(start)+'&startid='+escape(startid)+'&end='+escape(end)+'&endid='+escape(endid);;

}

function submitComment() {

var form = document.getElementById('noteify');
 var noteText = form.NoteText.value;
 form.NoteText.value = "OK, submitting...";
 form.NoteText.style.background = '#aaa';
 form.style.background = '#aaa';

var params = encodeURI('DomPath='+form.DomPath.value+'&amp;Selection='+form.Selection.value+'&amp;NoteText='+noteText+'&amp;StartNode='+form.StartNode.value+'&amp;EndNode='+form.EndNode.value+'&amp;StartNodeId='+form.StartNodeId.value+'&amp;EndNodeId='+form.EndNodeId.value+'&amp;NoteUrl='+location.href);

var pyparams = encodeURI('custom_note_dom_path='+form.DomPath.value+'&amp;custom_note_selection='+form.Selection.value+'&amp;custom_start_node='+form.StartNode.value+'&amp;custom_end_node='+form.EndNode.value+'&amp;custom_note_start_node_id='+form.StartNodeId.value+'&amp;custom_note_end_node_id='+form.EndNodeId.value+'&amp;custom_note_url='+location.href+'&amp;description='+noteText+'&amp;summary='+form.Selection.value+'&amp;reporter=moglen@columbia.edu&amp;mode=newticket&amp;action=create&amp;status=new&amp;component=component1&amp;severity=normal&amp;submit=create');



//oStr = document.getElementById('DomPath').value;
//textObj = document.getElementById('Selection').value;
//startid = document.getElementById('NoteText').value;
//noteSelection = document.getElementById('StartNodeId').value;
//endid = document.getElementById('EndNodeId').value;
//start = document.getElementById('StartNode').value;
//end = document.getElementById('EndNode').value;

//http://localhost/cgi-bin/stet-submit.pl?DomPath=&Selection=&NoteText=&StartNode=&EndNode=&StartNodeId=&EndNodeId&NoteUrl=

//var theUrl = 'http://localhost/cgi-bin/stet-submit.pl?NoteUrl='+escape(location.href)+'&DomPath='+oStr+'&Selection='+escape(textObj)+'&StartNode='+escape(start)+'&StartNodeId='+escape(startid)+'&EndNode='+escape(end)+'&EndNodeId='+escape(endid);
//dump('would open '+theUrl+"\n");
var theUrl = 'http://localhost/cgi-bin/stet-submit.pl'+'?'+params;

//highlightWord(form.StartNode.value,form.Selection.value,noteText,'');
loadXMLDoc(theUrl);
//cancelNote("noteify")

//window.location = 'http://trac.localdomain.org/trac.cgi'+'?'+pyparams;
}

function toggle(myClass) {

var toggleUs = getElementsByClass(myClass);
for (var i=0; i < toggleUs.length; i++) {
//	if (toggleUs[i].style.display == 'inline') {
		toggleUs[i].style.display='none';
//		}
//	else if (toggleUs[i].style.display == 'none') {
//		toggleUs[i].style.display='inline';
//		}
	}
}

function getElementsByClass(needle)
{
  var         my_array = document.getElementsByTagName('*');
  var         retvalue = new Array();
  var        i;
  var        j;

  for (i = 0, j = 0; i < my_array.length; i++)
  {
    var c = " " + my_array[i].className + " ";
    if (c.indexOf(" " + needle + " ") != -1) {
      retvalue[j++] = my_array[i];
    }
  }
  return retvalue;
}


// help from http://www.xml.com/pub/a/2005/02/09/xml-http-request.html

var req;

function loadXMLDoc(url) 
{
    // branch for native XMLHttpRequest object
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        req.onreadystatechange = processReqChange;
	//	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        req.open("GET", url, true); // true = asynchronous
        req.send(null);
    // branch for IE/Windows ActiveX version
    } else if (window.ActiveXObject) {
        req = new ActiveXObject('Microsoft.XMLHTTP');
        if (req) {
            req.onreadystatechange = processReqChange;
            req.open("GET", url, true);
            req.send();
        }
    }
}

function processReqChange() 
{
    // only if req shows "complete"
    if (req.readyState == 4) {
        // only if "OK"
        if (req.status == 200) {
	  cancelNote("noteify");
//	dump(req.responseText);
	response  = req.responseXML.documentElement;
	//foo_arr = response.getElementsByTagName("annotation");
//	dump(req.responseXML+"\n");
//	dump(foo_arr + ' ' + foo_arr.length + ' ' + foo_arr.item(1)+"\n");

	selections_arr = response.getElementsByTagName("s");
//	dump(selections_arr + ' ' + selections_arr.length + ' ' + selections_arr.item(0)+"\n");
	startnodes_arr = response.getElementsByTagName("i");
	annotations_arr = response.getElementsByTagName("n");
	rtids_arr = response.getElementsByTagName("id");
	for (i = 0; i < selections_arr.length; i++) {
//		dump("n "+i+"="+annotations_arr[i].firstChild.innerHTML+"\n");
		startNode = startnodes_arr[i].firstChild.data;
        	noteSelection = selections_arr[i].firstChild.data;
		annoteText = annotations_arr[i];
//		if (annotations_arr[i].firstChild.nextSibling) {
//		annoteText += annotations_arr[i].firstChild.toString();
//		}
		
		rtid = rtids_arr[i] ? rtids_arr[i].firstChild.data : "";

		//dump("highlighting "+startNode+' '+noteSelection+' '+annoteText+"\n"); // debug
		highlightWord(document.getElementById(startNode),noteSelection,annoteText,rtid);

	//        eval(method + '(\'\', result)');
	}
	unOverlap("annotation",5);
	

    } else {
      //        dump("There was a problem retrieving the XML data:\n" + req.statusText+"\n"); //debug
        }
    }
    //	else { dump("readyState was "+req.readyState+"\n"); } // debug

}



function postNote(xpath,selection,note) {




}

function onNoteifyMouseover() {
//this.onblur = onNoteifyBlur;

}

function onNoteifyBlur() {
	noteNode = document.getElementById('noteify');
//	dump(noteNode);

//  window.location = 'http://localhost/cgi-bin/stet-submit.pl?foo=bar';
}

function checkKeyPressed(keyEvent) {
  if (!document.getElementById("noteify")) {
	  keyEvent = (keyEvent) ? keyEvent : (window.event) ? event : null;
	  if (keyEvent) {
		var charCode = (keyEvent.charCode) ? keyEvent.charCode :
					   ((keyEvent.keyCode) ? keyEvent.keyCode :
					   ((keyEvent.which) ? keyEvent.which : 0));
		//dump(charCode);
		if (charCode == 99) { XpathSel(); }
	
	  }
  }
}

function cancelNote(div) {
  if (cancelme = document.getElementById(div)) {
    cancelme.parentNode.removeChild(cancelme);
  }
}

function createNoteDiv() {

var noteifyDiv = document.createElement('form');
noteifyDiv.setAttribute('action','http://localhost/cgi-bin/stet-submit.pl');
noteifyDiv.setAttribute('class','noteify');
noteifyDiv.setAttribute('id','noteify');
noteifyDiv.setAttribute('name','noteify');
// noteifyDiv.style.z-index = '100';

var DomPathTxt = document.createElement('span');
DomPathTxt.setAttribute('id','DomPathTxt');
DomPathTxt.setAttribute('name','DomPathTxt');

var DomPath = document.createElement('input');
DomPath.setAttribute('id','DomPath');
DomPath.setAttribute('name','DomPath');
DomPath.setAttribute('type','hidden');

var SelectionTxt = document.createElement('span');
SelectionTxt.setAttribute('id','SelectionTxt');
SelectionTxt.setAttribute('name','SelectionTxt');

var Selection = document.createElement('input');
Selection.setAttribute('id','Selection');
Selection.setAttribute('name','Selection');
Selection.setAttribute('type','hidden');

var NoteText = document.createElement('textarea');
NoteText.setAttribute('id','NoteText');
NoteText.setAttribute('name','NoteText');
NoteText.setAttribute('rows','10');
NoteText.setAttribute('cols','30');

var StartNode = document.createElement('input');
StartNode.setAttribute('id','StartNode');
StartNode.setAttribute('name','StartNode');
StartNode.setAttribute('type','hidden');

var EndNode = document.createElement('input');
EndNode.setAttribute('id','EndNode');
EndNode.setAttribute('name','EndNode');
EndNode.setAttribute('type','hidden');

var StartNodeId = document.createElement('input');
StartNodeId.setAttribute('id','StartNodeId');
StartNodeId.setAttribute('name','StartNodeId');
StartNodeId.setAttribute('type','hidden');

var EndNodeId = document.createElement('input');
EndNodeId.setAttribute('id','EndNodeId');
EndNodeId.setAttribute('name','EndNodeId');
EndNodeId.setAttribute('type','hidden');

var NoteUrl = document.createElement('input');
NoteUrl.setAttribute('id','NoteUrl');
NoteUrl.setAttribute('name','NoteUrl');
NoteUrl.setAttribute('type','hidden');

var DocRevision = document.createElement('input');
DocRevision.setAttribute('id','DocRevision');
DocRevision.setAttribute('name','DocRevision');
DocRevision.setAttribute('type','hidden');

var cancel = document.createElement('input');
cancel.setAttribute('type','button');
cancel.setAttribute('id','cancel');
cancel.setAttribute('name','cancel');
cancel.setAttribute('value','cancel');
cancel.setAttribute('onClick','cancelNote("noteify")');
cancel.setAttribute('class','annoteButton');

var theBR = document.createElement('br');

var submit = document.createElement('input');
submit.setAttribute('type','button');
submit.setAttribute('value','submit');
//submit.onclick = 'dump("clicked submit")';
submit.setAttribute('onClick','submitComment()');
submit.setAttribute('class','annoteButton');

noteifyDiv.appendChild(DomPathTxt);
noteifyDiv.appendChild(DomPath);
noteifyDiv.appendChild(theBR);
noteifyDiv.appendChild(SelectionTxt);
noteifyDiv.appendChild(Selection);
noteifyDiv.appendChild(theBR);
noteifyDiv.appendChild(NoteText);
noteifyDiv.appendChild(StartNode);
noteifyDiv.appendChild(EndNode);
noteifyDiv.appendChild(StartNodeId);
noteifyDiv.appendChild(EndNodeId);
noteifyDiv.appendChild(NoteUrl);
noteifyDiv.appendChild(DocRevision);
noteifyDiv.appendChild(theBR);
noteifyDiv.appendChild(submit);
noteifyDiv.appendChild(cancel);

return noteifyDiv;

}



function highlightWord(node,word,tooltip,rtid,altClass) {

/* this code is basically no longer descended from: */
/*                                                 */
/* http://www.kryogenix.org/code/browser/searchhi/ */
/*                             */
/* but it started out that way ... */

  var haveHighlighted = false;
  //dump("doing highlightword of "+word+"\n");
  if (node.hasChildNodes) {
    var iCN;
    //dump("this node has "+node.childNodes.length+" childNodes\n");
    for (iCN=0;iCN<node.childNodes.length;iCN++) {
      //dump("going in to "+node.childNodes[iCN].nodeName+"\nfor "+word+" iCN="+iCN+"\n");
      highlightWord(node.childNodes[iCN],word,tooltip,rtid);
    }
  }
  if (node.nodeType == 3) { // text node
//    dump("node is "+node.parentNode.id+"\n");
    if (!haveHighlighted) {
      //dump("haven't highlighted\n");
    paragraph = node.parentNode.parentNode;
    paragraphString = (new XMLSerializer).serializeToString(paragraph);
    paragraphString.replace(/\s+/g,' ');
    tempNodeVal = paragraphString;
    tempWordVal = word;
    //tempWordVal = tempWordVal.replace(/\W+/g,'[\\W\\s]+(<[^>]+>)?');
    tempWordVal = tempWordVal.replace(/\W+/g,'[^<]*(<[^>]+>)*');

    var re = new RegExp(tempWordVal, 'mi');
	//    var re = new RegExp("software", 'mig');
    //dump("re is "+re+"\n");
    tooltipString = (new XMLSerializer).serializeToString(tooltip);
    var ticketLink = rtid ? '<a href="/rt/Ticket/Display.html?id='+rtid+'">[+]</a>' : '[reload for ticket link]';
    
    paragraphString = paragraphString.replace(re,'<span class="highlight" id="note.'+rtid+'.'+node.parentNode.id+'">$&<span class="annotation" id="rt'+rtid+'" onmousedown="dragStart(event,\'rt'+rtid+'\')">'+tooltipString+" "+ticketLink+' </span></span>');
    //     dump("replaced on "+$&+"\n");
    //dump("pString is now "+paragraphString+"\n");
    node.parentNode.parentNode.innerHTML = paragraphString;
    
    //    haveHighlighted=true;
    }
  }
  // dump(getCookie("__ac"));
}

function unOverlap(cls,gapDesired) {
items = getElementsByClass(cls);

 for (i = 0; i< (items.length - 1); i++) {
   //dump("doing item "+i+", a "+items[i]+"\n");
   iheight =parseInt(document.defaultView.getComputedStyle(items[i], '').getPropertyValue("height"));
   ibottom = parseInt(parseInt(items[i].offsetTop) + parseInt(iheight));
   //dump("iheight is "+iheight+" ibottom is "+ibottom+"\n");
   items[i+1].style.top = items[i+1].offsetTop+"px";
   //dump("next offsetTop is "+items[i+1].offsetTop+" ibootom is "+ibottom+"\n");

   diff = parseInt(ibottom) - parseInt(items[i+1].style.top);
   //dump("diff is "+diff+"\n");
   if (diff >= 0) {
     items[i+1].style.top = parseInt(parseInt(items[i+1].style.top)+parseInt(diff)+parseInt(gapDesired))+"px";
     //     dump("items[i+1].style.top = "+parseInt(items[i+1].style.top)+"+"+diff+"+"+gapDesired+"\n");
     //     dump("top is now "+items[i+1].style.top+"\n");
   }
 }
}


//* dragging behavior courtesy of brainjar.com.  License is GPL2+

//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

// Determine browser and version.

function Browser() {

  var ua, s, i;

  this.isIE    = false;
  this.isNS    = false;
  this.version = null;

  ua = navigator.userAgent;

  s = "MSIE";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  // Treat any other "Gecko" browser as NS 6.1.

  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }
}

var browser = new Browser();

// Global object to hold drag information.

var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(event, id) {

  var el;
  var x, y;

  // If an element id was given, find it. Otherwise use the element being
  // clicked on.

  if (id)
    dragObj.elNode = document.getElementById(id);
  else {
    if (browser.isIE)
      dragObj.elNode = window.event.srcElement;
    if (browser.isNS)
      dragObj.elNode = event.target;

    // If this is a text node, use its parent element.

    if (dragObj.elNode.nodeType == 3)
      dragObj.elNode = dragObj.elNode.parentNode;
  }

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Save starting positions of cursor and element.

  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;

  dragObj.elStartLeft  = parseInt(dragObj.elNode.offsetLeft, 10);
  dragObj.elStartTop   = parseInt(dragObj.elNode.offsetTop,  10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

  // Update element's z-index.

  dragObj.elNode.style.zIndex = ++dragObj.zIndex;

  // Capture mousemove and mouseup events on the page.

  if (browser.isIE) {
    document.attachEvent("onmousemove", dragGo);
    document.attachEvent("onmouseup",   dragStop);
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS) {
    document.addEventListener("mousemove", dragGo,   true);
    document.addEventListener("mouseup",   dragStop, true);
    event.preventDefault();
  }
}

function dragGo(event) {

  var x, y;

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Move drag element by the same amount the cursor has moved.
  //  dump("left starts as "+dragObj.elStartLeft+"; top starts as "+dragObj.elStartTop+"\n");
  //  dump("x is "+x+" and y is "+y+"\n");

//  dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
//  dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";

dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
dragObj.elNode.style.top  = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";



//  dump("left is now "+dragObj.elNode.style.left+"; top is now "+dragObj.elNode.style.top+"\n");

  if (browser.isIE) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS)
    event.preventDefault();
}

function dragStop(event) {

  // Stop capturing mousemove and mouseup events.

  if (browser.isIE) {
    document.detachEvent("onmousemove", dragGo);
    document.detachEvent("onmouseup",   dragStop);
  }
  if (browser.isNS) {
    document.removeEventListener("mousemove", dragGo,   true);
    document.removeEventListener("mouseup",   dragStop, true);
  }
}

/* cookie stuff also from Brainjar 2001, see above and */
/* http://www.brainjar.com for terms of use (GPL2+)    */

function createCookie(name,value,days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function saveIt(name)
{
	var x = document.forms[0].cookievalue.value;
	if (!x)
		alert('Please fill in a value in the input box.');
	else
		createCookie(name,x,7);
}
function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i<ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name)
{
	createCookie(name,"",-1);
}

function readIt(name)
{
	alert('The value of the cookie is ' + readCookie(name));
}

function eraseIt(name)
{
	eraseCookie(name);
	alert('Cookie erased');
}

// end of brainjar code


// http://www.webreference.com/js/column8/functions.html

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

function initPage() {
  loadXMLDoc('http://localhost/cgi-bin/rt-test.pl?NoteUrl='+location.href);
}


window.onload = initPage();
