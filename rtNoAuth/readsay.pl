# Copyright (C) 2005   Software Freedom Law Center, Inc.
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

use CGI qw/:standard/;
require "/var/www/stet/stetsubs.pl";

sub debug {
    print STDERR @_ . "\n";
}

my ($name, $resp, $pass, $agr_vals, $CurrentUser);
getUser(\$CurrentUser);

my $rsslink = "/rt/NoAuth/rssresults.rdf?Query=".$ARGS{'Query'};

my $Tickets = RT::Tickets->new($CurrentUser);
$Tickets->FromSQL($ARGS{'Query'});
$Tickets->OrderBy( FIELD => 'id', ORDER => $ARGS{'Order'});


sub getThread($) {
    my $itemref = shift;
    my $item = $$itemref;
    my $Transactions = $item->Transactions;
    my $allcomments = '';
    while (my $Transaction = $Transactions->Next) {
	next unless ($Transaction->Type =~ /^(Create|Correspond|Comment$)/);
		     
		     my $attachments = $Transaction->Attachments;
#    my $CustomFields = $item->QueueObj->TicketCustomFields();
		     my $CustomFields = $item->QueueObj->CustomFields();
		     $attachments->GotoFirstItem;
		     while (my $message = $attachments->Next) {
			 $allcomments .= "<blockquote><h4>".$message->Subject."</h4>\n".$message->Content."<br/><span class=\"posted\">noted by user#".$message->CreatorObj->Name."</span>\n";
		     }
		     print "</blockquote>" x $attachments->count;
		 }
	
	return $allcomments;
}

sub getAgreement($) {
my $itemref = shift;
my $item = $$itemref;
my $showagree = '';
	$agr_vals = $item->CustomFieldValues(7);
	if (${$resp} == 1) {
	    while (my $value = $agr_vals->Next) {
		if (($name) && ($value->Content eq $name)) {
		    $showagree = "<a href=\"javascript:iAgree('unagree','".$item->id."')\" label=\"you have indicated that you agree with this\" name=\"you have indicated that you agree with this\">unagree</a>";
		}
	    }
	    if (!$showagree) {
		$showagree = "<a href=\"javascript:iAgree('agree','".$item->id."')\">agree</a>";
	    }
	}
	else {
	    $showagree = "<a href=\"http://gplv3.fsf.org:8800/launch/login_form?came_from=/comments/showcomments.pl\">login</a> to agree";
	}
return $showagree;
}	


</%INIT>

