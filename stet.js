// Copyright (C) 2005   Software Freedom Law Center, Inc.
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


var ticketObj = new Object;
ticketObj.rtidsBySn = new Object;
var status = new Object;
status.msg = new Array;
status.last = last;

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
  var filename = location.pathname.substring(location.pathname.lastIndexOf('/')+1,location.pathname.length); 
  if((!filename.length) || (filename.match(/index.html/))) {
    filename = 'gplv3-draft-1';
  }

if(window.location.search.length) {
  //dump('loadxmldoc /rt/NoAuth/xmlresults.html?'+window.location.search.substring(1)+'\n');
  loadXMLDoc('/rt/NoAuth/xmlresults.html',window.location.search.substring(1));
}
 else {
   //dump('loadXMLDoc /rt/NoAuth/xmlresults.html?Query=+%27CF.NoteUrl%27+LIKE+%27'+filename+'%27+&RowsPerPage=25&Order=DESC');
   loadXMLDoc('/rt/NoAuth/xmlresults.html','Query=+%27CF.NoteUrl%27+LIKE+%27'+filename+'%27+&RowsPerPage=25&Order=ASC');
 }
}

window.onload = initPage();


// XpathSel adapted from http://www.quirksmode.org/js/selected.html
function XpathSel() {

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
    }
  else if (document.selection)
    {
      textObj= document.selection.createRange().text;
    }
  
  if(!textObj.length) {
    document.getElementById('selectsome').setAttribute('class','error');
    return;
  }

      startNode = textObj.anchorNode.parentNode;
      startid= startNode.id;
      start = startNode.nodeName;
      
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
    document.getElementById('NoteUrl').value = location.href;

    if(startid != endid) {
      document.getElementById('NoteText').value = 'Your selection does not begin and end in the same sentence.  Please cancel and try again with a shorter selection.';      
      document.getElementById('submitNote').setAttribute('disabled','disabled');
      document.getElementById('NoteSubj').setAttribute('disabled','disabled');
      //document.getElementById('NoteText').setAttribute('disabled','disabled');
    }
  }
}


function getDomPath(startNode) {
  // helped here by http://www.howtocreate.co.uk/emails/FlorianSauvin.html
  for (var oStr='' ; startNode && startNode.nodeName != '#document'; startNode=startNode.parentNode) { 
    if (startNode.nodeName!='#text') { 
      oStr = startNode.nodeName 
	+ (startNode.id?('[id='+startNode.id+']'):'')
	+ (oStr?('/'+oStr):'');
    }
  }
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

  var params = encodeURI('DomPath='+form.DomPath.value+'&amp;Selection='+encodeURIComponent(form.Selection.value)+'&amp;NoteSubj='+encodeURIComponent(form.NoteSubj.value)+'&amp;NoteText='+encodeURIComponent(noteText)+'&amp;StartNode='+form.StartNode.value+'&amp;EndNode='+form.EndNode.value+'&amp;StartNodeId='+form.StartNodeId.value+'&amp;EndNodeId='+form.EndNodeId.value+'&amp;NoteUrl='+location.href);
  
  

  var theUrl = 'stet-submit.pl'; 
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
  dump('loading '+url+'?'+theData+'\n');
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
  dump('targetid is '+targetid);
  if(caller) { dump(', caller is '+caller);}
  dump('\n');
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

// thanks to http://www.mercurytide.com/knowledge/white-papers/issues-working-with-ajax
function getXMLNodeSerialisation(xmlNode) {
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
    catch (e) {}
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
  //  document.getElementById(targetid).innerHTML = req.responseText;


}

function processReqChange() 
{

  // only if req shows "complete"
  if (req.readyState == 4) {
    // only if "OK"
    if (req.status == 200) {
/* <jag> [Exception... "Component returned failure code: 0x80040111
      (NS_ERROR_NOT_AVAILABLE) [nsIXMLHttpRequest.status]"  nsresult:
      "0x80040111 (NS_ERROR_NOT_AVAILABLE)"  location: "JS frame ::
      http://gplv3.fsf.org/stet/stet.js :: processReqChange :: line 189"
      data: no]
 */
      cancelNote("noteify");
      //dump(req.responseText);
      response  = req.responseXML.documentElement;
      dump("pre processAnnot\n");
      var resp_arrN;
      var resp_arrA;
      var resp_arrF;
      cs = response.getElementsByTagName("cs");
      statusbox(getXMLNodeSerialisation(cs[0]));

      resp_arrN = response.getElementsByTagName("annotation");
      if(resp_arrN.length) {
	dump("processAnnot\n")
	  processAnnotation(response);
      }
      
      else if (resp_arrF = response.getElementsByTagName("form")) {
	dump("pre processNQ\n")
	  if(resp_arrF.length) {
	    dump("processNQ\n")
	      processNewQuery(response);
	  }
      }
      else if (resp_arrA = response.getElementsByTagName("agreement")) {
	//	dump("pre processAgree\n"+resp_arr[0].firstChild.data+"\n");

	if(resp_arrA.length) {
       dump("processAgree\n");
        processAgreement(response);
      }
	   }
      else {
	statusbox("There was a problem retrieving the XML data:\n" + req.statusText+"\n"); //debug
      }
    }
  }
  //    else { dump("readyState was "+req.readyState+"\n"); } // debug
}
  
function onNoteifyMouseover() {
  //this.onblur = onNoteifyBlur;
  
}

function processAnnotation(response) {
  //	document.getElementById("statusbox").innerHTML = getXMLNodeSerialisation(cs[0]);
  // dump("got an annotation\n");
  //  dump(req.responseXML+"\n");
  //	responseStringSer = getXMLNodeSerialisation(req.responseXML);
  // dump(responseStringSer);
  // dump(resp_arr + ' ' + resp_arr.length + ' ' + resp_arr.item(1)+"\n");
  
  selections_arr = response.getElementsByTagName("s");
  // dump(selections_arr + ' ' + selections_arr.length + ' ' + selections_arr.item(0)+"\n");
  startnodes_arr = response.getElementsByTagName("i");
  annotations_arr = response.getElementsByTagName("n");
  rtids_arr = response.getElementsByTagName("id");
  users_arr = response.getElementsByTagName("u");
  uagr_arr = response.getElementsByTagName("ua");
  agrtot_arr = response.getElementsByTagName("at");
	for (prI = 0; prI < selections_arr.length; prI++) {
	  rtids_arr[prI].firstChild.data ? rtid = rtids_arr[prI].firstChild.data : rtid = "error";
	  tooltipString = getXMLNodeSerialisation(annotations_arr[prI]);
	  tooltipString.length > 165 ? tooltipSubString = tooltipString.substr(0,199) + '...' : tooltipSubString = tooltipString;

	  ticketObj[rtid] = new Object;

	  ticketObj[rtid].link = rtid ? '<a href="/rt/NoAuth/readsay.html?id='+rtid+'">read/say more</a> ' : '[problem with ticket link]';
	  agreechild = uagr_arr[prI].firstChild.data
	  agreestr = getXMLNodeSerialisation(uagr_arr[prI]);
	  if ((agreechild == "agree") || (agreechild == "unagree")) {
	    ticketObj[rtid].link += '<a id="agree'+rtid+'" href="javascript:iAgree(\''+rtid+'\',\''+agreechild+'\')">'+agreechild+'</a> | ';
	  }
	  else {
	    ticketObj[rtid].link += ' '+agreestr+' | ';
	  }
	  if (agrtot_arr[prI].firstChild.data > 0) {
	    ticketObj[rtid].link += ' ['+agrtot_arr[prI].firstChild.data+' agree]';
	  }
	  ticketObj[rtid].full = tooltipString;
	  ticketObj[rtid].excerpt = tooltipSubString;
	  ticketObj[rtid].user = users_arr[prI].firstChild ? users_arr[prI].firstChild.data : "";
	  ticketObj[rtid].startnode = startnodes_arr[prI].firstChild.data;
	  if(!ticketObj.rtidsBySn[ticketObj[rtid].startnode]) {
	    ticketObj.rtidsBySn[ticketObj[rtid].startnode] = new Array(rtid);
	  }
	  else {
	    ticketObj.rtidsBySn[ticketObj[rtid].startnode].push(rtid);
	  }
	  ticketObj[rtid].ua = getXMLNodeSerialisation(uagr_arr[prI]);
	  startNode = startnodes_arr[prI].firstChild.data;
	  startNode = startNode.replace(/note\.[0-9]+\./,'');
	  noteSelection = selections_arr[prI].firstChild.data;
	  //		annoteText = users_arr[prI].firstChild.data+": "+ annotations_arr[prI].firstChild.data;
	  annoteText = annotations_arr[prI];
	  //		if (annotations_arr[prI].firstChild.nextSibling) {
	  //		annoteText += annotations_arr[prI].firstChild.toString();
	  //		}
	  
	  rtid = rtids_arr[prI] ? rtids_arr[prI].firstChild.data : "";
	  user = users_arr[prI].firstChild ? users_arr[prI].firstChild.data : "";
	  //		dump(users_arr[prI].firstChild.data);
	  dump("\nhighlighting "+startNode+' '+noteSelection+' '+annoteText+' rt'+rtid+'\n');
	  highlightWord(document.getElementById(startNode),noteSelection,annoteText,rtid,user);

	  // FIXME: couple bugs left in intense_annot, 
	  // new comments are not getting highlighted upon submission
	  // and I want to sort out the rtidsBySn thing, so I can
	  // annote one paragraph at a time.
	  // also other distressing inconsistencies make the wack-ass
	  // highlightWord() a better choice for the moment.
	  
		  // fixme: currently crashes browser :)
	  
	  //intense_annot(document.getElementById(startNode),noteSelection,rtid);

	}
	//	dump('rtidsBySn for gpl3.preamble.p2.s1 are: '+ticketObj.rtidsBySn['gpl3.preamble.p2.s1']+'\n');
	unOverlap("annotation",5);
}

function processAgreement(response) {
// dump("got an agreement\n");
	myId = response.getElementsByTagName("id")[0].firstChild.data;
	myOpn = response.getElementsByTagName("b")[0].firstChild.data;
// dump('id is '+rtids_arr[0].firstChild.data);
	myLink = document.getElementById('agree'+myId);
	myOpn == "agree" ? opOpn = "unagree" : opOpn = "agree";
	loadHTMLtoDiv(opOpn,'agree'+myId,"processagreement");
	//	myLink.innerHTML = opOpn;

	myLink.href = 'javascript:iAgree(\''+rtid+'\',\''+opOpn+'\')';
      }


function processNewQuery(response) {
  dump("entering pNQ\n");
  dump(getXMLNodeSerialisation(response));
  statusbox(getXMLNodeSerialisation(response));
}
  
function onNoteifyBlur() {
//	noteNode = document.getElementById('noteify');
//	dump(noteNode);
	submitComment();
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

  // this would be a lot more readable and maintainable if it were
  // just a string.

var noteifyDiv = document.createElement('form');
noteifyDiv.setAttribute('action','stet-submit.pl');
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

var submit = document.createElement('input');
submit.setAttribute('type','button');
submit.setAttribute('id','submitNote');
submit.setAttribute('value','submit');
//submit.onclick = 'dump("clicked submit")';
submit.setAttribute('onClick','submitComment()');
submit.setAttribute('class','annoteButton');
submit.setAttribute('class','addnote');

noteifyDiv.appendChild(DomPathTxt);
noteifyDiv.appendChild(DomPath);
//noteifyDiv.appendChild(theBR);
noteifyDiv.appendChild(SelectionTxt);
noteifyDiv.appendChild(theBR1);
noteifyDiv.appendChild(Selection);
// noteifyDiv.appendChild(theBR2);
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

return noteifyDiv;

}

function intense_annot(root,selection,rtid) {
var selecObj = new Array;
var rootObj = new Array;
 dump('selection is '+selection+'\n');
 dump('comment is '+ticketObj[rtid].excerpt+'\n');
 var selections = new Array(selection);
// couple lines of html-ignoring help from
// http://www.notestips.com/80256B3A007F2692/1/NAMO5RNV2S 
// by Mike Golding, 9/24/2003
//Extract HTML Tags
 regexp=/<[^<>]*>/ig;
 // dump('node text is '+root.innerHTML+'\n');
 rootHTMLArray = root.innerHTML.match(regexp);
 //Replace HTML tags
 // may not work in Safari
 rootStrippedHTML = root.innerHTML.replace(regexp,"$!$");

root_words = rootStrippedHTML.split(/\s+/);

// there is one rootObj, each word in the root sentence a sub-obj
for (i=0; i<root_words.length; i++) {
    rootObj[i] = new Object;
    rootObj[i].word = root_words[i];
    rootObj[i].intensity = 0;
    rootObj[i].annotations = new Array;
}

// each selecObj[n] refers to a single selection, and then has a .words[] array
// that holds each word in the selection.
for (i=0; i<selections.length; i++) {
   selecObj[i] = new Object;
   selecObj[i].selection = selections[i];
   selecObj[i].words = new Array(selections[i].split(/\s+/));

   // we're getting the comment from the ticketObj so don't bother here
//   selecObj[i].comment = comments[i];
//   selecObj[i].comment = 'this would be a comment'; // test foo

   // this initializes a handy "matchindex" attribute that tells you 
   // which array index of rootObj has the first char of the match
   // (so you can skip the irrelevant indices that precede it)
   intense_doRoughMatch(selections,selecObj,root_words);
}


 intense_incrWords(selecObj,rootObj);
 
 returnstring = intense_genReturn(rootObj);

 loadHTMLtoDiv(returnstring,root.id);
 //  root.innerHTML = returnstring; 
// return returnstring;

}


function intense_doRoughMatch(selections,selecObj,root_words) {   
   // ok, so it's not perfect.  something  weird about the $!$ and stuff.

  var rer = deParen(selections[i]);
  dump('rer is '+rer+'\n');
  
  foo = rer.replace(/ /g,'[\\s\\$\\!]+');
  // foo = rer.replace(/\s+/g,"ACKACK");
  //dump('foo is '+foo+'\n');
  re = new RegExp(foo);
  //dump('re is '+re+', rootBlah is '+rootStrippedHTML+'\n');
  roughMatch = rootStrippedHTML.match(re);
  if (roughMatch) {
    dump('roughmatched at '+roughMatch.index+'\n');
    selecObj[i].matchindex = roughMatch.index;
    for (n=0,sum=0; sum<roughMatch.index&&n<root_words.length; n++) {
      if (root_words[n]) {
	dump('word "'+root_words[n]+'" length: '+root_words[n].length+'\n');
	sum += root_words[n].length + 1;
      }
    }
    n == 0 ? selecObj[i].arrayIndex = 0 : selecObj[i].arrayIndex = n-1;
    dump('looks like '+n+' would get us to '+sum+' aka '+roughMatch.index+'\n');
  }
}


function intense_incrWords(selecObj,rootObj) {

// try: first match the whole selectstring against the whole
// rootstring, and find the index/offset of the first character of the
// selectstring in the rootstring.  then split the rootstring... but
// how do you know which array index corresponds to the offset?  do
// selecObj[i].length until you get to the offset?
 
// for each selection...
 for (j=0; j<selecObj.length; j++) { 
   // for each word in the selection...
   dump('starting j loop iteration '+j+'\n');
   for (k=0; k<selecObj[j].words.length; k++) {
     dump('starting k loop iteration '+k+'\n');
     // start at the object's predetermined arrayindex, and look only until you get to
     // the arrayindex + the number of words in the selection...
     dump('should start at '+selecObj[j].arrayIndex+' looking across '+selecObj[j].words[k].length+' words in a '+rootObj.length+'-word sentence\n');
     skip = 0;
     // if we do i<...arrayIndex-1, gpl3 comments work
     // if we do i<...arrayIndex, lincoln-thanksgiving works
     // but they are mutually exclusive!
     for (i=selecObj[j].arrayIndex; i<selecObj[j].words[k].length+selecObj[j].arrayIndex-1; i++) {
       dump('starting i loop iteration '+i+'\n');
       dump('limit is '+selecObj[j].words[k].length+' plus '+selecObj[j].arrayIndex+'\n');
   // I'm clueless as to why I need an additional [m] incrementer, but this so far produces
   // my desired result
   
       //   for (m=skip; ((skip<selecObj[j].words[k].length)); m++) {
       m=skip;
     matched = '';
     dump('word is '+selecObj[j].words[k][m]+' '+j+' '+k+' '+m+' '+skip+'\n');
     //         re = new RegExp('\\b'+selecObj[j].words[k][m]+'\\b','m');
     re = new RegExp(''+deParen(selecObj[j].words[k][m])+'','m');
     dump('i here is '+i+'\n');
     thisMatch = rootObj[i].word.match(re);
     if (thisMatch) {
       dump('matched '+re+': '+thisMatch.index+'\n');
       rootObj[i].intensity++;
       matched = 'true';
       skip++;
       //       m = selecObj[j].words[k].length+skip;
     }
     if (matched && ((m+1) == selecObj[j].words[k].length-1)) {
       dump('pushing an annotation\n');
       var pushed = 1;
       rootObj[i].annotations.push('foo');
     }
     //   }
     }
     // this is a hack: I need to find out why some loops are ending early
     // (sort out the .length vs. maxindex problem)
     // argh this, too, breaks gpl3 but not lincoln!
     //if (!pushed) {
     //rootObj[i].annotations.push('foo');
     //}
   }
 }
 }


function intense_genReturn(rootObj) { 
 returnstring = '';

for (i=0; i<rootObj.length; i++) {
  if(rootObj[i].intensity > 0) {
//    intensereturn += '<span style="font-size: 1'+rootObj[i].intensity+'0%">';
    intensereturn += '<span class="highlight">';
  }
  intensereturn += ' '+rootObj[i].word+' ';
  if (rootObj[i].annotations.length) {
    for (j=0; j<rootObj[i].annotations.length; j++) {

      intensereturn += '<span class="annotation" id="rt'+rtid+'" onmousedown="dragStart(event,\'rt'+rtid+'\')" onclick="showFull(\''+rtid+'\')">\
  <span style="font-size: smaller;font-style: italic" id="rt'+rtid+'user">'+ticketObj[rtid].user+'</span>: \
  <span id="rt'+rtid+'txt">'+ticketObj[rtid].excerpt +'\
  <a href="javascript:showFull(\''+rtid+'\')">[+]</a></span>\
</span>';



   }
  }
  if(rootObj[i].intensity > 0) {
    intensereturn += '</span>';
  }

}

// thanks again, Mike Golding
 for(i=0;intensereturn.indexOf("$!$") > -1;i++){
   intensereturn = intensereturn.replace("$!$", rootHTMLArray[i]);
 }
 return intensereturn;
 }
 
function highlightWord(node,word,tooltip,rtid,user) {

/* this code is basically no longer descended from: */
/*                                                  */
/* http://www.kryogenix.org/code/browser/searchhi/  */
/*                                                  */
/* but it started out that way ...                  */

// it's also too rickety and will be replaced by intense_annot as soon
// as that is a little less buggy...

  var haveHighlighted = false;
  //  node = ticketObj[rtid].startnode;
  //  tooltip = ticketObj[rtid].excerpt;
 dump("doing highlightword of "+word+"\n");
  if ((node) && (node.hasChildNodes)) {

    var iCN;
 dump("this node has "+node.childNodes.length+" childNodes\n");
 highlightWord(node.firstChild,word,tooltip,rtid,user);
 //    for (iCN=0;iCN<node.childNodes.length;iCN++) {
 //dump("going in to "+node.childNodes[iCN].nodeName+"\nfor "+word+" iCN="+iCN+"\n");
 //     highlightWord(node.childNodes[iCN],word,tooltip,rtid,user);
 //   }

  }
  if ((node) && (node.nodeType == 3)) { // text node
// dump("node is "+node.parentNode.id+"\n");
//    dump("node.parentNode.parentNode.id is "+node.parentNode.parentNode.id+"\n");
    if (!haveHighlighted) {
// dump("haven't highlighted, at ln 375\n");

    if ((node.parentNode) && (node.parentNode.parentNode) && (paragraph = node.parentNode.parentNode)) {
    paragraphString = getXMLNodeSerialisation(paragraph);
    paragraphString.replace(/\s+/g,' ');
    tempNodeVal = paragraphString;
    tempWordVal = word;
    //tempWordVal = tempWordVal.replace(/\W+/g,'[\\W\\s]+(<[^>]+>)?');

    tempWordVal = tempWordVal.replace(/\W+/g,'[^<]*(<[^>]+>)*');

    var re = new RegExp(tempWordVal, 'mi');
    //    var re = new RegExp("software", 'mig');
// dump("re is "+re+"\n");




paragraphString = paragraphString.replace(re,'<span class="highlight '+rtid+'" id="'+node.parentNode.id+'">$&\
 <span class="annotation '+rtid+'" id="rt'+rtid+'" onmousedown="dragStart(event,\'rt'+rtid+'\')" onclick="showFull(\''+rtid+'\')" onmouseover="notemouseover('+rtid+')" onmouseout="notemouseout('+rtid+')">\
  <span style="font-size: smaller;font-style: italic" id="rt'+rtid+'user">'+ticketObj[rtid].user+'</span>: \
  <span id="rt'+rtid+'txt">'+ticketObj[rtid].excerpt+'\
  <a href="javascript:showFull(\''+rtid+'\')">[+]</a></span>\
 </span>\
</span>');
   //      dump("replaced on "+$&+"\n");
// dump("pString is now "+paragraphString+"\n");
 loadHTMLtoDiv(paragraphString,node.parentNode.parentNode.id,"highlightword 742"); 

 //    node.parentNode.parentNode.innerHTML = paragraphString;
    
    //    haveHighlighted=true;
    }
  }
}
}

function notemouseover(rtid) {
  var noteArr = getElementsByClass(rtid);
  for (i = 0; i<noteArr.length; i++) {
    noteArr[i].style.background="#dee7ec";
  }
}
function notemouseout(rtid) {
  var noteArr = getElementsByClass(rtid);
  for (i = 0; i<noteArr.length; i++) {
    noteArr[i].style.background="#f0ecb3";
  }
}


function showFull (rtid) {
  //dump('showing full for '+rtid+' since you asked\n');
  myCollapsed = document.getElementById('rt'+rtid+'txt');
  loadHTMLtoDiv(ticketObj[rtid].full+' '+ticketObj[rtid].link+' <a href="javascript:showExcerpt(\''+rtid+'\')">[-]</a>',myCollapsed.id);
  //  myCollapsed.innerHTML = ticketObj[rtid].full+' '+ticketObj[rtid].link+' <a href="javascript:showExcerpt(\''+rtid+'\')">[-]</a>';
  myCollapsed.parentNode.setAttribute('onclick','');
  unOverlap("annotation",5);
}

function showExcerpt (rtid) {
  //dump('showing excerpt for '+rtid+' since you asked\n');
  myFull = document.getElementById('rt'+rtid+'txt');
  loadHTMLtoDiv(ticketObj[rtid].excerpt+' <a href="javascript:showFull(\''+rtid+'\')">[+]</a>',myFull.id);
  //  myFull.innerHTML = ticketObj[rtid].excerpt+' <a href="javascript:showFull(\''+rtid+'\')">[+]</a>';
  myFull.parentNode.setAttribute('onclick','showFull(\''+rtid+'\')');
  unOverlap("annotation",5);
}

function iAgree (rtid,opn) {
// dump('agreeing with '+rtid+'\n');
loadXMLDoc('agree.pl','rtid='+rtid+'&amp;opn='+opn);
    
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

function last(obj) {
  return(this[obj][this.msg.length-1]);
}

function statusbox(text) {
  status.msg.push(text);
  //  document.getElementById("statustext").innerHTML = text+readCookie('__ac');
  loadHTMLtoDiv(text,'statustext');
  if((!name) && (readCookie('__ac'))) {
	namepass = decodeBase64(readCookie('__ac'));
	var name = namepass.substr(0,namepass.indexOf(':'));
	//        document.getElementById("login").innerHTML = 'you are logged in as '+name+'. <a href="http://gplv3.fsf.org:8800/launch/logout">logout</a>';
	loadHTMLtoDiv('<span id="selectsome" class="selectsome">select some text</span> and <a href="javascript:XpathSel()">add a comment</a> | you are '+name+': <a href="http://gplv3.fsf.org:8800/launch/logout">logout</a>','login');
  }
  else {
    //    document.getElementById("login").innerHTML = 'You need to <a href=\"http://gplv3.fsf.org:8800/launch/login_form?came_from='+location.pathname+'\">log in</a> to make comments.';
    loadHTMLtoDiv('You need to <a href=\"http://gplv3.fsf.org:8800/launch/login_form?came_from='+location.pathname+'\">log in</a> to make comments.','login');
  }
}

function deParen(str) {
  str = str.replace(/\(/g,'\\(');
  str = str.replace(/\)/g,'\\)');
  return str;
}

function newQuery() {
  loadURLtoDiv('/rt/NoAuth/changeshown.html','NewQuery=1&came_from='+document.location,'statustext');
//	document.getElementById("querydiv").style.display = "block";

}

function cancelNewQuery() {

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
