#!/usr/bin/perl -wT
# Copyright (C) 2005, 2006   Software Freedom Law Center, Inc.
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

use MIME::Base64;
use Frontier::Client;

use lib '/usr/share/request-tracker3.2/lib';
use lib '/usr/share/request-tracker3.2/libexec';

use lib '/usr/share/request-tracker3.4/lib';
use lib '/usr/share/request-tracker3.4/libexec';

#use RT::Interface::CLI;
use RT;
use RT::Ticket;
use RT::CurrentUser;
use RT::Queues;
require "/var/www/stet/stetsubs.pl";
RT::LoadConfig();
RT::Init();

print header('text/xml');

if(param()) {

$url = param('NoteUrl');

$urlpath = $url;
$urlpath =~ s/http:\/\/([^\/]+)(\/.*)\?/$2/;

$url =~ s/.*\/([^\/]+)/$1/;

$dompath = param('DomPath');
$selectedtext = URI::Escape::uri_unescape(param('Selection'));
$notesubj = URI::Escape::uri_unescape(param('NoteSubj'));
# $start = param('StartNode');
$startid = param('StartNodeId');
# $end = param('EndNode');
$endid = param('EndNodeId');
$notetext = URI::Escape::uri_unescape(param('NoteText'));

}

our $name;
my ($CurrentUser, $resp) = getUser();

print STDERR "auth boolean for $name was $resp\n";
if ($resp == 0) {

print <<"EOF";
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<response>
 <cs>Your comment was not submitted because you could not be authenticated.  <a href=\"changeshown.html\">change query</a></cs>
 <annotation>
  <u>Authentication error</u>
  <i>$startid</i>
  <e>$endid</e>
  <n>Your comment was not saved.  You need to <a href="http://gplv3.fsf.org:8800/launch/login_form?came_from=$urlpath">login</a> in order to make comments.  The text of your comment was:<br/> <strong>Subject:</strong>$notesubj<br/>$notetext</n>
  <s>$selectedtext</s>
  <id>x</id>
  <ua>x</ua>
  <at>x</at>
 </annotation>
</response>
EOF
}


elsif ($resp == 1) {

param('queue') ? $queue = param('queue') : $queue = "Inbox";

#my $CurrentUser = RT::CurrentUser->new();
#$CurrentUser->LoadByName($name);

my $ThisQueue = RT::Queue->new($CurrentUser);
  $ThisQueue->Load($queue);
  if ($CurrentUser->HasRight( Right => 'SeeQueue', Object => $ThisQueue )) {
      $realqueue = $queue;
  }
  else {
      $realqueue = "Inbox";
  }
    
my $returnme;
$returnme .=  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'."\n";
$returnme .= "<response>\n";
$returnme .= "<cs>Your comment was submitted.  <a href=\"javascript:newQuery()\">change query</a></cs>\n";
$returnme .= "<annotation>\n";
$returnme .= " <n>$notetext</n>\n";
$returnme .= " <e>$endid</e>\n";
$returnme .= " <s>$selectedtext</s>\n"; 
$returnme .= " <i>$startid</i>\n";
# two more come after we submit to RT...


#print STDERR ref($resp) ? $resp->value : "Error: $resp";

#print STDERR Dumper($resp);



use MIME::Entity;

print STDERR "stet-submit name is '$name'\n";
  my $ticket = new RT::Ticket($CurrentUser);
  my $ticket_body = MIME::Entity->build(Data => $notetext,
                                       Type => 'text/plain');
  my %ticket_vals = ( Queue => $realqueue,
                      Subject => $notesubj,
#                      Owner => 'Nobody',
                      Requestor => \$CurrentUser, #$name,
                      #InitialPriority => '11',
                      #FinalPriority => '20',
                      MIMEObj => $ticket_body,
		      'CustomField-1' => $selectedtext,
		      'CustomField-2' => $dompath,
		      'CustomField-3' => $url,
		      'CustomField-4' => $startid,
		      'CustomField-5' => $endid,
		      'CustomField-6' => $notetext,
		      'CustomField-7' => $name,
		      );
  my ($id, $transaction_object, $err) = $ticket->Create(%ticket_vals);
  print STDERR $err . "\n" if $err;

$returnme .= " <id>$id</id>\n";
$returnme .= " <u>$name</u>\n";
$returnme .= " <ua>unagree</ua>\n";
  $returnme .= " <at>1</at>\n";

$returnme .= "</annotation>\n";
$returnme .= "</response>\n";
print $returnme;


}

