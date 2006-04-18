<!-- Copyright (C) 2005, 2006   Software Freedom Law Center, Inc.
--   Author: Orion Montoya <orion@mdcclv.com>
--
-- This software gives you freedom; it is licensed to you under version
-- 3 of the GNU Affero General Public License, along with the
-- additional permission in the following paragraph.
--
-- This notice constitutes a grant of such permission as is necessary
-- to combine or link this software, or a modified version of it, with
-- Request Tracker (RT), published by Jesse Vincent and Best Practical
-- Solutions, LLC, or a derivative work of RT, and to copy, modify, and
-- distribute the resulting work.  RT is licensed under version 2 of
-- the GNU General Public License.
-- 
-- This software is distributed WITHOUT ANY WARRANTY, without even the
-- implied warranties of MERCHANTABILITY and FITNESS FOR A PARTICULAR
-- PURPOSE.  See the GNU Affero General Public License for further
-- details.
--  
-- You should have received a copy of the GNU Affero General Public
-- License, version 3, and the GNU General Public License, version 2,
-- along with this software.  If not, see <http://www.gnu.org/licenses/>.
-->
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="1.0">

  <xsl:output method="html"/>

  <xsl:template match="/gpl">
    <html>
      <head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title><xsl:value-of select="//head/title"/></title>
        <script type="text/javascript" src="stet-intense-shorter.js"/>
	<script type="text/javascript" language="javascript">
window.onload = initPage();
</script>

        <link rel="stylesheet" type="text/css" href="stet-ie.css"/>
      </head>
      <body onkeypress="checkKeyPressed(event);" bgcolor="#FFFFFF">
<div id="topbar" class="topbar">
<span id="statustext" class="statustext">Loading comments.  Please be patient: this can take a little while.  If nothing has shown up after about 15-30 seconds (Konqueror, IE), try reloading.  In the event of continued failures, you will probably need to <a href="/comments/email.html">email your comments</a> instead.   You can <a href="http://gplv3.fsf.org/comments/rt/changeshown.html?came_from=readsay.html">search</a> and <a href="http://gplv3.fsf.org/comments/rt/readsay.html?Query=%20'CF.NoteUrl'%20LIKE%20'gplv3-draft-1'%20&amp;Order=DESC">browse</a> comments on any browser.</span><span id="querydiv" style="display:none"></span>
	  <span id="login" class="login"></span>
</div>
      <div class="portlet" id="portlet-dogear">
        <div class="portletBody">
          <img alt="" src="http://gplv3.fsf.org/dogear.png" />
        </div>
      </div>

   <h1 id="portal-logo">
     <a href="http://gplv3.fsf.org" accesskey="1">GPLv3</a>
</h1>

    <ul id="portal-globalnav">
        <li class="plain">
            <a href="http://gplv3.fsf.org">Home</a></li>
        <li class="selected">
            <a href="http://gplv3.fsf.org/comments/">Comments</a></li>
        <li class="plain">
            <a href="http://gplv3.fsf.org/wiki/">Wiki</a></li>
        <li class="plain">
            <a href="http://gplv3.fsf.org/press">Press</a></li>
        <li id="portaltab-support" class="plain">
            <a href="http://gplv3.fsf.org/support">Support</a></li>
    </ul>

<ul id="portal-personaltools">
</ul>
          


        <div id="maintext">
          <xsl:apply-templates/>
        </div>

<!--	<div id="bottombar">
	<a href="stet-latest.tar.gz">get the latest source code for this comment system</a>
	</div>	 -->
      </body>
    </html>
  </xsl:template>



  <xsl:template match="//head">
    <section id="title"><h1><p id="title.0"><sent id="title.0.0"><xsl:value-of select="title"/></sent></p></h1>
    <p id="title.1"><sent id="title.1.0"><xsl:value-of select="pubdate"/></sent></p>
    <p id="status.0"><sent id="status.0.0"><strong><xsl:value-of select="status"/></strong></sent></p>
    <p id="copyright.0"><sent id="copyright.0.0">Copyright (C) <xsl:value-of select="copyright/year"/> 
    
    <xsl:text> </xsl:text>
    <xsl:value-of select="copyright/holder"/>
    <br/>
    <xsl:value-of select="legalnotice/address/street"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="legalnotice/address/city"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="legalnotice/address/state"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="legalnotice/address/postcode"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="legalnotice/address/country"/>
    <br/> <br/>
    <xsl:value-of select="legalnotice/p"/>
    </sent></p>
    </section>    

  </xsl:template>
  
  <xsl:template match="//body">
    <p><a href="javascript:XpathSel()">select some text and then type "c" to submit comments.</a></p>
<!--    <p>Toggle display of <a href="javascript:toggle('add')">additions</a> | <a href="javascript:toggle('del')">deletions</a> [none yet on these documents]</p> -->

    <xsl:for-each select="section">
      <section id="{@id}" name="{@id}">
       <p class="sectTitle" id="{@id}.0"><sent id="{@id}.0.0"><xsl:value-of select="title"/></sent></p>
       <p class="sectTitle sub" id="{@id}.0.0.0"><sent id="{@id}.0.0.0.0"><xsl:value-of select="subtitle"/></sent></p>
        <xsl:for-each select="p">
          <p id="{@id}" name="{@id}">
            <xsl:for-each select="sent">
              <sent id="{@id}" name="{@id}">
                <xsl:apply-templates select='node()|@*' />
                <xsl:text>  </xsl:text>
              </sent>
            </xsl:for-each>
            <xsl:if test="orderedlist/listitem/p">
              <ol type="a">
                <xsl:for-each select="orderedlist/listitem/p">
                  <li>
                    <xsl:for-each select="sent">
                      <xsl:apply-templates select='node()|@*' />
                      <!-- <sent id="{@id}">
                        <xsl:copy-of select="del|add"/>
                        <xsl:value-of select="."/>                      
                      </sent> -->
                      
                    </xsl:for-each>
                  </li>
                </xsl:for-each>
              </ol>
            </xsl:if>
          </p>
        </xsl:for-each>
      </section>
    </xsl:for-each>

  </xsl:template>

<xsl:template match="node()|@*">
  <xsl:copy>
    <xsl:apply-templates select="node()|@*" />
  </xsl:copy>
</xsl:template>

<xsl:template match="del|add">
  <em class="{name(.)}" reason="{@reason}">
    <xsl:value-of select="."/>
  </em>
</xsl:template>

<xsl:template match="//sent[@id='terms.0.p2.s1']">
  <span class="highlight"><xsl:value-of select="."/></span>
</xsl:template>


</xsl:stylesheet>

