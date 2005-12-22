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
# and the GNU General Public License along with this program.  If not, see
# <http://www.gnu.org/licenses/>.

use CGI qw/standard/;
use MIME::Base64;
use Frontier::Client;
use URI::Escape;

sub cleanNoteSel($) {
    my $item = shift;
    my $noteSelection = $$item->FirstCustomFieldValue('NoteSelection');
    $noteSelection =~ s/</&lt;/g;
    $noteSelection =~ s/>/&gt;/g;
    return $noteSelection;
}

sub showAgree($) {
    my $item = shift;
    my $agr_vals;
    our ($resp,$name);
    my $showagree = '';	
    $agr_vals = $$item->CustomFieldValues(7);
    if ($resp == 1) {
	while (my $value = $agr_vals->Next) {
	    if (($name) && ($value->Content eq $name)) {
#		    $showagree = "<a label=\"you have indicated that you agree with this\" name=\"you have indicated that you agree with this\">unagree</a>";
		$showagree = "unagree";
	    }
	}
	if (!$showagree) {
	    $showagree = "agree";
	}
    }
    else {
	$showagree = "<a href=\"http://gplv3.fsf.org:8800/launch/login_form?came_from=/comments/\">login</a> to agree";
    }
    print STDERR "showagree is $showagree\n";
    return $showagree, $agr_vals->Count;
}


sub showAgreeStr($) {
    my $item = shift;
    my $agr_vals;
    our ($resp,$name);
	my $showagree = '';	
    $agr_vals = $$item->CustomFieldValues(7);
	if ($resp == 1) {
	    while (my $value = $agr_vals->Next) {
		if (($name) && ($value->Content eq $name)) {
#		    $showagree = "<a label=\"you have indicated that you agree with this\" name=\"you have indicated that you agree with this\">unagree</a>";
		    $showagree = "unagree";
		}
	    }
	    if (!$showagree) {
		$showagree = "agree";
	    }
	}
	else {
	    $showagree = "login";
	}

	return $showagree, $agr_vals->count;
}



sub getUser($) {
    my $CurrentUser = RT::CurrentUser->new;
	print STDERR "entering getUser\n";
#    if((!$session) || (!$session->CurrentUser)) {

	our ($name,$pass,$resp);
	if (($name, $pass) = split(/:/, decode_base64(CGI::cookie('__ac')))) {
	    $name =~ s/\"//g;
	    my $server = Frontier::Client->new(url => "http://gplv3.fsf.org:8800/launch/acl_users/Users/acl_users",
					       username => "stet_auth",
					       password =>  "fai1Iegh");
	    my $respref = $server->call('authRemoteUser',$name,$pass);
	    $resp = $$respref;
	}
	else {
	    $resp = 0;
	}
	print STDERR "resp to getUser was $resp\n";

# mangle name for testing:
#	$name = $name."createtest2"; # have used 1, 45
	print STDERR "name is $name and currentuser hash is ".$CurrentUser."\n";
# authorized users get privileges
	if ($resp == 1) {
	    $CurrentUser->LoadByName($name);
	    print STDERR "current $resp a user is ".$CurrentUser->id."\n";
	}
	if (($resp ==1) && (!$CurrentUser->id)) {
	    my ($val, $msg) = createUser($name,$pass);
	    print STDERR "trying to create a user $name, got \"$val : $msg\"\n";
	    $CurrentUser->LoadByName($name);
	}
	elsif (!$CurrentUser->id) {
# unauthorized users get to see the public queues
	    $CurrentUser->LoadByName("public"); 
	    print STDERR "current $resp c user is ".$CurrentUser->id."\n";
	}
    return ($CurrentUser, $resp);
    }
#}

sub createUser($$) {
my $name = shift;
my $pass = shift;
my $UserObj = RT::User->new(RT::CurrentUser->new('RT_System'));

my ($val, $msg) = $UserObj->Create(


        Name                  => $name,
        RealName              => $name,
        ExternalContactInfoId => $name,
        EmailAddress          => $name,
        ContactInfoSystem     => "gnuxmlrpc",
 #       Privileged           => $ARGS{'Privileged'},
        Disabled            => 0,
				      );

# 				   %{ref($RT::AutoCreate) ? $RT::AutoCreate : {}},
# 				   Name   => $user,
# 				   Gecos  => $user,
# 				   Disabled => '0',
# 				   );

$UserObj->SetPassword($pass);

    return ($val, $msg);
}

sub humanQuery {
    $query = shift;
    $query =~ s/['%0-9]+CF.NoteUrl'['%0-9]+ +LIKE/in file/g;
    $query =~ s/'CF.NoteUrl' NOT LIKE/not in file/g;
#    $query =~ s/'CF.NoteUrl' LIKE//g;
#    $query =~ s/'CF.NoteUrl' NOT LIKE//g;
    
    $query =~ s/'CF.NoteSelection' LIKE/selected text matches/g;
    $query =~ s/'CF.NoteSelection' NOT LIKE/selected text does not match/g;
    $query =~ s/'CF.NoteStartNodeId' LIKE/in section id/g;
    $query =~ s/'CF.NoteStartNodeId' NOT LIKE/not in section id/g;
    $query =~ s/'CF.Agreeers' LIKE/agreeers include/g;
    $query =~ s/'CF.Agreeers' NOT LIKE/agreeers do not include/g;

    $query =~ s/Requestor.Name LIKE/submitter matches/g;
    $query =~ s/ AND /, and /g;
    $query =~ s/ OR /, or /g;
    return $query;
}


1;
