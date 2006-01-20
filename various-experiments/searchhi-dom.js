/* The MIT Licence, for code from kryogenix.org
**
** Code downloaded from the Browser Experiments section of kryogenix.org
** is licenced under the so-called MIT licence. The licence is below.
**
** Copyright (c) 1997-2005 Stuart Langridge
**
** Permission is hereby granted, free of charge, to any person obtaining a
** copy of this software and associated documentation files (the "Software"),
** to deal in the Software without restriction, including without limitation
** the rights to use, copy, modify, merge, publish, distribute, sublicense,
** and/or sell copies of the Software, and to permit persons to whom the
** Software is furnished to do so, subject to the following conditions:
**
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
** FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
** DEALINGS IN THE SOFTWARE.
*/

/* http://www.kryogenix.org/code/browser/searchhi/ */
/* Modified 20021006 to fix query string parsing and add case insensitivity */

function highlightWord(node,word,tooltip,rtid,altClass) {
    var haveHighlighted = false;
    // Iterate into this node's childNodes
    if (!haveHighlighted) {
    if (node.hasChildNodes) {
      //      dump("iterating into child nodes\n");
      var hi_cn;
      for (hi_cn=0;hi_cn<node.childNodes.length;hi_cn++) {
	//		  dump("going in to "+node.childNodes[hi_cn].nodeName+"\nfor "+word+"\n");
	highlightWord(node.childNodes[hi_cn],word,tooltip,rtid);
      }
      //      dump("done with child nodes\n");
      }

    }
    
    // And do this node itself
    if (node.nodeType == 3) { // text node
      if (!haveHighlighted) {
      //tempNodeVal = escape(node.nodeValue.toLowerCase());
      //tempWordVal = escape(word.toLowerCase());
      node.nodeValue = node.nodeValue.replace(/\s+/g,' ');
      
      tempNodeVal = node.nodeValue;
      tempWordVal = word;
      tempWordVal = tempWordVal.replace(/\W+/g,'[\\W\\s]+');
      //tempWordVal = tempWordVal.replace(/\W+/g,' ');
      //      dump('trying with\n'+escape(tempWordVal)+'\non\n'+escape(tempNodeVal)+"\n");
      var re = new RegExp(tempWordVal, 'mi');
      if ((ni = tempNodeVal.search(re)) && (ni != -1)) {
	//if (tempNodeVal.indexOf(tempWordVal) != -1) {
	//	dump(tempWordVal+' matched!\n');
	pn = node.parentNode;
	if (pn.className != "highlight") {
	  // word has not already been highlighted!
	  //				nv = escape(node.nodeValue);
	  nv = node.nodeValue;
	  //ni = tempNodeVal.indexOf(tempWordVal);
	  // Create a load of replacement nodes
	  before = document.createTextNode(nv.substr(0,ni));
	  docWordVal = nv.substr(ni,word.length);
	  after = document.createTextNode(nv.substr(ni+word.length));
	  hiwordtext = document.createTextNode(docWordVal);
	  hiword = document.createElement("span");
//	  if (altClass) { dump("altClass is "+altClass+"\n"); }
//	  hiword.className = altClass ? altClass : "highlight";
	  hiword.className = "highlight";
	  //	  tooltiptext = document.createTextNode(tooltip);
	    tooltipString = (new XMLSerializer).serializeToString(tooltip);
	  hiword.title = tooltipString;
	  //	  dump('tooltiptext is '+tooltiptext.+"\n");
	  hiword.appendChild(hiwordtext);
	  if (tooltip) {
	    annote = document.createElement("span");
	    annote.className = "annotation";
            linkToTkt = document.createElement("a");
	    linkToTkt.href = '/rt/Ticket/Display.html?id='+rtid;
	    linkToTkt.appendChild(document.createTextNode('[+]'));
	    annoteText = document.createElement('span');
	    //	    tooltipString = (new XMLSerializer).serializeToString(tooltip);
	    //	    while(tooltip.firstChild) {
	    //  dump("firstchild is "+tooltip.firstChild+"\n");
	    //  annote.appendChild(tooltip.removeChild(tooltip.firstChild));
	    //}

//	    alert('tooltip is '+tooltip);
            annoteText.innerHTML = tooltipString;
//	    annoteText.appendChild(tooltiptext);
	    annote.appendChild(annoteText);
	    //	    annote.appendChild(tooltipString);
	    annote.appendChild(linkToTkt);
	    hiword.appendChild(annote);
	  }
	  pn.insertBefore(before,node);
	  pn.insertBefore(hiword,node);
	  pn.insertBefore(after,node);
	  pn.removeChild(node);
	  haveHighlighted = true;
	}
	else if (pn.className == "noteLive") {
	  pn.setAttribute("class","highlight");
	}
	}
      }
      /* 		else { */
      /* 		  highlightWord(node.parentNode,word,tooltip); */
      /* 		} */
      
    }

}

function XPointerHighlight() {
//	if (!document.createElement) return;
//	ref = document.referrer;
//	if (ref.indexOf('?') == -1) return;
//	qs = ref.substr(ref.indexOf('?')+1);
//	qsa = qs.split('&');
//	for (i=0;i<qsa.length;i++) {
//		qsip = qsa[i].split('=');
//	        if (qsip.length == 1) continue;
//        	if (qsip[0] == 'q' || qsip[0] == 'p') { // q= for Google, p= for Yahoo

//		hardcoded = 'copying, distribution and modification';
//		hardid = 'terms.0.p2.s1';

//			words = unescape(qsip[1].replace(/\+/g,' ')).split(/\s+/);
//	                for (w=0;w<words.length;w++) {


//				highlightWord(document.getElementsByTagName("body")[0],words[w]);
//				highlightWord(document.getElementById(hardid),hardcoded);
//				highlightWord(document.getElementsByTagName("body")[0],hardcoded);



 //               	}
//	        }
//	}
}

//window.onload = XPointerHighlight;
window.onload = loadXMLDoc('http://localhost/cgi-bin/rt-test.pl?NoteUrl='+location.href);
