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



use Lingua::EN::Sentence qw( get_sentences add_acronyms );

while(<>) {

    $wholedoc .= $_;

}

my @paragraphs = split(/\n\n/,$wholedoc);

$i = 0;
foreach my $paragraph (@paragraphs) {
    $j = 1;
    print "<p id=\"autotag.p$i\">\n";
    my $sentences=get_sentences($paragraph);
    foreach my $sentence (@$sentences) {
	print " <sent id=\"autotag.p$i.s$j\">$sentence</sent>\n";
	$j++;
    }
    print "</p>\n\n";
    $i++;
}
