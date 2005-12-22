/* This is believed to be copyrighted by Stuart Langridge; the license is */
/* unkowning but we are clarifying with the author.  */
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
  dump("doing highlightword of "+word+"\n");
  if (node.hasChildNodes) {
    var iCN;
    dump("this node has "+node.childNodes.length+" childNodes\n");
    for (iCN=0;iCN<node.childNodes.length;iCN++) {
      dump("going in to "+node.childNodes[iCN].nodeName+"\nfor "+word+" iCN="+iCN+"\n");
      highlightWord(node.childNodes[iCN],word,tooltip,rtid);
    }
  }
  if (node.nodeType == 3) { // text node
      dump("node is "+node.nodeName+"\n");
    if (!haveHighlighted) {
      dump("haven't highlighted\n");
    paragraph = node.parentNode.parentNode;
    paragraphString = (new XMLSerializer).serializeToString(paragraph);
    paragraphString.replace(/\s+/g,' ');
    tempNodeVal = paragraphString;
    tempWordVal = word;
    tempWordVal = tempWordVal.replace(/\W+/g,'[\\W\\s]+(<[^>]+>)?');

        var re = new RegExp(tempWordVal, 'mi');
	//    var re = new RegExp("software", 'mig');
    dump("re is "+re+"\n");
	    tooltipString = (new XMLSerializer).serializeToString(tooltip);
	    var ticketLink = rtid ? '<a href="/rt/Ticket/Display.html?id='+rtid+'">[+]</a>' : '[reload for ticket link]';

    paragraphString = paragraphString.replace(re,'<span class="highlight">$&<span class="annotation">'+tooltipString+ticketLink+' </span></span>');
    //     dump("replaced on "+$&+"\n");
    dump("pString is now "+paragraphString+"\n");
    node.parentNode.parentNode.innerHTML = paragraphString;
    
    //    haveHighlighted=true;
    }
  }
}

/*      if ((ni = tempNodeVal.search(re)) && (ni != -1)) {
	//if (tempNodeVal.indexOf(tempWordVal) != -1) {
		dump(tempWordVal+' matched!\n');
	pn = node.parentNode;
	//	if (pn.className != "highlight") {
	  // word has not already been highlighted!
	  //				nv = escape(node.nodeValue);
	  nv = paragraphString;
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
            annoteText.innerHTML = tooltipString;
//	    annoteText.appendChild(tooltiptext);
	    annote.appendChild(annoteText);
	    //	    annote.appendChild(tooltipString);
	    annote.appendChild(linkToTkt);
	    hiword.appendChild(annote);
	  }
	  dump(before);
	  //	  pn.innerHTML="";
	  pn.insertBefore(before,node);
	  pn.insertBefore(hiword,node);
	  pn.insertBefore(after,node);
	  pn.removeChild(node);
      }
	  haveHighlighted = true;

	  //	}
	  //	else if (pn.className == "noteLive") {
	  //	  pn.setAttribute("class","highlight");
	  //	}
	}
  }
}

*/

window.onload = loadXMLDoc('http://localhost/cgi-bin/rt-test.pl?NoteUrl='+location.href);
