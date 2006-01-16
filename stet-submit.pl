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

use lib '/usr/share/request-tracker3.4/lib';
use lib '/usr/share/request-tracker3.4/libexec';
#use RT::Interface::CLI;
use RT;

print header('text/xml');

my $returnme;
if(param()) {
    
$url = param('NoteUrl');
$dompath = param('DomPath');
$selectedtext = param('Selection');
$start = param('StartNode');
$startid = param('StartNodeId');
$end = param('EndNode');
$endid = param('EndNodeId');
$notetext = param('NoteText');

$returnme .=  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'."\n";
$returnme .= "<response>\n";

$returnme .= "<annotation>\n";
$returnme .= " <n>$notetext</n>\n";
$returnme .= " <e>$endid</e>\n";
$returnme .= " <s>$selectedtext</s>\n"; 
$returnme .= " <i>$startid</i>\n";



#    print Dumper($content);

}





RT::LoadConfig();
RT::Init();
use RT::Ticket;
use RT::CurrentUser;
my $CurrentUser = RT::SystemUser();

use MIME::Entity;

  print STDERR "Have extra data '$j'\n" if $j;
  my $ticket = new RT::Ticket($CurrentUser);
  my $ticket_body = MIME::Entity->build(Data => $notetext,
                                       Type => 'text/plain');
  my %ticket_vals = ( Queue => 'General',
                      Subject => $selectedtext,
                      Owner => 'root',
                      Requestor => 'moglen@columbia.edu',
                      InitialPriority => '11',
                      FinalPriority => '20',
                      MIMEObj => $ticket_body,
		      'CustomField-1' => $selectedtext,
		      'CustomField-2' => $dompath,
		      'CustomField-3' => $url,
		      'CustomField-4' => $startid,
		      'CustomField-5' => $endid,
		      'CustomField-6' => $notetext,
                    );
  my ($id, $transaction_object, $err) = $ticket->Create(%ticket_vals);
  print STDERR $err . "\n" if $err;

$returnme .= " <id>$id</id>\n";

$returnme .= "</annotation>\n";
$returnme .= "</response>\n";
print $returnme;
