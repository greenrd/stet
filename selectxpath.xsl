<!-- Copyright 2005, Software Freedom Law Center, Inc.

-- This program is free software: you may copy, modify, or redistribute it
-- and/or modify it under the terms of the GNU Affero General Public
-- License as published by the Free Software Foundation, either version 3
-- of the License, or (at your option) any later version.
-- This program is distributed in the hope that it will be useful, but
-- WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
-- General Public License and/or GNU General Public License for more
-- details.
--
-- You should have received a copy of the GNU Affero General Public License
-- and the GNU General Public License along with this program. If not, see
-- <http://www.gnu.org/licenses/>.
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
    <h1><xsl:value-of select="title"/></h1>
    <p><xsl:value-of select="pubdate"/></p>
    <p>Copyright (C) <xsl:value-of select="copyright/year"/> 
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
    </p>
    
  </xsl:template>
  
  <xsl:template match="//body">
    <p><a href="javascript:XpathSel()">select some text and then type "c" to submit comments.</a>
    <p><a href="javascript:LimitQuery()">limit your query by various criteria.</a></p>
  </p>
    <p>Toggle display of <a href="javascript:toggle('add')">additions</a> | <a href="javascript:toggle('del')">deletions</a></p>

    <xsl:for-each select="section">
      <h2><xsl:value-of select="title"/></h2>
      <section id="{@id}">
        <xsl:for-each select="p">
          <p id="{@id}">
            <xsl:for-each select="sent">
              <sent id="{@id}">
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

