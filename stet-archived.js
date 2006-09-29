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

function printfire(foo) {
/*     alert(foo); */
/*          if (document.createEvent) { */
/*       printfire.args = arguments; */
/*       var ev = document.createEvent("Events"); */
/*   ev.initEvent("printfire", false, true); */
/*       dispatchEvent(ev); */
/*   } */
}

// a few things need to be global
var ticketObj = new Object;
ticketObj.length = 0;
var nodelist = new Object;
var drafter = '';
var filename;
var firstLoad = "1";
var noMatch =  0;

function initPage() {
  //  alert("starting initPage, supposedly DOM is loaded");
  //alert(document.getElementsByTagName("*").length);
  // quit if this function has already been called
  if (arguments.callee.done) return;
  // flag this function so we don't do the same thing twice
  arguments.callee.done = true;
  statusbox("Please wait while we load some comments.");
  filename = location.pathname.substring(location.pathname.lastIndexOf('/')+1,location.pathname.length); 
  filename = filename.replace(/.xml|.html/,'');
  //	printfire('filename is '+filename);
  if((!filename.length) || (filename.match(/index/)) || (filename.match(/comments?$/))|| (filename.match(/comments?\/\?/)) || (filename.match(/comments?\/#/)) || (filename.match(/debug/) || (filename.match(/classic/)))) {
    filename = 'gplv3-draft-2';
  }
  if(window.location.search.length) {
   loadXMLDoc('/comments/rt/xmlresults-intense.html',window.location.search.substring(1)+'&filename='+filename);
  }
  else {
    loadXMLDoc('/comments/cached-'+filename+'.xml','');
  }
}
function loadFromHash() { // checks the location hash for bookmarked notes to show
  if ((window.location.hash.length > 0) && (window.location.hash.match(/^#\d\d\d/))) {
    getnotes(location.hash.substring(1,location.hash.length));
  } 
  else if (window.location.hash.match(/^#all/)) {
    loadAll()
  }
}

function loadAll() {
  var getUs = '';
  for (var rtid in ticketObj) {
    if ((rtid != '') && (rtid != 'length')) {
      getUs += rtid+':';
    }
  }
  getnotes(getUs);
}
// XpathSel adapted from http://www.quirksmode.org/js/selected.html
// this is for browsers with a featureful getSelection object; others
// have to use an XMLHTTPRequest call.
function XpathSel() { 

    document.getElementById('login').setAttribute('style','color: red; font-weight: bold; font-size: 150%');
    return;
  }

function processDompath(response) {
  currently('asking server about your selection...');
  try { var fail = response.getElementsByTagName("nf")[0].firstChild.data; } catch(e) {}
  if (fail) { alert(fail); } // because we don't otherwise know where to put it, argh
  else {
    createNoteDiv(response.getElementsByTagName("si")[0].firstChild.data);
    document.getElementById('DomPath').value = response.getElementsByTagName("dp")[0].firstChild.data;
    document.getElementById('Selection').value = response.getElementsByTagName("sl")[0].firstChild.data;
    loadHTMLtoDiv('comment on: <strong>'+response.getElementsByTagName("sl")[0].firstChild.data+'</strong>','SelectionTxt');
    document.getElementById('NoteSubj').value = 'Subject/summary [required]';
    document.getElementById('StartNodeId').value = response.getElementsByTagName("si")[0].firstChild.data;

	if ((i = navigator.userAgent.indexOf('MSIE')) >= 0) {
	  document.getElementById('SelectionTxt').innerHTML += "<br/>Comment submission isn't working on the copy of IE 6 we tested [if IE is really the browser you're using] but you're welcome to try.  If this box doesn't turn gray and then disappear when you click 'Submit', it probably didn't work: you can <a href=\"/comments/email.html\">email your comment</a> instead.";
}
    //    document.getElementById('NoteText').value = "dp: "+document.getElementById('DomPath').value+"\nsl: "+document.getElementById('Selection').value+"\nsi: "+document.getElementById('StartNodeId').value;
    // document.getElementById('EndNodeId').value = endid;
    document.getElementById('NoteUrl').value = response.getElementsByTagName("fn")[0].firstChild.data;;
  }
}

function getDomPath(startNode) {
  // helped here by http://www.howtocreate.co.uk/emails/FlorianSauvin.html
  for (var oStr='' ; startNode && startNode.nodeName != '#document'; startNode=startNode.parentNode) { 
    if ((startNode.nodeName!='#text') || ((startNode.getAttribute) && (startNode.getAttribute('class').match('highlight')))) { 
      oStr = startNode.nodeName 
	+ (startNode.id ? ('[id='+startNode.id+']') : '')
	+ (oStr ? ('/'+oStr) : '');
    }
  }
  currently('Ready.');
  return oStr;
}


// these are all too too slow, maybe cssQuery
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

/* function getElementsByClass(searchClass,node,tag) {
  var classElements = new Array();
  if ( node == null )
    node = document;
  if ( tag == null )
    tag = '*';
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\s)"+searchClass+"(\s|$)");
  for (i = 0, j = 0; i < elsLen; i++) {
    if (node != document)
    if ( pattern.test(els[i].className) ) {
      classElements[j] = els[i];
      j++;
    }
  }
  return classElements;
  } */


// help from http://www.xml.com/pub/a/2005/02/09/xml-http-request.html
var req;
function loadXMLDoc(url,theData) 
{
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    req = new ActiveXObject('Microsoft.XMLHTTP');
  }
  var method;
  req.onreadystatechange = processReqChange;
  if(theData=='') { method="GET"; } 
  else { method = "POST"; }
  req.open(method, url, true);
  req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  req.setRequestHeader('X-Referer',document.location);
  req.send(theData);
}


function loadHTMLtoDiv(text,targetid,caller) {
  if(targetid) {
    if (myElement = document.getElementById(targetid)) {
      try {	
	myElement.innerHTML = text;
      }
      catch(e) {
	var newDiv = document.createElement('span');
	clearNode(myElement);
	newDiv.innerHTML = text;
	myElement.appendChild(newDiv);
      }
    }
  }
}

function clearNode(node) {
  if (node.hasChildNodes()) {
    while (node.childNodes.length > 0) {
      node.removeChild(node.childNodes.item(0));
    }
  } 
}

// thanks to http://www.mercurytide.com/knowledge/white-papers/issues-working-with-ajax
function getXMLNodeSerialisation(xmlNode) {
  //  alert(xmlNode);
  var text = false;
  if (xmlNode.nodeType != 3) {
  try {
    // Gecko-based browsers, Safari, Opera.
    //    var serializer = new XMLSerializer();
    text = serializer.serializeToString(xmlNode);
  }
  catch (e) {
    try {
      // Internet Explorer?  
      text = xmlNode.xml;
    }
    catch (e) { // Anybody?  Bueller?
      text = kSerialize(xmlNode);
    }
  }
  if (text == undefined) { // maybe someone only pretended to succeed
    text = kSerialize(xmlNode);
  }
  return text;
  }
  else {
    return xmlNode;
  }
}

function loadURLtoDiv(url,args,targetid) {
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
  var did = 0;
  if (req.readyState == 4) {
    // only if "OK" or "not modified"
    if ((req.status == 200) || (req.status == 304)) {
      var response  = req.responseXML.documentElement;
      var resp_arrN;
      var resp_arrA;
      var resp_arrF;
      var resp_arrS;
      try {
	drafter = response.getElementsByTagName("d")[0].firstChild.data;
      }
      catch (e) {}
      try {
	cs = response.getElementsByTagName("cs");
	if (!!cs.length && (cs.length > 0)) {
	  cstatusbox(cs[0]);
	}
      } catch(e) {}
      resp_arrN = response.getElementsByTagName("ant");
      if(!!resp_arrN.length && (resp_arrN.length > 0)) {
	//	printfire("doing processAnt");
	processAnt(response);
	did++;
      }
      resp_arrN = response.getElementsByTagName("anf");
      if(!!resp_arrN.length && (resp_arrN.length > 0)) {
	processAnf(response);
	did++;
      }
      resp_arrN = response.getElementsByTagName("nant");
      if(!!resp_arrN.length && (resp_arrN.length > 0)) {
	cacheAntVals(response);
	processAnf(response,'top');
	did++;
      }
      resp_arrA = response.getElementsByTagName("agreement");
      if(!!resp_arrA.length && (resp_arrA.length > 0)) {
	processAgreement(response);
	did++;
      }
      resp_arrS = response.getElementsByTagName("sdp");
      if(!!resp_arrS.length && (resp_arrS.length > 0)) {
	processDompath(response);
	did++;
      }
      
      if (!did) {
	statusbox("Your search didn't return anything usable: try a reload, or maybe there are no comments:  <a href=\"http://gplv3.fsf.org/comments/rt/changeshown.html?filename="+filename+"\">search again</a>\n\n<br/>HTTP Status: " + req.statusText+" "); //debug
      }
    }
    if (firstLoad == 1) {
      firstLoad = 0;
      loadFromHash();
    }
  }
}
  
function onNoteifyMouseover() {
  //this.onblur = onNoteifyBlur;
}

function processAnf(response,placement) {
  currently('loading selected annotations...');
  var newDiv = new Object;
  rtids_arr = response.getElementsByTagName("id");
  annotations_arr = response.getElementsByTagName("n");
  users_arr = response.getElementsByTagName("u");
  uagr_arr = response.getElementsByTagName("ua");
  agrtot_arr = response.getElementsByTagName("at");
  startnodes_arr = response.getElementsByTagName("i");

  var addCount = 0;;
  
  for (prI = 0; prI < annotations_arr.length; prI++) {
    if (annotations_arr[prI].firstChild) {
      var rtid = rtids_arr[prI].firstChild.data;
      if (!document.getElementById('rt'+rtid)) {
	var sn = startnodes_arr[prI].firstChild.data;
	if (!newDiv[sn]) {
	  // why doesn't IE see my stylesheets on these?
	  newDiv[sn] = document.createElement('div');
	  newDiv[sn].style.left = '55%';
	  newDiv[sn].style.position = 'absolute';
	  newDiv[sn].style.fontSize = '10pt';
	  newDiv[sn].style.fontWeight = 'normal';
	  if ((i = navigator.userAgent.indexOf('MSIE')) >= 0) {
	    newDiv[sn].style.width = '90%';
	  }	
	  togBtn = document.createElement('div');
	  togBtn.setAttribute('id','tog'+sn);
	  togBtn.setAttribute('class','noteClose a'+annotations_arr.length);
	  togX = document.createElement('span');
	  togX.setAttribute('id','x'+sn);
	  togX.setAttribute('onclick','killNoteGroup(\''+newDiv[sn].id+'\')');
	  togX.innerHTML = "[X]";
	  togBtn.appendChild(togX);
	  newDiv[sn].appendChild(togBtn);
	  newDiv[sn].itemcount = 1;
	}
	newDiv[sn].setAttribute('id',newDiv[sn].id+rtid+':');
	newDiv[sn].itemcount++;
	newDiv[sn].setAttribute('class','notegroup');

	addCount++;
	try { var tooltipString = getXMLNodeSerialisation(annotations_arr[prI]); } catch(e) { };
	if (!tooltipString) { var tooltipString = annotations_arr[prI].firstChild.data; }
	tooltipString.length > 165 ? tooltipSubString = tooltipString.substr(0,199) + '...' : tooltipSubString = tooltipString;
	if (!ticketObj[rtid]) { ticketObj[rtid] = new Object; ticketObj.length++;}
	ticketObj[rtid].link = makeLinkObj(rtid, getXMLNodeSerialisation(uagr_arr[prI]), agrtot_arr[prI].firstChild.data);      
	ticketObj[rtid].full = tooltipString;
	//alert("setting "+rtid+" excerpt to "+tooltipSubString);
	ticketObj[rtid].excerpt = tooltipSubString;
	ticketObj[rtid].user = users_arr[prI].firstChild ? users_arr[prI].firstChild.data : "";
	ticketObj[rtid].ua = getXMLNodeSerialisation(uagr_arr[prI]);
	ticketObj[rtid].startnode = startnodes_arr[prI].firstChild.data.replace(/note\.[0-9]+\./,'');;

	//speed: maybe use cssQuery instead
	//nodelist[rtid] = getElementsByClass('n'+rtid);
	var divChild = document.createElement('div');
	divChild.setAttribute('id','rt'+rtid);
	divChild.setAttribute('onclick','showFull(\''+rtid+'\')');
	//speed
	//divChild.setAttribute('onmouseover',"notemouseover(this,nodelist["+rtid+"])");
	//divChild.setAttribute('onmouseout','notemouseout(this,nodelist['+rtid+'])');
	divChild.innerHTML = '\
 <span style="font-size: smaller;font-style: italic" id="rt'+rtid+'user">'+ticketObj[rtid].user+': </span><span id="rt'+rtid+'txt">'+ticketObj[rtid].excerpt +'<a href="javascript:showFull(\''+rtid+'\')">[+]</a></span>';
	divChild.setAttribute('class','newannotation '+rtid);
	
	newDiv[sn].appendChild(divChild);
	
      }
    }
  }
  if (addCount > 0) {
    for (var sn in newDiv) {
      newDiv[sn].id = newDiv[sn].id.replace(/:$/,'');
      subjNode = document.getElementById(sn);
      if (placement && (placement == 'top')) {
	subjNode.insertBefore(newDiv[sn],subjNode.lastChild);
      }
      else {
	subjNode.appendChild(newDiv[sn]);
      }
      document.getElementById('tog'+sn).setAttribute('class','noteClose a'+newDiv[sn].itemcount);
      document.getElementById('tog'+sn).setAttribute('onmousedown',"dragStart(event,\'"+newDiv[sn].id+"\')");
      document.getElementById('x'+sn).setAttribute('onclick','killNoteGroup(\''+newDiv[sn].id+'\')');
    }
    unOverlap("notegroup",5);
  } 
  currently("Ready.");
}

function processAnt(response) {
  currently('highlighting this page according to your query...');
  var rtidsBySn;
  var rtidsByP;
  var rtnArray;
  rtnArray = cacheAntVals(response);
  rtidsBySn = rtnArray[0];
  rtidsByP = rtnArray[1];
  //  printfire("rtidsBySn = "+rtidsBySn);
  highlightSelections(rtidsBySn);
  PLinks(rtidsByP);
  addAllLink();
  unOverlap("newannotation",5); // thse won't overlap anymore
  currently('Ready.');
}

function addAllLink() {
  if (ticketObj.length < 150) {
//    loadAll();
    var sLnk = document.createElement('a'); 
    sLnk.setAttribute('href','#all');  
    sLnk.setAttribute('onClick','loadAll()');
    sLnk.appendChild(document.createTextNode('[show all]')); 
     document.getElementById('statustext').appendChild(document.createTextNode(' ')); 
     document.getElementById('statustext').appendChild(sLnk); 
  }
}
function PLinks(rtidsByP) {
  for (var p in rtidsByP) {
    if(document.getElementById(p)) {
    var pLnk = document.createElement('span');
    pLnk.setAttribute('id','pLnk'+p);
    pLnk.setAttribute('class','plink');
    pLnk.style.display = 'none';
    pLnk.innerHTML = '<a href="#'+p+'">&para;</a> <a href="javascript:getnotes(\''+rtidsByP[p].join(":")+'\')">&rarr;</a>';
    document.getElementById(p).appendChild(pLnk);
    document.getElementById(p).setAttribute('onmouseover','show("pLnk'+p+'")');
    document.getElementById(p).setAttribute('onmouseout','hide("pLnk'+p+'")');
    }
  }
}
function show(id) {
  document.getElementById(id).style.display = 'inline';
}
function hide(id) {
  document.getElementById(id).style.display = 'none';
}


function cacheAntVals(response) {
  // this used to be part of processAnt but then I needed it for process nant.
  // populates global ticketObj[] for these rtids and returns
  // the rtidsbysn that we need for highlighting.
  var selections_arr = response.getElementsByTagName("s");
  var startnodes_arr = response.getElementsByTagName("i");
  var rtids_arr = response.getElementsByTagName("id");
  var queues_arr = response.getElementsByTagName("qn");
  var rtidsBySn = new Object;
  var rtidsByP = new Object;
  for (prI = 0; prI < selections_arr.length; prI++) {
    if (selections_arr[prI].firstChild) {
      rtids_arr[prI].firstChild.data ? rtid = rtids_arr[prI].firstChild.data : rtid = "error";
      //printfire('prI '+prI+',rtid '+rtid);
      if (!ticketObj[rtid]) { ticketObj[rtid] = new Object; ticketObj.length++;}
      ticketObj[rtid].startnode = startnodes_arr[prI].firstChild.data.replace(/note\.[0-9]+\./,'');;
      ticketObj[rtid].queue = queues_arr[prI].firstChild.data;
      ticketObj[rtid].selection = selections_arr[prI].firstChild.data;
      startp = ticketObj[rtid].startnode.replace(/.s[\d+]$/, '');
      if(!rtidsBySn[ticketObj[rtid].startnode]) {
	rtidsBySn[ticketObj[rtid].startnode] = new Array(rtid);
	//	printfire('1 pushing '+rtid+' to '+ticketObj[rtid].startnode);
	//printfire("1 rtidsBySn[ticketObj[rtid].startnode][0] = "+rtidsBySn[ticketObj[rtid].startnode][0]);
	rtidsByP[startp] = new Array(rtid);
      }
      else {
	//	printfire('2 pushing '+rtid+' to '+ticketObj[rtid].startnode);
	rtidsBySn[ticketObj[rtid].startnode].push(rtid);
	//printfire("2 rtidsBySn[ticketObj[rtid].startnode][0] = "+rtidsBySn[ticketObj[rtid].startnode][0]);
	rtidsByP[startp].push(rtid);
      }
    }
  }

  return Array(rtidsBySn, rtidsByP);
}

function highlightSelections(rtidsBySn) {
  // fixme todo: p drm.0 and sent drm.0.0 get called separately, and this fucks things up.
  // (this is GIGO: nothing should be drm.0, only drm.0.0 .  Still, should be fixed at some point)
  // ah, now it has to be fixed so we can highlight new annots.
  for (var section in rtidsBySn) {
    //printfire('section is '+section);    	
      var sectObj = document.getElementById(section);
    if(document.getElementById(section)) {
      //printfire('section is '+section);    	
    var Selections = new Array();
    var Rtids = new Array();
    for (var i = 0; i < rtidsBySn[section].length; i++) {
      var rtid = rtidsBySn[section][i];
      Selections.push(ticketObj[rtid].selection);
      Rtids.push(rtid);
    }
    intense_annot(section,Selections,Rtids);	      
    }
  }
}
function makeLinkObj(rtid,agreement,agrtot) {
    returnLink = rtid ? '<a href="/comments/rt/readsay.html?filename='+filename+'&id='+rtid+'">read/say more</a> ' : '[problem with ticket link]';
    	  agreestr = agreement;
	  agreestr = agreestr.replace(/<\/?ua>/g,'');
	  agreestr = agreestr.replace(/<\/?span>/g,'');
	  agreestr = agreestr.replace(/<\/?b>/g,'');
    	  if (agrtot > 0) {
    	    returnLink += ' [<span id="agrtot'+rtid+'">'+agrtot+'</span> agreed]';
    	  }
	  return returnLink;
}


  
function onNoteifyBlur() {
//	noteNode = document.getElementById('noteify');
//	dump(noteNode);
//	submitComment();
}

function checkKeyPressed(keyEvent) {
  if (!document.getElementById("noteify")) {
    keyEvent = (keyEvent) ? keyEvent : (window.event) ? event : null;
    if (keyEvent) {
      var charCode = (keyEvent.charCode) ? keyEvent.charCode :
	((keyEvent.keyCode) ? keyEvent.keyCode :
	 ((keyEvent.which) ? keyEvent.which : 0));
      //printfire(charCode); // to find out others
      if (charCode == 99) { XpathSel(); }
    }
  }
}


function intense_annot(rootid,selections,rtids) {
  //alert('rootid is '+rootid.toString());
  selecObj = new Array;
  rootObj = new Array;
  //var rooty = document.getElementById(rootid);
  var rooty = document.getElementById(rootid.toString());
  var divstart = rooty.innerHTML.indexOf('<div');
  var DIVstart = rooty.innerHTML.indexOf('<DIV');
  divstart = (DIVstart > divstart) ? DIVstart : divstart;
  if (divstart == -1) {
    rootSer = getXMLNodeSerialisation(rooty,'noattr');
    var divstartSer = rootSer.indexOf('<div');
    rootstr = rooty.innerHTML;
  }
  if (divstart > -1) {
    var olddivs = rooty.innerHTML.substring(divstart,rooty.innerHTML.length);
    rootstr = rooty.innerHTML.substring(0,divstart);
  }
  else if (divstartSer > -1) {
    var olddivs = rootSer.substring(divstartSer,rootSer.length);
    rootstr = rootSer.substring(0,divstart);
  }
  // couple lines of html-ignoring help from
  // http://www.notestips.com/80256B3A007F2692/1/NAMO5RNV2S 
  // by Mike Golding, 9/24/2003
  //Extract HTML Tags
  var regexp=/<[^<>]*>/ig;
  var rootHTMLArray = rootstr.match(regexp);
  //Replace HTML tags (may not work in Safari)
  rootStrippedHTML = rootstr.replace(regexp,"$!$");
  
  var root_words = rootStrippedHTML.split(/[\s$!]+/);
  
  // there is one rootObj, each word in the root sentence a sub-obj
  for (var i=0; i<root_words.length; i++) {
    rootObj[i] = new Object;
    rootObj[i].word = root_words[i];
    rootObj[i].intensity = 0;
    rootObj[i].annotations = new Array;
  }
  
  // each selecObj[n] refers to a single selection, and then has a .words[] array
  // that holds each word in the selection.
  for (var i=0; i<selections.length; i++) {
    selecObj[i] = new Object;
    selecObj[i].selection = selections[i];
    selecObj[i].words = new Array(selections[i].split(/[\s$!]+/));
    selecObj[i].rtid = rtids[i];
    // this initializes a handy "matchindex" attribute that tells you 
    // which array index of rootObj has the first char of the match
    // (so you can skip the irrelevant indices that precede it)
    intense_doRoughMatch(selections,selecObj,root_words,i);
  }
  intense_incrWords(selecObj,rootObj);
  returnstring = intense_genReturn(rootObj,rootHTMLArray);
  if (olddivs) {
    returnstring += olddivs;
  }
  loadHTMLtoDiv(returnstring,rootid);
}


function intense_doRoughMatch(selections,selecObj,root_words,i) {   
  var rer = deParen(selections[i]);
  rer = rer.replace(/[\s$!]+$/g,'');
  var foo = rer.replace(/ \b/g,'[\\s\$\!]+');


  var re = new RegExp(foo,'im');
  var roughMatch = rootStrippedHTML.match(re);

  if (roughMatch) {
    selecObj[i].matchindex = (roughMatch.index - selections[i].length);
    var n,sum;
    for (n=0,sum=0; sum<roughMatch.index&&n<root_words.length; n++) {
      if (root_words[n]) {
	sum += root_words[n].length + 1;
      }
    }
    n == 0 ? selecObj[i].arrayIndex = 0 : selecObj[i].arrayIndex = n-2;
  }
  else {
    //  printfire(++noMatch+': id: '+selecObj[i].rtid+'\nrM: '+roughMatch+'\nre: '+re+'\nrSH: '+rootStrippedHTML);
  }
}


function intense_incrWords(selecObj,rootObj) {

// try: first match the whole selectstring against the whole
// rootstring, and find the index/offset of the first character of the
// selectstring in the rootstring.  then split the rootstring... but
// how do you know which array index corresponds to the offset?  do
// selecObj[i].length until you get to the offset?
// for each selection...
 for (var j=0; j<selecObj.length; j++) { 
   // for each word in the selection...
   for (var k=0; k<selecObj[j].words.length; k++) {
     // start at the object's predetermined arrayindex, and look only until you get to
     // the arrayindex + the number of words in the selection...
     var skip = 0;
     for (var i=selecObj[j].arrayIndex; i<selecObj[j].words[k].length+selecObj[j].arrayIndex+2; i++) {
       // I'm clueless as to why I need an additional [m] incrementer, but this so far produces
       // my desired result: selecObj[j].words[k][m] is a single word from this selection.
       if (rootObj[i]) {
	 var m=skip;
	 var matched = '';
	 if (selecObj[j].words[k][m]) {
	   //	   var re = new RegExp(''+deParen(selecObj[j].words[k][m])+'','m');
	   var re = new RegExp(''+deParen(selecObj[j].words[k][m])+'','m');
	   //printfire('word: '+selecObj[j].words[k][m]+' re:'+re);
	   if (re) {
	     //printfire('re: '+re+' word: '+rootObj[i].word);
	     try { var thisMatch = rootObj[i].word.match(re); } catch(e) { /* printfire('error on '+re); */ }
	   }
	   if (thisMatch) {
	     rootObj[i].intensity++;
	     matched = 'true';
	     rootObj[i].annotations.push(selecObj[j].rtid);
	     skip++;
	   }
	   if (matched && ((m+1) == selecObj[j].words[k].length)) {
	     // ? fixme?
	     //skip++;
	   }
	 }
       }
     }
   }
 }
}
function killNoteGroup(divid) {
  myDiv = document.getElementById(divid);
  myDiv.parentNode.removeChild(myDiv);
  // ugh, we can't set it to nothing, but this clutters it with hashes
  window.location.hash = window.location.hash.replace(divid,'#');
  if(window.location.hash.length >= 2) { window.location.hash = window.location.hash.replace(/[^^]#/g,''); }
  if(window.location.hash.length >= 2) { window.location.hash = window.location.hash.replace(/::/g,':'); }
  if(window.location.hash.length >= 2) { window.location.hash = window.location.hash.replace(/#:/g,'#'); }
  if(window.location.hash.length >= 2) { window.location.hash = window.location.hash.replace(/##/g,'#'); }
  if(window.location.hash.length >= 2) { window.location.hash = window.location.hash.replace(/\%23/g,''); }
}
function killnotes(ids) {
  if (ids.indexOf(":") > -1) {
    var id_arr = ids.split(':');
  }
  else {
    var id_arr = new Array(ids);
  }
  for (var kn=0; kn<id_arr.length; kn++) {
    cancelNote("rt"+id_arr[kn]);
  }
}
function intense_genReturn(rootObj,rootHTMLArray) {  
 var intensereturn = '';
  for (i=0; i<rootObj.length; i++) {
    if(rootObj[i].intensity > 0) {
      intensereturn += '<span class="highlight n'+rootObj[i].annotations.join(" n")+' a'+((rootObj[i].intensity > 24) ? 24 : rootObj[i].intensity)+'" onclick="getnotes(\''+rootObj[i].annotations.join(":")+'\',\''+ticketObj[rootObj[i].annotations[0]].startnode+'\')" title="'+rootObj[i].annotations.length+' comments">'+rootObj[i].word+' </span>';
    }
    else { intensereturn += rootObj[i].word+' '; }
  }
  // thanks again, Mike Golding
  for(r=0;intensereturn.indexOf("$!$") > -1;r++){
    intensereturn = intensereturn.replace("$!$", rootHTMLArray[r]);
  }
  return intensereturn;
}

function getnotes(rtids,startid) {
  currently("loading annotations on this bit...");
  if (startid) {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id','loading');
    newDiv.setAttribute('class','notegroup');
    // IE doesn't seem to honor these things from the stylesheet unless 
    // I declare them here too.
    newDiv.style.left = '55%';
    newDiv.style.position = 'absolute';
    newDiv.style.width = '40%';
    newDiv.innerHTML = '<span class="noteClose">Loading comments on this text...</span>';
    document.getElementById(startid).appendChild(newDiv);
  }
  if((!window.location.hash.match(rtids) && (!window.location.hash.match(/^#all/)))) {
    location.hash+=rtids+':';
  }
  loadXMLDoc('/comments/rt/getannotations-devel.html','ids='+rtids);
  currently("Ready.");
}

function getElementStyle(elem, IEStyleProp, CSSStyleProp) {
  if (elem.currentStyle) {
    if (elem.currentStyle[IEStyleProp] != '') {
      return elem.currentStyle[IEStyleProp];
    }
  } else if (window.getComputedStyle) {
    var compStyle = window.getComputedStyle(elem, "");
    if (compStyle != '') {
      return compStyle.getPropertyValue(CSSStyleProp);
    }
  }

  // we haven't returned yet, so:
  // default to going back to yellow -- must sync with stet.css, augh, FIXME somehow
  if (CSSStyleProp == 'border') {
    return '#FFFF00';
  }
  if (CSSStyleProp == 'background') {
    return '#f0ecb3';
  }
  return "";
}


function notemouseover(ref,nodelist) {
    ref.style.prevBG=getElementStyle(ref,'background','background');
    ref.style.prevBRDT=getElementStyle(ref,'border-top','border-top');
    ref.style.prevBRDB=getElementStyle(ref,'border-bottom','border-bottom');
    ref.style.background="#f9f";
    // too slow to do with getElementsById here -- must pre-process
  for (i = 0; i<nodelist.length; i++) {
    nodelist[i].style.prevBG=getElementStyle(nodelist[i],'background','background');
    nodelist[i].style.prevBRDT=getElementStyle(nodelist[i],'border-top','border-top');
    nodelist[i].style.prevBRDB=getElementStyle(nodelist[i],'border-bottom','border-bottom');
    nodelist[i].style.background="#f9f";
  }
}
function notemouseout(ref,nodelist) {
    ref.style.background=ref.style.prevBG;
    ref.style['border-top']=ref.style.prevBRDT;
    ref.style['border-bottom']=ref.style.prevBRDB;
  for (i = 0; i<nodelist.length; i++) {
    nodelist[i].style.background=nodelist[i].style.prevBG;
    nodelist[i].style['border-top']=nodelist[i].style.prevBRDT;
    nodelist[i].style['border-bottom']=nodelist[i].style.prevBRDB;
  }
}


function showFull (rtid) {
  myCollapsed = document.getElementById('rt'+rtid+'txt');
  loadHTMLtoDiv(ticketObj[rtid].full+' '+ticketObj[rtid].link+' <a href="javascript:showExcerpt(\''+rtid+'\')">[-]</a>',myCollapsed.id);
  myCollapsed.parentNode.setAttribute('onclick','');
  unOverlap("newannotation",5);
}

function showExcerpt (rtid) {
  myFull = document.getElementById('rt'+rtid+'txt');
  loadHTMLtoDiv(ticketObj[rtid].excerpt+' <a href="javascript:showFull(\''+rtid+'\')">[+]</a>',myFull.id);
  myFull.parentNode.setAttribute('onclick','showFull(\''+rtid+'\')');
  unOverlap("newannotation",5);
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
function currently(text) {
  //  loadHTMLtoDiv(text,'currently');
  //  alert(text);
}

function loginbox() {
    loadHTMLtoDiv('This license has been released; no further comments are being accepted.','login');

}
function idLinks(cs) {
  try { var say = cs.getElementsByTagName('say')[0].firstChild; } catch(e) { }
    var id = cs.getElementsByTagName('ci')[0].firstChild; 
    var list = cs.getElementsByTagName('l')[0].firstChild;
    var newMe = document.createElement('span');
    newMe.appendChild(document.createTextNode(say.data+' '));
    newMe.appendChild(document.createTextNode(id.data+' '));
    newMe.appendChild(document.createTextNode(' '));
    Lnk = document.createElement('a');
    Lnk.setAttribute('href',list.data);
    Lnk.appendChild(document.createTextNode('[see thread]'));
    newMe.appendChild(Lnk);
    newMe.appendChild(document.createTextNode(' '));
    sLnk = document.createElement('a');
    sLnk.setAttribute('href','http://gplv3.fsf.org/comments/rt/changeshown.html?came_from='+location.pathname+'&filename='+filename);
    sLnk.appendChild(document.createTextNode('search'));
    newMe.appendChild(sLnk);
    st = document.getElementById('statustext');
    ch = st.childNodes;
    while (ch.length > 0) {
	st.removeChild(ch.item(0));
    }
    st.appendChild(newMe);
}

// whoa clean me up asap, what a mess for nothing now.  fixme.
function qLinks(cs) {
    var say = cs.getElementsByTagName('say')[0].firstChild;
    var q = cs.getElementsByTagName('q')[0].firstChild; 
    var r = cs.getElementsByTagName('r')[0].firstChild; 
    var list = cs.getElementsByTagName('l')[0].firstChild;
    var ra = cs.getElementsByTagName('ra')[0].firstChild; 
    var t =  cs.getElementsByTagName('t')[0].firstChild; 
    var newMe = document.createElement('span');
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
    try { newMe.appendChild(rLnk); } catch(e) { /* alert(e); */ }
    newMe.appendChild(document.createTextNode(' '));
    lLnk = document.createElement('a');
    lLnk.setAttribute('href',list.data);
    lLnk.appendChild(document.createTextNode('[list]'));
    newMe.appendChild(lLnk);

if ((!filename.match(/lgpl-draft-1/)) && (!filename.match(/gplv3-draft-3/)) && (!filename.match(/gplv3-draft-4/))) {
    newMe.appendChild(document.createTextNode(' '));
    rat = document.createElement('a');
    rat.setAttribute('href',location.pathname+"?filename="+filename+"&Query=%20Creator%20=%20'ratiodoc'%20%20AND%20'CF.NoteUrl'%20LIKE%20'"+filename+"'%20&Order=DESC&OrderBy=id&StartAt=1&Rows=80");
    rat.appendChild(document.createTextNode('[rationale]'));
    newMe.appendChild(rat);
}
    newMe.appendChild(document.createElement('br'));
    newMe.appendChild(document.createTextNode('(found '+t.data+': click highlights to show.) ')); // , showing '+rng.data));
 
    sLnk = document.createElement('span');
    sLnk.setAttribute('id','searchlink');
    sLnkA = document.createElement('a');
    sLnkA.setAttribute('href','http://gplv3.fsf.org/comments/rt/changeshown.html?filename='+filename+'&came_from='+location.pathname);
    sLnkA.appendChild(document.createTextNode('search'));
    sLnk.appendChild(sLnkA)
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
    idLinks(cs);
  } catch (e) {
    qLinks(cs);
  }
  loginbox();
}

function deParen(str) {
  str = str.replace(/[\\]*\(/g,'\\(');
  str = str.replace(/[\\]*\)/g,'\\)');
  str = str.replace(/[\\]*\[/g,'\\[');
  str = str.replace(/[\\]*\]/g,'\\]');
  return str;
}

function newQuery() {
  loadURLtoDiv('/comments/rt/changeshown.html','came_from='+document.location,'statustext');
}

function cancelNewQuery() {
  //  loadHTMLtoDiv(status.last,'statustext');
}

function kSerialize(node,attrflag) {
  var returnme = '';
  // really this should encompass any non-closed tag, but I'm not sure if I
  // can generalize it without just getting a whole list.
  if (node.nodeName.toLowerCase() == 'br') {

    returnme += '<'+node.nodeName.toLowerCase()+'/>';
  }
  else if (node.nodeType == 1) {
    returnme += '<'+node.nodeName.toLowerCase();
    try { node.hasAttributes(); var hasAttr = 1; } catch (e) { 
      if (attrflag != 'noattr') { 
	return node+" [your browser doesn't support hasAttributes so this is funky: reload will fix]"; } 
    };
    if (!!hasAttr) {
      for (var attrCt = 0; attrCt < node.attributes.length; attrCt++) {
	returnme += ' '+node.attributes[attrCt].nodeName.toLowerCase()+'="'+node.attributes[attrCt].nodeValue+'"';
      }
    }
    returnme += '>';
    if (node.hasChildNodes()) {
      for (var nodeCt = 0; nodeCt < node.childNodes.length; nodeCt++) {
	returnme += kSerialize(node.childNodes[nodeCt]);
      }
    } 
    returnme += '</'+node.nodeName.toLowerCase()+'>';
  }
  else if (node.nodeType == 3) {
    returnme += node.data;
  }
  return returnme;
}

// end of code by Orion Montoya

//* dragging behavior courtesy of brainjar.com.  License is GPL2+
//*****************************************************************************
// Do not remove this notice.
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
dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
dragObj.elNode.style.top  = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";
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

// removed encodeBase64(str){ } since I don't use it

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
