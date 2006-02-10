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

use CGI qw/standard/;
use MIME::Base64;
use Frontier::Client;
use URI::Escape;

require "/var/www/stet/xmlpass.pl";

sub stripCrap($) {
    my $crappy = shift;
    $crappy =~ s/(.*)\?.*/$1/;
    $crappy =~ s/.*\/([^\/]+)/$1/;
    return $crappy;
}

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
	$showagree = "<a href=\"http://gplv3.fsf.org/login_form?came_from=/comments/\">login</a> to agree";
    }
#    print STDERR "showagree is $showagree\n";
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


my $server;
sub getUser($) {

    my $CurrentUser = RT::CurrentUser->new;
    my ($username, $password) = userpass();

    print STDERR "entering getUser with external passwords.\n";
    my $name;
    our ($pass,$resp,$server);
    if (($name, $pass) = split(/:/, decode_base64(CGI::cookie('__ac')))) {
	$name =~ s/\"//g;
	$server = Frontier::Client->new(url => 'http://'.$username.':'.$password.'@gplv3.fsf.org:8800/launch/acl_users/Users/acl_users'); #,
#					   username => $username,
#					   password =>  $password);
	my $respref = $server->call('authRemoteUser',$name,$pass);
	$resp = $$respref;
    }
    else {
	$resp = 0;
    }
#    print STDERR "resp to getUser was $resp\n";
    
# mangle name for testing:
#	$name = $name."createtest2"; # have used 1, 45
#    print STDERR "name is $name and currentuser hash is ".$CurrentUser."\n";
# authorized users get privileges
    if ($resp == 1) {
	$CurrentUser->LoadByName($name);
	print STDERR "current $resp a user is ".$CurrentUser->id."(".$CurrentUser->Name.")\n";
    }
    if (($resp ==1) && (!$CurrentUser->id)) {
	my ($val, $msg) = createUser($name,$pass);
	print STDERR "trying to create a user $name, got \"$val : $msg\"\n";
	$CurrentUser->LoadByName($name);
	print STDERR "created current $resp b user is ".$CurrentUser->id."(".$CurrentUser->Name.")\n";
    }
    elsif (!$CurrentUser->id) {
# unauthorized users get to see the public queues
	$CurrentUser->LoadByName("public"); 
	print STDERR "current $resp c user is ".$CurrentUser->id."(".$CurrentUser->Name.")\n";
    }
    $session->{'CurrentUser'} = $CurrentUser;
    return ($CurrentUser, $resp, $name);
}

#}

sub createUser($$) {
my $name = shift;
my $pass = shift;
my $UserObj = RT::User->new(RT::CurrentUser->new('RT_System'));
our $server;
my $email = '';

    eval{ $email = $server->call('getEmail',$name) };

if ($email) { print STDERR "got email $email\n"; }
else { $email = $name; }

my ($val, $msg) = $UserObj->Create(


        Name                  => $name,
        RealName              => $name,
        ExternalContactInfoId => $name,
        EmailAddress          => $email,
        ContactInfoSystem     => "gnuxmlrpc",
        Privileged           => 1,
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
    $query =~ s/'CF.NoteUrl' LIKE/in file/g;
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

# {{{ sub myCFValueUpdater 

sub myCFValueUpdater {
	    print STDERR "stetsubs.pl 157\n";
    my %args = (
        ARGSRef => undef,
        @_
    );

    my @results;

    my $ARGSRef = $args{'ARGSRef'};

    # Build up a list of tickets that we want to work with
    my %tickets_to_mod;
    my %custom_fields_to_mod;
    foreach my $arg ( keys %{$ARGSRef} ) {
        if ( $arg =~ /^Ticket-(\d+)-CustomField-(\d+)-/ ) {

            # For each of those tickets, find out what custom fields we want to work with.
            $custom_fields_to_mod{$1}{$2} = 1;
	    print STDERR "Web.pm 1059 ticket $1 field $2\n";
        }
    }

    # For each of those tickets
    foreach my $tick ( keys %custom_fields_to_mod ) {
        my $Ticket = $args{'TicketObj'};
	if (!$Ticket or $Ticket->id != $tick) {
	    $Ticket = RT::Ticket->new( $session{'CurrentUser'} );
	    $Ticket->Load($tick);
	}

        # For each custom field  
        foreach my $cf ( keys %{ $custom_fields_to_mod{$tick} } ) {

	    my $CustomFieldObj = RT::CustomField->new($session{'CurrentUser'});
	    $CustomFieldObj->LoadById($cf);

            foreach my $arg ( keys %{$ARGSRef} ) {
                # since http won't pass in a form element with a null value, we need
                # to fake it
                if ($arg =~ /^(.*?)-Values-Magic$/ ) {
                    # We don't care about the magic, if there's really a values element;
                    next if (exists $ARGSRef->{$1.'-Values'}) ;

                    $arg = $1."-Values";
                    $ARGSRef->{$1."-Values"} = undef;
                
                }
                next unless ( $arg =~ /^Ticket-$tick-CustomField-$cf-/ );
                my @values =
                  ( ref( $ARGSRef->{$arg} ) eq 'ARRAY' ) 
                  ? @{ $ARGSRef->{$arg} }
                  : split /\n/, $ARGSRef->{$arg} ;

		#for poor windows boxen that pass in "\r\n"
		local $/ = "\r";
		chomp @values;

                if ( ( $arg =~ /-AddValue$/ ) || ( $arg =~ /-Value$/ ) ) {
                    foreach my $value (@values) {
                        next unless length($value);
                        my ( $val, $msg ) = $Ticket->AddCustomFieldValue(
                            Field => $cf,
                            Value => $value
                        );
                        push ( @results, $msg );
                    }
                }
                elsif ( $arg =~ /-DeleteValues$/ ) {
                    foreach my $value (@values) {
                        next unless length($value);
                        my ( $val, $msg ) = $Ticket->DeleteCustomFieldValue(
                            Field => $cf,
                            Value => $value
                        );
                        push ( @results, $msg );
                    }
                }
                elsif ( $arg =~ /-Values$/ and $CustomFieldObj->Type !~ /Entry/) {
                    my $cf_values = $Ticket->CustomFieldValues($cf);

                    my %values_hash;
                    foreach my $value (@values) {
                        next unless length($value);

                        # build up a hash of values that the new set has
                        $values_hash{$value} = 1;

                        unless ( $cf_values->HasEntry($value) ) {
                            my ( $val, $msg ) = $Ticket->AddCustomFieldValue(
                                Field => $cf,
                                Value => $value
                            );
                            push ( @results, $msg );
                        }

                    }
                    while ( my $cf_value = $cf_values->Next ) {
                        unless ( $values_hash{ $cf_value->Content } == 1 ) {
                            my ( $val, $msg ) = $Ticket->DeleteCustomFieldValue(
                                Field => $cf,
                                Value => $cf_value->Content
                            );
                            push ( @results, $msg);

                        }

                    }
                }
                elsif ( $arg =~ /-Values$/ ) {
                    my $cf_values = $Ticket->CustomFieldValues($cf);

		    # keep everything up to the point of difference, delete the rest
		    my $delete_flag;
		    foreach my $old_cf (@{$cf_values->ItemsArrayRef}) {
			if (!$delete_flag and @values and $old_cf->Content eq $values[0]) {
			    shift @values;
			    next;
			}

			$delete_flag ||= 1;
			$old_cf->Delete;
		    }

		    # now add/replace extra things, if any
		    foreach my $value (@values) {
			my ( $val, $msg ) = $Ticket->AddCustomFieldValue(
			    Field => $cf,
			    Value => $value
			);
			push ( @results, $msg );
		    }
		}
                else {
                    push ( @results, "User asked for an unknown update type for custom field " . $cf->Name . " for ticket " . $Ticket->id );
                }
            }
        }
        return (@results);
    }
}

# }}}


1;
