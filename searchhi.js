/* http://www.kryogenix.org/code/browser/searchhi/ */
/* Modified 20021006 to fix query string parsing and add case insensitivity */

/* This is believed to be copyrighted by Stuart Langridge; the license is
 * unkowning but we are clarifying with the author.  */

function highlightWord(node,word,tooltip,altClass) {
    var haveHighlighted = false;

    // Iterate into this node's childNodes
    if (!haveHighlighted) {
    if (node.hasChildNodes) {
      //      dump("iterating into child nodes\n");
      var hi_cn;
      for (hi_cn=0;hi_cn<node.childNodes.length;hi_cn++) {
	//		  dump("going in to "+node.childNodes[hi_cn].nodeName+"\nfor "+word+"\n");
	highlightWord(node.childNodes[hi_cn],word,tooltip);
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
	  if (altClass) { dump("altClass is "+altClass+"\n"); }
	  hiword.className = altClass ? altClass : "highlight";
	  hiword.title = tooltip;
	  hiword.appendChild(hiwordtext);
	  if (tooltip) {
	    annote = document.createElement("span");
	    annote.className = "annotation";
	    annoteText = document.createTextNode(tooltip);
	    annote.appendChild(annoteText);
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
window.onload = loadXMLDoc('http://localhost/cgi-bin/rt-test.pl');
