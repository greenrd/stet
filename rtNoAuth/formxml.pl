# Copyright (C)  2006   Software Freedom Law Center, Inc.
# Author: Orion Montoya <orion@mdcclv.com>
#
# This software gives you freedom; it is licensed to you under version
# 3 of the GNU Affero General Public License, along with the
# additional permission in the following paragraph.
#
# This notice constitutes a grant of such permission as is necessary
# to combine or link this software, or a modified version of it, with
# Request Tracker (RT), published by Jesse Vincent and Best Practical
# Solutions, LLC, or a derivative work of RT, and to copy, modify, and
# distribute the resulting work.  RT is licensed under version 2 of
# the GNU General Public License.
#  
# This software is distributed WITHOUT ANY WARRANTY, without even the
# implied warranties of MERCHANTABILITY and FITNESS FOR A PARTICULAR
# PURPOSE.  See the GNU Affero General Public License for further
# details.
#  
# You should have received a copy of the GNU Affero General Public
# License, version 3, and the GNU General Public License, version 2,
# along with this software.  If not, see <http://www.gnu.org/licenses/>.

use XML::DOM;

my $parser = new XML::DOM::Parser;
my $doc = $parser->parsefile ("/var/www/stet/gplv3-draft-1.xml");

my $nodes = $doc->getElementsByTagName ("sent");
my $n = $nodes->getLength;

$selection = "software are designed";
our ($dompath, $startid, $matched, $notesubj, $ticket_body, $form, $wholefile) = 0;
for (my $i = 0; $i < $n; $i++)
{
    my $node = $nodes->item($i);
    my $sent = $node->toString;
    $sent =~ s/\s+/ /g;
    if ($sent =~ m/$selection/) {
    print $sent;
	$matched++;

	$startid = $node->getAttribute('id');
	$dompath = $node->getParentNode->getParentNode->getParentNode->getNodeName;
	$dompath .= "/".$node->getParentNode->getParentNode->getNodeName;
	$dompath .= "[id=".$node->getParentNode->getParentNode->getAttributeNode('id')->getValue."]/";
	$dompath .= $node->getParentNode->getNodeName;
	$dompath .= "[id=".$node->getParentNode->getAttributeNode('id')->getValue."]/";
	$dompath .= $node->getNodeName."[id=".$node->getAttributeNode('id')->getValue."]"; 
	
    }
}

print $startid."\n".$dompath."\n";
 # Avoid memory leaks - cleanup circular references for garbage collection
 $doc->dispose;
