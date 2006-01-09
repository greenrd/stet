<!-- Copyright (C) 2005   Software Freedom Law Center, Inc.
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

  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="//head/title"/></title>
        <script type="text/javascript" src="stet.js"/>
        <link rel="stylesheet" type="text/css" href="stet.css"/>
      </head>
      <body onkeypress="checkKeyPressed(event);" bgcolor="#FFFFFF">
<div id="topbar" class="topbar">
<span id="statustext" class="statustext">Loading comments.  If you're still reading this, it's a strong indication that we do not properly support your browser.  You may need to email your comments instead, or try another recent Gecko-based browser.</span>	  <span id="querydiv" style="display:none"></span>
	  <span id="login" class="login"></span>
</div>
        <div id="maintext">
          <xsl:apply-templates/>
        </div>
        <!--        <div id="noteify">
          <span id="newNoteDomPathTxt" class="newNoteDomPathTxt">empty</span>
          <input id="newNoteDomPath" name="newNoteDomPath" type="hidden" value="dompath"/><br/>
          <span id="newNoteSelectionTxt" class="newNoteSelectionTxt">empty</span>
          <input id="newNoteSelection" name="newNoteSelection" type="hidden" value="selection"/><br/>

          <textarea id="newNoteText" name="newNoteText" rows="20" cols="20"/>
        </div> -->
      </body>
    </html>
  </xsl:template>



  <xsl:template match="//head">
    <section id="title"><p id="title.0"><sent id="title.0.0"><h1><xsl:value-of select="title"/></h1></sent></p>
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

<!--	<p><strong>Notes 2006-01-04</strong> I've broken through a few logjams that have been preventing many comments from displaying, and I'm glad to have exposed several other problems with my method for inserting these comments, but also to see all the comments that have been made so far.  The current implementation was already a plan B, and so now I need a plan C.  Also I see many of the &lt;em&gt; are not being closed.</p>

	<p><strong>Notes 2006-01-06</strong>
	<ul>
	<li>You can now agree with a comment, or once you've agreed you may revoke your agreement if you change your mind.</li>
	<li>Comments are now excerpted if they're long.  Toggle them by clicking anywhere on them, or on the [+]</li>
	<li>agreement/disagreement/ticketlink are all behind the [+] now</li>
	<li>Comments now ask you to put a subject or summary: a change in presumption, from presuming brevity to presuming lengthiness.</li>
	</ul>
	</p>

    <p>Also, you now need to be <a href="http://gplv3.fsf.org:8800/launch/login_form">logged in</a> to the main gplv3.fsf.org site in order to make comments.  Alert box to this effect coming soon.</p>

-->
<!--    <p>Toggle display of <a href="javascript:toggle('add')">additions</a> | <a href="javascript:toggle('del')">deletions</a> [none yet on these documents]</p> -->

    <xsl:for-each select="section">
      <h3><xsl:value-of select="title"/></h3>
      <section id="{@id}" name="{@id}">
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

