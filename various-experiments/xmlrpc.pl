#!/usr/bin/perl -w
# Copyright 2005 Software Freedom Law Center, Inc.
#
# This program is free software: you may copy, modify, or redistribute it
# and/or modify it under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
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


use RPC::XML;
use RPC::XML::Client;
use Frontier::Client;
use Data::Dumper;
use URI;

#$cli = RPC::XML::Client->new('http://gplv3.fsf.org:8800/launch/acl_users/Users/acl_users');

#print STDERR $cli->uri . "\n";
#my $uri = URI->new($cli->uri);
#print STDERR $uri->host_port . "\n";

#$cli->credentials('gplv3.fsf.org','stet_auth','PASSWORD');

#$resp = $cli->send_request('authRemoteUser','orion','PASSWORD');

#print STDERR Dumper($resp);

$server = Frontier::Client->new(url => "http://gplv3.fsf.org:8800/launch/acl_users/Users/acl_users",
				username => "stet_auth",
				password =>  "PASSWORD");

#			        url => "https://www.fsf.org:443/acl_users/Users/acl_users",
#				username => "gplv3_xmlrpc",
#				password => "PASSWORD");



$resp = $server->call('authRemoteUser','orion','PASSWORD');
print STDERR ${$resp} . "\n";

$resp = $server->call('authRemoteUser','orion','PASSWORD');
print STDERR ${$resp} . "\n";

$resp = $server->call('getUserNames');
print STDERR Dumper($resp) . "\n";
