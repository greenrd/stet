#!/usr/bin/perl -wT
# Copyright (C) 2006   Software Freedom Law Center, Inc.
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


use CGI qw(:standard);
use lib '/usr/share/request-tracker3.4/lib/';
use lib '/etc/request-tracker3.4/';

use lib '/usr/share/request-tracker3.2/lib/';
use lib '/etc/request-tracker3.2/';

use MIME::Base64;
use Frontier::Client;

use RT;
use RT::Interface::Web;
use RT::Ticket;
use RT::Transactions;
use RT::CurrentUser;
use RT::CustomField;
use Data::Dumper;
use RT::Users;
use RT::Groups;
use RT::GroupMembers;
use RT::Principals;

RT::LoadConfig();
RT::Init();

sub debug {
    print STDERR @_ . "\n";
}



if (($name, $pass) = split(/:/, decode_base64(cookie('__ac')))) {
    $name =~ s/\"//g;
    $server = Frontier::Client->new(url => "http://gplv3.fsf.org:8800/launch/acl_users/Users/acl_users",
				    username => "stet_auth",
				    password =>  "fai1Iegh");
    $resp = $server->call('authRemoteUser',$name,$pass);
}
else {
    ${$resp} = 0;
}

my $CurrentUser = RT::CurrentUser->new;

if (${$resp} == 0) {
    $CurrentUser->LoadByName("Nobody"); 
}
elsif (${$resp} == 1) {
    $CurrentUser->LoadByName($name);
}

#my $CurrentUser = RT::Interface::CLI::GetCurrentUser();
#my $CustomFieldObj = RT::CustomField->new($CurrentUser);

#my $Query;
if(param()) {
    $NoteUrl = param('NoteUrl');
 }



my $TicketObj = new RT::Tickets( $CurrentUser );
my ($Query, $ShowQuery) = &BuildQuery;

$TicketObj->FromSQL($Query);

# %session = '';

 %ARGS = param();

&LimitByArgs;
$TicketObj->Query();

# $TicketObj->FromSQL($Query);
if($NoteUrl) {
 $TicketObj->LimitCustomField(
 			     CUSTOMFIELD => 3,
 			     VALUE => $NoteUrl,
 			     OPERATOR => "="
 			     );
}

$count = $TicketObj->CountAll();
$printargs = "$ShowQuery: (found $count tickets)";
print header();
print start_html(-title => 'browse GPLv3 Comments - stet 0.1',
		 -style =>{-src=>'stet.css'},
		 );

my $returnme;
$returnme .= "<div id=\"maintext\">\n";
$returnme .= "<h3>Currently showing: $printargs.  <a href=\"javascript:newQuery()\">change</a></h3>\n";
$TicketObj->GotoFirstItem();
my $annotation;

## FIXME: I don't know why this (1) is necessary, that's for sure; emacs doesn't tell me anything useful.
if (1) {
while (my $item = $TicketObj->Next) {
    $allcomments = "";
    my $Transactions = $item->Transactions;
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
	
	$showagree = '';	
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
	

	$returnme .= "<div class=\"onecomment\">\n";
	$returnme .= " <h4><a href=\"showcomments.pl?id=".$item->id."\">" . $item->id . ": ". $item->Subject . "</a></h4>\n";
	$noteSelection = $item->FirstCustomFieldValue('NoteSelection');
	$noteSelection =~ s/</&lt;/g;
	$noteSelection =~ s/>/&gt;/g;
	$returnme .= "<span class=\"ontextLabel\">Regarding text:</span> <span class=\"ontextText\">" . $noteSelection ."</span><br/>\n"; 
	$returnme .= "<span class=\"ontextLabel\"> in section:</span> <span class=\"nodelink\">" . $item->FirstCustomFieldValue('NoteStartNodeId') . "</span><br/>\n";
#	$returnme .= " created by " . $item->Requestors->UserMembersObj->First->Name . "\n";
	$returnme .= " submitted by:" . $item->Requestors->MemberEmailAddressesAsString . "<br/>\n";
	$returnme .= " <ua>" . $showagree . "</ua>\n";
	if ($agr_vals->count > 0) {
	    $returnme .= "<span class=\"agreecount\">".$agr_vals->count." agree</span>\n";
	}
	$returnme .= " $allcomments<br/>\n";

	if (${$resp} == 1) {
	    $returnme .= "<form action=\"addcomments.pl\" method=\"POST\">
<textarea name=\"addcomments\" cols=\"50\" rows=\"20\" onfocus=\"if(this.value=='Enter additional comments here') {this.value='';}\" onblur=\"if(this.value==''){this.value='Enter additional comments here';}\">";
	    if(param('addcomments')) {
		$returnme .= param('addcomments');
	    }
	    else {
		$returnme .= "Enter additional comments here";
	    }
	    $returnme .= "</textarea><br/>
<input type=\"submit\" value=\"submit\"/></form>";
	}

	$returnme .= "</div>\n";
	
    }
}
$returnme .= "</body></html>\n";

print $returnme;



sub BuildQuery {
    my ($Query,$ShowQuery);
if(param('id')) {  
    $Query = " id=".param('id');
    $ShowQuery = " comment id # ".param('id');
}

    # this uses nearly pure SQL since my attempts at using things like
    # ->LimitWatcher() have failed
    if (param('ValueOfWatcher')) {
	if (param('WatcherOp') == "LIKE") {
	    $arg = "%".param('ValueOfWatcher')."%";
	}
	else {
	    $arg = param('ValueOfWatcher');
	}
	$Query .= " AND ". param('WatcherField')." ".param('WatcherOp'). ' "%'.param('ValueOfWatcher').'%"';
	$ShowQuery .= '<br/>'.param('WatcherField')." ".param('WatcherOp'). ' "%'.param('ValueOfW\atcher');
    }
    return ($Query, $ShowQuery);
}






# LimitByArgs adapted from $RT/lib/Interface/Web.pm's ProcessSearchQuery
# (out of desperation)
sub LimitByArgs {

    # {{{ Limit priority
    if ( param('ValueOfPriority') ne '' ) {
        $TicketObj->LimitPriority(
            VALUE    => param('ValueOfPriority'),
            OPERATOR => param('PriorityOp')
        );
	debug('limiting by '.param('ValueOfPriority'));
    }

    # }}}
    # {{{ Limit owner  # this should be changed for actor
    if ( param('ValueOfOwner') ne '' ) {
        $TicketObj->LimitOwner(
            VALUE    => param('ValueOfOwner'),
            OPERATOR => param('OwnerOp')
        );
	debug('limiting by '.param('ValueOfOwner'));
    }

    # }}}
    # {{{ Limit requestor email
     if ( param('ValueOfWatcher') ne '' ) {
	 my ($field, $property) = split(/\./,param('WatcherField'));
         $TicketObj->LimitWatcher(
#             TYPE     => $field,
             VALUE    => param('ValueOfWatcher'),
             OPERATOR => param('WatcherOp'),

        );
	debug('limiting by '.param('ValueOfWatcher'));
    }

    # }}}
    # {{{ Limit Queue
    if ( param('ValueOfQueue') ne '' ) {
        $TicketObj->LimitQueue(
            VALUE    => param('ValueOfQueue'),
            OPERATOR => param('QueueOp')
        );
	debug('limiting by '.param('ValueOfQueue'));
    }

    # }}}
    # {{{ Limit Status
    if ( param('ValueOfStatus') ne '' ) {
        if ( ref( param('ValueOfStatus') ) ) {
            foreach my $value ( @{ param('ValueOfStatus') } ) {
                $TicketObj->LimitStatus(
                    VALUE    => $value,
                    OPERATOR => param('StatusOp'),
                );
            }
	    debug('limiting by '.@{param('ValueOfStatus')}[0]);
        }
        else {
            $TicketObj->LimitStatus(
                VALUE    => param('ValueOfStatus'),
                OPERATOR => param('StatusOp'),
            );
	    debug('limiting by '.param('ValueOfStatus'));
        }

    }

    # }}}
    # {{{ Limit Subject
    if ( param('ValueOfSubject') ne '' ) {
            my $val = param('ValueOfSubject');
        if (param('SubjectOp') =~ /like/) {
            $val = "%".$val."%";
        }
        $TicketObj->LimitSubject(
            VALUE    => $val,
            OPERATOR => param('SubjectOp'),
        );
	debug('limiting by '.$val);
    }

    # }}}    
    # {{{ Limit Dates
    if ( param('ValueOfDate') ne '' ) {
        my $date = ParseDateToISO( param('ValueOfDate') );
        ARGS{'DateType'} =~ s/_Date$//;

        if ( ARGS{'DateType'} eq 'Updated' ) {
            $TicketObj->LimitTransactionDate(
                                            VALUE    => $date,
                                            OPERATOR => param('DateOp'),
            );
        }
        else {
            $TicketObj->LimitDate( FIELD => ARGS{'DateType'},
                                            VALUE => $date,
                                            OPERATOR => param('DateOp'),
            );
        }
    }

    # }}}    
    # {{{ Limit Content
    if ( param('ValueOfAttachment') ne '' ) {
        my $val = param('ValueOfAttachment');
        if (param('AttachmentOp') =~ /like/) {
            $val = "%".$val."%";
        }
        $TicketObj->Limit(
            FIELD   => param('AttachmentField'),
            VALUE    => $val,
            OPERATOR => param('AttachmentOp'),
        );
    }

    # }}}   

 # {{{ Limit CustomFields

    foreach my $arg ( keys %ARGS ) {
        my $id;
        if ( $arg =~ /^CustomField(\d+)$/ ) {
            $id = $1;
        }
        else {
            next;
        }
        next unless ( param($arg) );

        my $form = param($arg);
        my $oper = param->{ "CustomFieldOp" . $id };
        foreach my $value ( ref($form) ? @{$form} : ($form) ) {
            my $quote = 1;
            if ($oper =~ /like/i) {
                $value = "%".$value."%";
            }
            if ( $value =~ /^null$/i ) {

                #Don't quote the string 'null'
                $quote = 0;

                # Convert the operator to something apropriate for nulls
                $oper = 'IS'     if ( $oper eq '=' );
                $oper = 'IS NOT' if ( $oper eq '!=' );
            }
            $TicketObj->LimitCustomField( CUSTOMFIELD => $id,
                                                   OPERATOR    => $oper,
                                                   QUOTEVALUE  => $quote,
                                                   VALUE       => $value );
        }
    }
}


# {{{ sub ParseDateToISO

=head2 ParseDateToISO

Takes a date in an arbitrary format.
Returns an ISO date and time in GMT

=cut

sub ParseDateToISO {
    my $date = shift;

    my $date_obj = RT::Date->new($CurrentUser);
    $date_obj->Set(
        Format => 'unknown',
        Value  => $date
    );
    return ( $date_obj->ISO );
}

# }}}



=cut

