// Copyright (C) 2005, 2006   Software Freedom Law Center, Inc.
// Author: Orion Montoya <orion@mdcclv.com>
//
// This software gives you freedom; it is licensed to you under version
// 3 of the GNU Affero General Public License, along with the
// additional permission in the following paragraph.
//
// This notice constitutes a grant of such permission as is necessary
// to combine or link this software, or a modified version of it, with
// Request Tracker (RT), published by Jesse Vincent and Best Practical
// Solutions, LLC, or a derivative work of RT, and to copy, modify, and
// distribute the resulting work.  RT is licensed under version 2 of
// the GNU General Public License.
// 
// This software is distributed WITHOUT ANY WARRANTY, without even the
// implied warranties of MERCHANTABILITY and FITNESS FOR A PARTICULAR
// PURPOSE.  See the GNU Affero General Public License for further
// details.
//  
// You should have received a copy of the GNU Affero General Public
// License, version 3, and the GNU General Public License, version 2,
// along with this software.  If not, see <http://www.gnu.org/licenses/>.

// Based on some work from http://www.quirksmode.org/js/selected.html
// That work was copyrighted by Peter-Paul Koch.
//  His license is:
//   You may copy, tweak, rewrite, sell or lease any code example on this site.


//if (!dump) {
//function dump() { }
//}

var ticketObj = new Object;
ticketObj.rtidsBySn = new Object;
var drafter = '';
var filename;

var base64Chars = new Array(
			    'A','B','C','D','E','F','G','H',
			    'I','J','K','L','M','N','O','P',
			    'Q','R','S','T','U','V','W','X',
			    'Y','Z','a','b','c','d','e','f',
			    'g','h','i','j','k','l','m','n',
			    'o','p','q','r','s','t','u','v',
			    'w','x','y','z','0','1','2','3',
			    '4','5','6','7','8','9','+','/'
			    );

var reverseBase64Chars = new Array();
for (var i=0; i < base64Chars.length; i++){
  reverseBase64Chars[base64Chars[i]] = i;
}


function initPage() {
  statusbox("Please wait while we load some comments.");
  filename = location.pathname.substring(location.pathname.lastIndexOf('/')+1,location.pathname.length); 
  if((!filename.length) || (filename.match(/index/)) || (filename.match(/comments$/)) || (filename.match(/debug/))) {
    filename = 'gplv3-draft-1';
  }
if(window.location.search.length) {
  // loadXMLDoc('/comments/rt/xmlresults.html',window.location.search.substring(1));
 loadXMLDoc('/comments/rt/xmlresults-compat.html',window.location.search.substring(1));
}
 else {
   loadXMLDoc('/comments/rt/xmlresults-compat.html','Query=+%27CF.NoteUrl%27+LIKE+%27'+filename+'%27+&RowsPerPage=25&Order=DESC');
 }
}

// XpathSel adapted from http://www.quirksmode.org/js/selected.html
function XpathSel() {
  alert("firing XpathSel");
  if (!readCookie('__ac')) {
    document.getElementById('login').setAttribute('style','color: red; font-weight: bold; font-size: 150%');
    return;
  }
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
      kObj = textObj.createRange();
    }
  else if (document.selection)
    {
      textObj= document.selection.createRange().text;
    }
  alert(textObj.toString()+' '+kObj);
    //   if(!textObj.length) {
  //document.getElementById('selectsome').setAttribute('class','error');
  //  document.getElementById('login').innerHTML(textObj.length);
  //  return;
  //}
  try { startNode = textObj.anchorNode; } catch(e) { alert(e); }

  try { startid = startNode.parentNode.id; } catch(e) { }
  try { start = startNode.parentNode.nodeName; } catch(e) { }
  try { startid; } catch(e) {
    alert("let's try another form from "+startNode);
    //    myNoteIfy = createNoteDiv();
    
    return;
  }  

      endnode = textObj.focusNode.parentNode;
      endid = endnode.id;
      end = endnode.nodeName;

      if (!readCookie('__ac')) {
	document.getElementById('login').setAttribute('style','color: red; font-weight: bold; font-size: 150%');
      }
      else {

	oStr = getDomPath(startNode);
	
	myNoteIfy = createNoteDiv();
	textString = textObj.toString();
	
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
    document.getElementById('Selection').value = textString;
    loadHTMLtoDiv('comment on: <strong>'+textString+'</strong>','SelectionTxt');
    //    document.getElementById('SelectionTxt').innerHTML = 'comment on: <strong>'+textString+'</strong>';
    document.getElementById('NoteSubj').value = 'Subject/summary [required]';
    document.getElementById('StartNodeId').value = startid;
    document.getElementById('EndNodeId').value = endid;
    document.getElementById('StartNode').value = start;
    document.getElementById('EndNode').value = end;
    document.getElementById('NoteUrl').value = filename;

    if(startid != endid) {
      document.getElementById('NoteText').value = 'Your selection does not begin and end in the same sentence.  Please cancel and try again with a shorter selection.  If you want to comment on a whole section, please highlight the section title instead';      
      document.getElementById('submitNote').setAttribute('disabled','disabled');
      document.getElementById('NoteSubj').setAttribute('disabled','disabled');
      //document.getElementById('NoteText').setAttribute('disabled','disabled');
    }
    if((startid =='login') || (startid == undefined)) {
      document.getElementById('NoteText').value = 'You\'ve found a browser-compatibility bug that we\'re trying to fix; we would appreciate an email to stet@gplv3.fsf.org saying exactly what browser you\'re using (though we know about Safari).  For the moment the best way to send your comment would be via email: see http://gplv3.fsf.org/comments/email.html';
      document.getElementById('submitNote').setAttribute('disabled','disabled');
      document.getElementById('NoteSubj').setAttribute('disabled','disabled');

    }

  }
}


function getDomPath(startNode) {
  // helped here by http://www.howtocreate.co.uk/emails/FlorianSauvin.html
  for (var oStr='' ; startNode && startNode.nodeName != '#document'; startNode=startNode.parentNode) { 
    if (startNode.nodeName!='#text') { 
      oStr = startNode.nodeName 
	+ (startNode.id ? ('[id='+startNode.id+']') : '')
	+ (oStr ? ('/'+oStr) : '');
    }
  }
  return oStr;
}

function submitComment() {
  
  if ((document.getElementById('NoteSubj').value == 'Subject/summary [required]') || (document.getElementById('NoteSubj').value == ' ')) {
    //    document.getElementById('SelectionTxt').innerHTML = '<span class="error">Please enter a brief explanatory subject for this comment</span>';

    loadHTMLtoDiv('<span class="error">Please enter a brief explanatory subject for this comment</span>','SelectionTxt');
  }
  else {
  
  var form = document.getElementById('noteify');
  var noteText = form.NoteText.value;
  loadHTMLtoDiv('Ok, submitting...','SelectionTxt');
  form.NoteText.style.background = '#aaa';
  form.NoteSubj.style.background = '#aaa';
  document.getElementById('submitNote').setAttribute('disabled','disabled');
  document.getElementById('cancel').setAttribute('disabled','disabled');
  form.style.background = '#aaa';

  var params = encodeURI('DomPath='+form.DomPath.value+'&amp;Selection='+encodeURIComponent(form.Selection.value)+'&amp;NoteSubj='+encodeURIComponent(form.NoteSubj.value)+'&amp;NoteText='+encodeURIComponent(noteText)+'&amp;StartNode='+form.StartNode.value+'&amp;EndNode='+form.EndNode.value+'&amp;StartNodeId='+form.StartNodeId.value+'&amp;EndNodeId='+form.EndNodeId.value+'&amp;NoteUrl='+location.href+'&map;queue='+form.queue.value);
  
  

  var theUrl = '/comments/rt/submitcomment-devel.html'; 
  //highlightWord(form.StartNode.value,form.Selection.value,noteText,'');   
  loadXMLDoc(theUrl,params);
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
function loadXMLDoc(url,theData) 
{
  //dump('loading '+url+'?'+theData+'\n');
  // branch for native XMLHttpRequest object
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  req.onreadystatechange = processReqChange;
  
  req.open("POST", url, true);
  //  req.open("GET", url, false);
  req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  req.setRequestHeader('X-Referer',document.location);
  //  theData = encodeURI(theData);
  req.send(theData);
}

function loadHTMLtoDiv(text,targetid,caller) {
  // this won't work in Safari so we need a Safari case:
  if(targetid) {
    //  dump('targetid is '+targetid);
  //  if(caller) { dump(', caller is '+caller);}
    //  dump('\n');
  if (myElement = document.getElementById(targetid)) {
	//	dump(e);
	try {	
	  myElement.innerHTML = text;
	}
	catch(e) {
	  var newDiv = document.createElement('span');
	  newDiv.innerHTML = text;
	  myElement.appendChild(newDiv);
	}
  }
  }
}

function glueXMLTogether(xmlToAdd, parentToAddItTo) {
  childrenOfParent = parentToAddItTo.childNodes;
  while (childrenOfParent.length > 0) {
    parentToAddItTo.removeChild(childrenOfParent.item(0));
  }
  parentToAddItTo.appendChild(xmlToAdd);
}

// thanks to http://www.mercurytide.com/knowledge/white-papers/issues-working-with-ajax
function getXMLNodeSerialisation(xmlNode) {
  //  alert(xmlNode);
  var text = false;
  try {
    // Gecko-based browsers, Safari, Opera.
    var serializer = new XMLSerializer();
    text = serializer.serializeToString(xmlNode);
  }
  catch (e) {
    try {
      // Internet Explorer.
      text = xmlNode.xml;
    }
    catch (e) {
      text = xmlNode.firstChild.data;
    }
  }
  return text;
}

function loadURLtoDiv(url,args,targetid) {
  // branch for native XMLHttpRequest object
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  req.open('GET',url,false);
  req.send(args);
  loadHTMLtoDiv(req.responseText,targetid,"loadurltodiv");
}

function processReqChange() 
{
  //  alert("doing PRC");
  // only if req shows "complete"
  if (req.readyState == 4) {
    // only if "OK"
    if (req.status == 200) {
      cancelNote("noteify");
      //alert(req.responseText);
      response  = req.responseXML.documentElement;
      var resp_arrN;
      var resp_arrA;
      var resp_arrF;
	try {
	      drafter = response.getElementsByTagName("d")[0].firstChild.data;
	}
	catch (e) {}
	//alert("about to call cstatusbox");
	try { cs = response.getElementsByTagName("cs"); } catch(e) {}

      cstatusbox(cs[0]);
      resp_arrN = response.getElementsByTagName("annotation");
      if(resp_arrN.length > 0) {
	//dump("processAnnot starting from "+resp_arrN[0].firstChild.data+"\n")
	  processAnnotation(response);
      }
/*       else if (resp_arrF = response.getElementsByTagName("form")) { */
/* 	dump("pre processNQ\n") */
/* 	  if(resp_arrF.length > 0) { */
/* 	    dump("processNQ starting from "+resp_arrF[0].firstChild.data+"\n") */
/* 	      processNewQuery(response); */
/* 	  } */
/*       } */

      else if (resp_arrA = response.getElementsByTagName("agreement")) {
	//dump("pre processAgree from"+resp_arrA[0].firstChild.data+"\n");
	if(resp_arrA.length > 0) {
	  //dump("processAgree\n");
	  processAgreement(response);
	}
      }

      else {
	statusbox("Your search didn't return anything usable: maybe there are no comments:  <a href=\"http://gplv3.fsf.org/comments/rt/changeshown.html\">search again</a>\n\n<br/>HTTP Status: " + req.statusText+""); //debug
      }
    }
  }
  //    else { dump("readyState was "+req.readyState+"\n"); } // debug
}
  
function onNoteifyMouseover() {
  //this.onblur = onNoteifyBlur;
  
}

function processAnnotation(response) {
  selections_arr = response.getElementsByTagName("s");
  // dump(selections_arr + ' ' + selections_arr.length + ' ' + selections_arr.item(0)+"\n");
  startnodes_arr = response.getElementsByTagName("i");
  annotations_arr = response.getElementsByTagName("n");
  rtids_arr = response.getElementsByTagName("id");
  users_arr = response.getElementsByTagName("u");
  uagr_arr = response.getElementsByTagName("ua");
  queues_arr = response.getElementsByTagName("qn");
  agrtot_arr = response.getElementsByTagName("at");

	for (prI = 0; prI < selections_arr.length; prI++) {
	  if (selections_arr[prI].firstChild) {
	    noteSelection = selections_arr[prI].firstChild.data;
	    
	    rtids_arr[prI].firstChild.data ? rtid = rtids_arr[prI].firstChild.data : rtid = "error";
	    //alert("calling gXNS at 350");
	    
	    try { var tooltipString = getXMLNodeSerialisation(annotations_arr[prI]); } catch(e) { alert(e); }
	    if (!tooltipString) { var tooltipString = annotations_arr[prI].firstChild.data; }
	    //	    alert("got here"+tooltipString+" "+annotations_arr[prI].firstChild.data);
	    tooltipString.length > 165 ? tooltipSubString = tooltipString.substr(0,199) + '...' : tooltipSubString = tooltipString;


	    
	    ticketObj[rtid] = new Object;

	    ticketObj[rtid].link = makeLinkObj(rtid, uagr_arr[prI], agrtot_arr[prI].firstChild.data);

	    ticketObj[rtid].full = tooltipString;
	    //alert("setting "+rtid+" excerpt to "+tooltipSubString);
	    ticketObj[rtid].excerpt = tooltipSubString;
	    ticketObj[rtid].user = users_arr[prI].firstChild ? users_arr[prI].firstChild.data : "";
	    ticketObj[rtid].startnode = startnodes_arr[prI].firstChild.data;
	    ticketObj[rtid].queue = queues_arr[prI].firstChild.data;


	    if(!ticketObj.rtidsBySn[ticketObj[rtid].startnode]) {
	      ticketObj.rtidsBySn[ticketObj[rtid].startnode] = new Array(rtid);
	    }
	    else {
	      ticketObj.rtidsBySn[ticketObj[rtid].startnode].push(rtid);
	    }
	    
	    //alert("calling gXNS at 376");
	    ticketObj[rtid].ua = getXMLNodeSerialisation(uagr_arr[prI]);
	    startNode = startnodes_arr[prI].firstChild.data;
	    startNode = startNode.replace(/note\.[0-9]+\./,'');
	    annoteText = annotations_arr[prI];
	    rtid = rtids_arr[prI] ? rtids_arr[prI].firstChild.data : "";
	    user = users_arr[prI].firstChild ? users_arr[prI].firstChild.data : "";
	    //		dump(users_arr[prI].firstChild.data);
	    //alert("startNode is '"+startNode+"'");
	    highlightWord(startNode,noteSelection,annoteText,rtid,user);
	  }
	  unOverlap("annotation",5);
	}
}

function makeLinkObj(rtid,agreement,agrtot) {
    returnLink = rtid ? '<a href="/comments/rt/readsay.html?id='+rtid+'">read/say more</a> ' : '[problem with ticket link]';
    
    agreechild = agreement;
    //alert("calling gXNS at 395");
    	  agreestr = getXMLNodeSerialisation(agreement);
    	  if ((agreechild == "agree") || (agreechild == "unagree")) {
    	    returnLink += '<a id="agree'+rtid+'" href="javascript:iAgree('+rtid+',\''+agreechild+'\')">'+agreechild+'</a> | ';
    	  }
    	  else {
    	    returnLink += '<span id="agree'+rtid+'">'+agreestr+'</span> | ';
    	  }
    	  if (agrtot) {
    	    returnLink += ' [<span id="agrtot'+rtid+'">'+agrtot+'</span> agree]';
    	  }
	  return returnLink;
}

function processAgreement(response) {
// dump("got an agreement\n");
	myId = response.getElementsByTagName("id")[0].firstChild.data;
	myOpn = response.getElementsByTagName("b")[0].firstChild.data;
// dump('id is '+rtids_arr[0].firstChild.data);
	myLink = document.getElementById('agree'+myId);
	myOpn == "agree" ? opOpn = "unagree" : opOpn = "agree";
	loadHTMLtoDiv(opOpn,'agree'+myId,"processagreement");
	// FIX AGREE COUNT BY INCREMENTING/DECREMENTING HERE
	agrcount = parseInt(document.getElementById('agrtot'+myId).innerHTML);
	myOpn == "agree" ? agrcount++ : agrcount--;
	loadHTMLtoDiv(agrcount,'agrtot'+myId);
	ticketObj[myId].link = makeLinkObj(myId,opOpn,agrcount);
	//	myLink.innerHTML = opOpn;
	myLink.href = 'javascript:iAgree('+myId+',\''+opOpn+'\')';
      }

  
function onNoteifyBlur() {
//	noteNode = document.getElementById('noteify');
//	dump(noteNode);
	submitComment();
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

  // this would be a lot more readable and maintainable if it were
  // just a string.

var noteifyDiv = document.createElement('form');
noteifyDiv.setAttribute('action','/comments/rt/submitcomment-devel.html');
noteifyDiv.setAttribute('class','noteify');
noteifyDiv.setAttribute('id','noteify');
noteifyDiv.setAttribute('name','noteify');
noteifyDiv.setAttribute('onblur','onNoteifyBlur()');
// noteifyDiv.style.z-index = '100';

var DomPathTxt = document.createElement('span');
DomPathTxt.setAttribute('id','DomPathTxt');
DomPathTxt.setAttribute('name','DomPathTxt');

var DomPath = document.createElement('input');
DomPath.setAttribute('id','DomPath');
DomPath.setAttribute('name','DomPath');
DomPath.setAttribute('type','hidden');
DomPath.setAttribute('class','addnote');

var SelectionTxt = document.createElement('span');
SelectionTxt.setAttribute('id','SelectionTxt');
SelectionTxt.setAttribute('name','SelectionTxt');

var Selection = document.createElement('input');
Selection.setAttribute('id','Selection');
Selection.setAttribute('name','Selection');
Selection.setAttribute('type','hidden');

var NoteSubj = document.createElement('input');
NoteSubj.setAttribute('id','NoteSubj');
NoteSubj.setAttribute('name','NoteSubj');
NoteSubj.setAttribute('type','text');
NoteSubj.setAttribute('size','40');
NoteSubj.setAttribute('onfocus','if(this.value=="Subject/summary [required]") {this.value="";}');
NoteSubj.setAttribute('onblur','if(this.value==""){this.value="Subject/summary [required]";}');
NoteSubj.setAttribute('class','addnote');

var NoteText = document.createElement('textarea');
NoteText.setAttribute('id','NoteText');
NoteText.setAttribute('name','NoteText');
NoteText.setAttribute('rows','10');
NoteText.setAttribute('cols','40');
NoteText.setAttribute('class','addnote');

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
cancel.setAttribute('class','addnote');

var theBR = document.createElement('br');
var theBR1 = document.createElement('br');
var theBR2 = document.createElement('br');
var theBR3 = document.createElement('br');
var theBR4 = document.createElement('br');

var pickQueue;
if (drafter) {
pickQueue = document.createElement('select');
pickQueue.setAttribute('name','queue');
pickQueue.setAttribute('id','queue');

var optDrafter = document.createElement('option');
optDrafter.setAttribute('value','Drafter');
optDrafter.setAttribute('selected','selected');
optDrafter.appendChild(document.createTextNode('Drafter'));

var optInbox = document.createElement('option');
optInbox.setAttribute('value','Inbox');
optInbox.appendChild(document.createTextNode('Inbox'));

var optIssues = document.createElement('option');
optIssues.setAttribute('value','Issues');
optIssues.appendChild(document.createTextNode('Issues'));

pickQueue.appendChild(optDrafter);
pickQueue.appendChild(optInbox);
pickQueue.appendChild(optIssues);
}
else {
pickQueue = document.createElement('input');
pickQueue.setAttribute('type','hidden');
pickQueue.setAttribute('name','queue');
pickQueue.setAttribute('value','Inbox');
}
var submit = document.createElement('input');
submit.setAttribute('type','button');
submit.setAttribute('id','submitNote');
submit.setAttribute('value','submit');
submit.setAttribute('onClick','submitComment()');
submit.setAttribute('class','annoteButton');
submit.setAttribute('class','addnote');

noteifyDiv.appendChild(DomPathTxt);
noteifyDiv.appendChild(DomPath);
noteifyDiv.appendChild(SelectionTxt);
noteifyDiv.appendChild(theBR1);
noteifyDiv.appendChild(Selection);
noteifyDiv.appendChild(NoteSubj);
noteifyDiv.appendChild(theBR3);
noteifyDiv.appendChild(NoteText);
noteifyDiv.appendChild(StartNode);
noteifyDiv.appendChild(EndNode);
noteifyDiv.appendChild(StartNodeId);
noteifyDiv.appendChild(EndNodeId);
noteifyDiv.appendChild(NoteUrl);
noteifyDiv.appendChild(DocRevision);
noteifyDiv.appendChild(theBR4);
noteifyDiv.appendChild(submit);
noteifyDiv.appendChild(cancel);

if (drafter) {
pickQueue && noteifyDiv.appendChild(document.createTextNode(' Queue: ')) && noteifyDiv.appendChild(pickQueue);
}
else {
pickQueue && noteifyDiv.appendChild(pickQueue);
}

return noteifyDiv;

}

function highlightWord(nodeId,word,tooltip,rtid,user) {
    var node = document.getElementById(''+nodeId+'');
    //alert("entering hlw with "+nodeId+":"+node+","+word+","+tooltip.firstChild.data+","+rtid+","+user);

/* this code is basically no longer descended from: */
/* http://www.kryogenix.org/code/browser/searchhi/  */
/* but that got me started ...                      */
// it's also too rickety and will be replaced by intense_annot as soon
// as that is a little less buggy.
// but so far the only thing worse than this function, is everything I've
// tried to replace it with.
//if (node) { dump("my node is "+node.id+"\n"); }
  var haveHighlighted = false;
  if ((node) && (node.hasChildNodes)) {
	paragraph = node;
	//	try { alert(node.children[0].firstChild.data); } catch(e) {}
	//alert("calling gXNS at 628");
	var paragraphString = getXMLNodeSerialisation(paragraph);
	if (!paragraphString) {var paragraphString = node.firstChild.data; }
	if (!paragraphString) {var paragraphString = node.firstChild.firstChild.data; }
	paragraphString.replace(/\s+/gm,' ');
	//alert("pString is "+paragraphString);
	tempWordVal = word;
	tempWordVal = tempWordVal.replace(/\)/g,'\\)');
	tempWordVal = tempWordVal.replace(/\(/g,'\\(');
	tempWordVal = tempWordVal.replace(/\b\W+\b/g,'\\W[^<>]*(?:<[^<]+>)*');
	//tempWordVal = tempWordVal.replace(/^\\W/,'');
	//tempWordVal = tempWordVal.replace(/\\W$/,'');
	//tempWordVal = tempWordVal.replace(/\\W[<>^*()+\]]+$/,'');
	tempWordVal = '('+tempWordVal+')(.*)';
	//alert('t: '+tempWordVal);
	var re = new RegExp(tempWordVal, 'm');
	//dump("re is "+re+"\n");


paragraphString = paragraphString.replace(re,'<span class="highlight '+rtid+' '+ticketObj[rtid].queue+'" id="'+node.id+'">'+"$1"+'</span>'+"$2"+'\
<span class="annotation '+rtid+' '+ticketObj[rtid].queue+'" id="rt'+rtid+'" onmousedown="dragStart(event,\'rt'+rtid+'\')" onclick="showFull(\''+rtid+'\')" onmouseover="notemouseover('+rtid+')" onmouseout="notemouseout('+rtid+')">\
  <span style="font-size: smaller;font-style: italic" id="rt'+rtid+'user">'+ticketObj[rtid].user+'</span>: \
  <span id="rt'+rtid+'txt">'+ticketObj[rtid].excerpt+'\
  <a href="javascript:showFull(\''+rtid+'\')">[+]</a></span>\
</span>');
//dump("replaced on "+$&+"\n");
//alert("pString is now "+paragraphString+"\n\n");
 loadHTMLtoDiv(paragraphString,node.id,"highlightword 742"); 
    }
  }

function getElementStyle(elem, IEStyleProp, CSSStyleProp) {
  //  var elem = document.getElementById(elemID);
  if (elem.currentStyle) {
    return elem.currentStyle[IEStyleProp];
  } else if (window.getComputedStyle) {
    var compStyle = window.getComputedStyle(elem, "");
    return compStyle.getPropertyValue(CSSStyleProp);
  }
  return "";
}

function notemouseover(rtid) {
  var noteArr = getElementsByClass(rtid);
  for (i = 0; i<noteArr.length; i++) {
	noteArr[i].style.prevBG=getElementStyle(noteArr[i],'background','background');
	noteArr[i].style.prevBRD=getElementStyle(noteArr[i],'border','border');
	//dump('s prevBG '+noteArr[i].style.prevBG+'\n');
	//dump('s prevBRD '+noteArr[i].style.prevBRD+'\n');
    noteArr[i].style.background="#f9f";
    noteArr[i].style.border="1px solid #f0f";

  }
}
function notemouseout(rtid) {
  var noteArr = getElementsByClass(rtid);
  for (i = 0; i<noteArr.length; i++) {
    //dump('r prevBG '+noteArr[i].style.prevBG+'\n');
    //dump('r prevBRD '+noteArr[i].style.prevBRD+'\n');
    noteArr[i].style.background=noteArr[i].style.prevBG;
    noteArr[i].style.border=noteArr[i].style.prevBRD;
  }
}


function showFull (rtid) {
  myCollapsed = document.getElementById('rt'+rtid+'txt');
  loadHTMLtoDiv(ticketObj[rtid].full+' '+ticketObj[rtid].link+' <a href="javascript:showExcerpt(\''+rtid+'\')">[-]</a>',myCollapsed.id);
  myCollapsed.parentNode.setAttribute('onclick','');
  unOverlap("annotation",5);
}

function showExcerpt (rtid) {
  myFull = document.getElementById('rt'+rtid+'txt');
  loadHTMLtoDiv(ticketObj[rtid].excerpt+' <a href="javascript:showFull(\''+rtid+'\')">[+]</a>',myFull.id);
  myFull.parentNode.setAttribute('onclick','showFull(\''+rtid+'\')');
  unOverlap("annotation",5);
}

function iAgree (rtid,opn) {
  myAgr = document.getElementById('agree'+rtid);
  myAgr.setAttribute('href','');
  loadHTMLtoDiv(myAgr.innerHTML+'ing...',myAgr.id);
  loadXMLDoc('/comments/rt/agree.html','rtid='+rtid+'&amp;opn='+opn);
}

function unOverlap(cls,gapDesired) {
items = getElementsByClass(cls);

 for (i = 0; i< (items.length - 1); i++) {
   iheight =parseInt(document.defaultView.getComputedStyle(items[i], '').getPropertyValue("height"));
   ibottom = parseInt(parseInt(items[i].offsetTop) + parseInt(iheight));
   items[i+1].style.top = items[i+1].offsetTop+"px";
   diff = parseInt(ibottom) - parseInt(items[i+1].style.top);
   if (diff >= 0) {
     items[i+1].style.top = parseInt(parseInt(items[i+1].style.top)+parseInt(diff)+parseInt(gapDesired))+"px";
   }
 }
}

function last(obj) {
  return(this[obj][this.msg.length-1]);
}

function statusbox(text) {
  loadHTMLtoDiv(text,'statustext');
  loginbox();
}
function loginbox() {
  if((!name) && (readCookie('__ac'))) {
	namepass = decodeBase64(readCookie('__ac'));
	var name = namepass.substr(0,namepass.indexOf(':'));
	loadHTMLtoDiv('<span id="selectsome" class="selectsome">select some text</span> and <a href="javascript:XpathSel()">add a comment</a> | you are '+name+': <a href="http://gplv3.fsf.org/logout">logout</a> <a href="http://gplv3.fsf.org/comments/stet-2006-01-20.tar.gz">source</a>','login');
  }
  else {
    loadHTMLtoDiv('You need to <a href=\"http://gplv3.fsf.org/login_form?came_from='+location.pathname+'\">log in</a> to make comments.','login');
  }
}
function idLinks(cs) {
  //alert("entering idlinks");
  try { var say = cs.getElementsByTagName('say')[0].firstChild; } catch(e) { alert(e); }
    var id = cs.getElementsByTagName('ci')[0].firstChild; 
    var list = cs.getElementsByTagName('l')[0].firstChild;
    var newMe = document.createElement('span');
    //try { 
    newMe.appendChild(document.createTextNode(say.data+' '));
    //} catch(e) { alert("say "+say+", saydata "+say.data+", e "+e); }
    //alert("say "+say+", saydata "+say.data);
    newMe.appendChild(document.createTextNode(id.data+' '));
    newMe.appendChild(document.createTextNode(' '));
    Lnk = document.createElement('a');
    Lnk.setAttribute('href',list.data);
    Lnk.appendChild(document.createTextNode('[see thread]'));
    newMe.appendChild(Lnk);
    newMe.appendChild(document.createTextNode(' '));
    sLnk = document.createElement('a');
    sLnk.setAttribute('href','http://gplv3.fsf.org/comments/rt/changeshown.html?came_from=gplv3-draft-1');
    sLnk.appendChild(document.createTextNode('search'));
    newMe.appendChild(sLnk);

    st = document.getElementById('statustext');
    ch = st.childNodes;
    while (ch.length > 0) {
	st.removeChild(ch.item(0));
    }
    st.appendChild(newMe);
}
function qLinks(cs) {
    var say = cs.getElementsByTagName('say')[0].firstChild;
    var q = cs.getElementsByTagName('q')[0].firstChild; 
    var r = cs.getElementsByTagName('r')[0].firstChild; 
    var list = cs.getElementsByTagName('l')[0].firstChild;
    var ra = cs.getElementsByTagName('ra')[0].firstChild; 
    var t =  cs.getElementsByTagName('t')[0].firstChild; 
    var rng =  cs.getElementsByTagName('rng')[0].firstChild; 
    //    var newMe = document.createElement('span');
    var newMe = document.createElement('span');
    //    alert(newMe);
    var pr;
    var nx;
    try { pr = cs.getElementsByTagName('pr')[0].firstChild; } catch(e) {}
    try { nx = cs.getElementsByTagName('nx')[0].firstChild; } catch(e) {}
    //try { 
    newMe.appendChild(document.createTextNode(say.data+' ')); 
//} catch(e) { alert("say "+say+", saydata "+say.data+", e "+e); }
    //try {
    newMe.appendChild(document.createTextNode(q.data)); 
    //} catch(e) { alert("q "+q+", qdata "+q.data+", e "+e); }
    newMe.appendChild(document.createTextNode(' '));
    rLnk = document.createElement('a');
    rLnk.setAttribute('href',r.data);
    rLnk.appendChild(document.createTextNode('[rss]'));
    try { newMe.appendChild(rLnk); } catch(e) {alert(e);}
    newMe.appendChild(document.createTextNode(' '));
    lLnk = document.createElement('a');
    lLnk.setAttribute('href',list.data);
    lLnk.appendChild(document.createTextNode('[list]'));
    newMe.appendChild(lLnk);
    newMe.appendChild(document.createTextNode(' '));
    rat = document.createElement('a');
    rat.setAttribute('href',"http://gplv3.fsf.org/comments/gplv3-draft-1?Query=%20Creator%20=%20'ratiodoc'%20%20AND%20'CF.NoteUrl'%20LIKE%20'gplv3-draft-1'%20&Order=DESC&OrderBy=id&StartAt=1&Rows=80");
    rat.appendChild(document.createTextNode('[rationale]'));
    newMe.appendChild(rat);
    newMe.appendChild(document.createElement('br'));
    newMe.appendChild(document.createTextNode('(found '+t.data+', showing '+rng.data));
    if (pr || nx) { newMe.appendChild(document.createTextNode(': ')); }
    if(pr) { 
    pLnk = document.createElement('a');
    pLnk.setAttribute('href',pr.data);
    pLnk.appendChild(document.createTextNode('prev'));
    newMe.appendChild(pLnk);
    }
    if (pr && nx) {
      newMe.appendChild(document.createTextNode(' | '));
    }
    if (nx) {
    nLnk = document.createElement('a');
    nLnk.setAttribute('href',nx.data);
    nLnk.appendChild(document.createTextNode('next'));
    newMe.appendChild(nLnk);
    }

    newMe.appendChild(document.createTextNode(') '));

    sLnk = document.createElement('a');
    sLnk.setAttribute('href','http://gplv3.fsf.org/comments/rt/changeshown.html?came_from=gplv3-draft-1');
    sLnk.appendChild(document.createTextNode('search'));
    newMe.appendChild(sLnk);

    st = document.getElementById('statustext');
    ch = st.childNodes;
    while (ch.length > 0) {
	st.removeChild(ch.item(0));
    }
    st.appendChild(newMe);
}

function cstatusbox(cs) {
  try { 
    //alert("about to call idlinks");
    idLinks(cs);
  } catch (e) {
    //    try {
      qLinks(cs);
      //    } catch (e) { statusbox("There is a problem with either our browser compatibility or the server's response. <a href=\"http://gplv3.fsf.org/comments/rt/changeshown.html?came_from=gplv3-draft-1\">search again</a>"); }
  }
  loginbox();
}
function deParen(str) {
  str = str.replace(/\(/g,'\\(');
  str = str.replace(/\)/g,'\\)');
  return str;
}

function newQuery() {
  loadURLtoDiv('/comments/rt/changeshown.html','came_from='+document.location,'statustext');
}

function cancelNewQuery() {
  //  loadHTMLtoDiv(status.last,'statustext');
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



// http://ostermiller.org/calc/encode.html
// Copyright Stephen Ostermiller 2003-2006
// http://ostermiller.org/contact.pl?regarding=JavaScript+Encoding
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation; either version 2 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.
var END_OF_INPUT = -1;

var base64Str;
var base64Count;
function setBase64Str(str){
  base64Str = str;
  base64Count = 0;
}
function readBase64(){    
  if (!base64Str) return END_OF_INPUT;
  if (base64Count >= base64Str.length) return END_OF_INPUT;
  var c = base64Str.charCodeAt(base64Count) & 0xff;
  base64Count++;
  return c;
}
function encodeBase64(str){
  setBase64Str(str);
  var result = '';
  var inBuffer = new Array(3);
  var lineCount = 0;
  var done = false;
  while (!done && (inBuffer[0] = readBase64()) != END_OF_INPUT){
    inBuffer[1] = readBase64();
    inBuffer[2] = readBase64();
    result += (base64Chars[ inBuffer[0] >> 2 ]);
    if (inBuffer[1] != END_OF_INPUT){
      result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
      if (inBuffer[2] != END_OF_INPUT){
	result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
	result += (base64Chars [inBuffer[2] & 0x3F]);
      } else {
	result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
	result += ('=');
	done = true;
      }
    } else {
      result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
      result += ('=');
      result += ('=');
      done = true;
    }
    lineCount += 4;
    if (lineCount >= 76){
      result += ('\n');
      lineCount = 0;
    }
  }
  return result;
}
function readReverseBase64(){   
  if (!base64Str) return END_OF_INPUT;
  while (true){      
    if (base64Count >= base64Str.length) return END_OF_INPUT;
    var nextCharacter = base64Str.charAt(base64Count);
    base64Count++;
    if (reverseBase64Chars[nextCharacter]){
      return reverseBase64Chars[nextCharacter];
    }
    if (nextCharacter == 'A') return 0;
  }
  return END_OF_INPUT;
}

function ntos(n){
  n=n.toString(16);
  if (n.length == 1) n="0"+n;
  n="%"+n;
  return unescape(n);
}

function decodeBase64(str){
  setBase64Str(str);
  var result = "";
  var inBuffer = new Array(4);
  var done = false;
  while (!done && (inBuffer[0] = readReverseBase64()) != END_OF_INPUT
	 && (inBuffer[1] = readReverseBase64()) != END_OF_INPUT){
    inBuffer[2] = readReverseBase64();
    inBuffer[3] = readReverseBase64();
    result += ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
    if (inBuffer[2] != END_OF_INPUT){
      result +=  ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
      if (inBuffer[3] != END_OF_INPUT){
	result +=  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
      } else {
	done = true;
      }
    } else {
      done = true;
    }
  }
  return result;
}

// from rt:
function hideshow(num) {
    idstring = "element-" + num;
    chunk = document.getElementById(idstring);
    if ( chunk.style.display == "none")  {
    chunk.style.display = chunk.style.tag;
    } else {
        chunk.style.tag = chunk.style.display;
        chunk.style.display = "none";
    }
}   
