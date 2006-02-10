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

our $msgfrom = 'orion@valla.uchicago.edu';
our $msgsubject = 'yo the subject of our message';
our $itemid = '666';
our $itemCreator = 'checkyourself';
our $itemSubject = 'comment\'s subject';

our $body = writeMsg('/var/www/stet/email-reply-template-created.txt');

sendMail($body,$msgfrom);

# sub sendMail {
#     use Email::Send;
#     my $text = shift;
#     my $sender = Email::Send->new({mailer => 'SMTP'});
#     $sender->mailer_args([Host => 'monty-python.gnu.org']);
#     $sender->send($text);
# }

sub sendMail {
    my $msg = shift;
    my $to = shift;
    my $FROM_ADDRESS = "tech@gplv3.fsf.org";
#    my $sendmail = "/usr/lib/sendmail -oi -oem -- $to";
    my $sendmail = "/usr/lib/sendmail -f \"$FROM_ADDRESS\" -oi -oem -- $to";
    open (SENDMAIL, "|$sendmail") or die "cannot open sendmail: $!\n";
    print SENDMAIL $msg;
    close(SENDMAIL);
}

sub writeMsg {
    use Text::Template;
    my $file = shift;
    my $template = Text::Template->new(TYPE => 'FILE', SOURCE => $file);
    my $text = $template->fill_in();
    print "text is\n$text\n";
    return $text;
}
