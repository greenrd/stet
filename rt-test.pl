#!/usr/bin/perl -w
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

use CGI qw(:standard);
use lib '/usr/share/request-tracker3.4/lib/';
use lib '/etc/request-tracker3.4/';
use RT::Interface::CLI qw(CleanEnv GetCurrentUser GetMessageContent);


use RT;
RT::LoadConfig();
RT::Init();
use RT::Ticket;
use RT::Transactions;
use RT::CurrentUser;
use RT::CustomField;
use Data::Dumper;
my $CurrentUser = RT::Interface::CLI::GetCurrentUser();
my $CustomFieldObj = RT::CustomField->new($CurrentUser);
#my $Query= " Requestor.EmailAddress LIKE 'moglen' ";
my $Query;
 if(param()) {

     $NoteUrl = param('NoteUrl');
#     $Query = " CustomFields.NoteUrl LIKE '$NoteUrl' ";
 }
# else {
    $Query= " Requestor.EmailAddress LIKE 'moglen' ";
#}

my $TicketObj = new RT::Tickets( $RT::SystemUser );
$TicketObj->FromSQL($Query);
$TicketObj->Query();
$TicketObj->LimitCustomField(
     CUSTOMFIELD => 3,
     VALUE => $NoteUrl,
     OPERATOR => "="
);
$count = $TicketObj->CountAll();
#print $TicketObj->loc("Found [quant,_1,annotation].\n",$count);

print header('text/xml');
my $returnme;
$returnme .=  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'."\n";
$returnme .= "<response>\n";
$TicketObj->GotoFirstItem();
my $annotation;
while (my $item = $TicketObj->Next) {
$annotation = "";
    my $Transactions = $item->Transactions;
  while (my $Transaction = $Transactions->Next) {
          next unless ($Transaction->Type =~ /^(Create|Correspond|Comment$)/);

    my $attachments = $Transaction->Attachments;
     my $CustomFields = $item->QueueObj->TicketCustomFields();
    $attachments->GotoFirstItem;
    my $message = $attachments->Next;
    $annotation .= $message->Content;
}
#
#    my $Attachs = $item->TransactionObj->Attachments->First;
#    my $content = $Attachs->Content;
# while (my $CustomField = $CustomFields->Next()) {
# my $CustomFieldValues=$Ticket->CustomFieldValues($CustomField->Id);
    $returnme .= "<annotation>\n";
#    $returnme .= " <url>" . $item->FirstCustomFieldValue('NoteUrl') . "</url>\n";
#    $returnme .= " <dompath>" . $item->FirstCustomFieldValue('NoteDomPath') . "</dompath>\n";
    $returnme .= " <n>$annotation</n>\n";
    $returnme .= " <e>" . $item->FirstCustomFieldValue('NoteEndNodeId') . "</e>\n";
    $returnme .= " <s>" . $item->FirstCustomFieldValue('NoteSelection') . "</s>\n"; 
    $returnme .= " <i>" . $item->FirstCustomFieldValue('NoteStartNodeId') . "</i>\n";

	  $returnme .= " <id>" . $item->id . "</id>\n";
    $returnme .= "</annotation>\n";

#    print Dumper($content);

    }

$returnme .= "</response>\n";
#    printf ("%s", $item->CustomField-3);

print $returnme;
#print Dumper($TicketObj);
