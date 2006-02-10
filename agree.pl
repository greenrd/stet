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

use CGI qw/:standard/;
use Data::Dumper;

use lib '/usr/share/request-tracker3.2/lib';
use lib '/usr/share/request-tracker3.2/libexec';
use lib '/usr/share/request-tracker3.4/lib';
use lib '/usr/share/request-tracker3.4/libexec';
use RT;
use RT::Ticket;
use RT::CustomField;
use RT::CurrentUser;
use RT::Record;

use Frontier::Client;
use MIME::Entity;
use MIME::Base64;

$id = param('rtid');
$opn = param('opn');

do "xmlpass.pl";

if (($name, $pass) = split(/:/, decode_base64(cookie('__ac')))) {
     $name =~ s/\"//g;
     $server = Frontier::Client->new(url => 'http://cs_auth:eeSahp1n@gplv3.fsf.org:8800/launch/acl_users/Users/acl_users',
 				    username => $username,
 				    password =>  $password);
    
    
     $resp = $server->call('authRemoteUser',$name,$pass);
 }
 else {
     ${$resp} = 0;
 }

RT::LoadConfig();
RT::Init();

#my $CurrentUser = new RT::CurrentUser();
#$CurrentUser->LoadByName($name);

$CurrentUser = RT::SystemUser();

$Ticket = new RT::Ticket($CurrentUser);
$Ticket->Load($id);

#$values = $cf->ValuesForObject( $Ticket );
$values = $Ticket->CustomFieldValues(7);
#print Dumper($values);
#print "ticket has ".$values->count." customfieldvalues\n";
# this is trusting the user input, but it really needs to check the values
if (($opn =~ /unagree/) && ($values->HasEntry($name))) {
    ($bool, $message) = $Ticket->DeleteCustomFieldValue(Field => "7", Value => $name);
    $agreebool = "unagree";
    print STDERR "DeleteCustomFieldValue said $bool, $message\n";
}

else {
    if  (!$values->HasEntry($name)) {
	($bool, $message) = $Ticket->AddCustomFieldValue(Field => "7", Value => $name);
	print STDERR "AddCustomFieldValue said $bool, $message\n";
	$agreebool = "agree";
    }
}
if (!$agreebool) { $agreebool = "stop it"; }
# }
# }

# my $CustomFieldValues=$Ticket->CustomFieldValues($CustomField->Id);
#    $returnme .= " <e>" . $item->FirstCustomFieldValue('NoteEndNodeId') . "</e>\n";






# if (${$resp} == 0) {
if ($agreebool =~ /agree/) {
print header('text/xml');

    print <<"EOF";
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
 <response>
  <agreement>
    <cs>You now $agreebool with <a href="/comments/rt/readsay.html?id=$id">$id</a>.  <a href=\"/rt/NoAuth/changeshown.html\">change shown comments</a></cs>
    <id>$id</id>
    <b>$agreebool</b>
  </agreement>
 </response>

EOF
}
elsif ($agreebool =~ "stop it") {
print header('text/xml');

    print <<"EOF";
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
 <response>
  <agreement>
    <cs>Hmm, I'm confused about your agreement.  Try again later, or reload to toggle your opinion.  <a href=\"/rt/NoAuth/changeshown.html\">change shown comments</a></cs>
    <id>$id</id>
    <b>$agreebool</b>
  </agreement>
 </response>

EOF
}

#}


