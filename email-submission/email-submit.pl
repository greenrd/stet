#!/usr/bin/perl -wT
# Copyright 2005 Software Freedom Law Center, Inc.
#
# This program is free software: you may copy, modify, or redistribute it
# and/or modify it under either:
#
#  (a) the terms of the GNU Affero General Public License as published by
#      the Free Software Foundation, either version 3 of the License, or
#      (at your option) any later version.
#    or
#  (b) the terms of the GNU General Public license, version 2, as
#      published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
# General Public License and/or GNU General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License
# and the GNU General Public License along with this program. If not, see
# <http://www.gnu.org/licenses/>.

# Copyright (c) 2005 Software Freedom Law Center
# Author: Orion Montoya <orion@mdcclv.com>

use Data::Dumper;
use MIME::Base64;

use Frontier::Client;

use lib '/usr/share/request-tracker3.2/lib';
use lib '/usr/share/request-tracker3.2/libexec';

use lib '/usr/share/request-tracker3.4/lib';
use lib '/usr/share/request-tracker3.4/libexec';

#use RT::Interface::CLI;
use RT;

#print header('text/xml');

my $returnme;

if(param()) {

$url = param('NoteUrl');
$url =~ s/.*\/([^\/]+)/$1/;
$dompath = param('DomPath');
$selectedtext = param('Selection');
# $start = param('StartNode');
$startid = param('StartNodeId');
# $end = param('EndNode');
$endid = param('EndNodeId');
$notetext = param('NoteText');

#($name, $pass) = split(/:/, decode_base64(cookie('__ac')));
$name = cookie('stetStubCookie');
$name =~ s/"//g;


#$req = RPC::XML::request->new('getUsers');
#$resp = RPC::XML::Parser->new()->parse(STREAM);

#$server = Frontier::Client->new(url => "http://gplv3.fsf.org:8800/launch/acl_users/Users/acl_users",
#				username => ""
#				password =>  "");


#$resp = $server->call('getUsers');

$returnme .=  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'."\n";
$returnme .= "<response>\n";

$returnme .= "<annotation>\n";
$returnme .= " <n>$notetext $name</n>\n";
$returnme .= " <e>$endid</e>\n";
$returnme .= " <s>$selectedtext</s>\n"; 
$returnme .= " <i>$startid</i>\n";

#print STDERR ref($resp) ? $resp->value : "Error: $resp";

#print STDERR Dumper($resp);

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
                      Owner => $name,
                      Requestor => $name,
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
$returnme .= " <u>$name</u>\n";

$returnme .= "</annotation>\n";
$returnme .= "</response>\n";
print $returnme;




