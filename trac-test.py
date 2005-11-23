#!/usr/bin/env python

from trac.env import Environment
from trac.ticket.model import Ticket
import cgi

env = Environment('/var/trac/')

form = cgi.FieldStorage()
if (form.has_key("DomPath") and form.has_key("Selection") and form.has_key("NoteText") and form.has_key("StartNode") and form.has_key("EndNode") and form.has_key("StartNodeId") and form.has_key("EndNodeId") and form.has_key("NoteUrl")


    # Create a new ticket:
    tkt = Ticket(env)
    tkt['reporter'] = 'moglen@columbia.edu'
    tkt['summary'] = form.['Selection'].value
    tkt['description'] = form.['NoteText'].value
    tkt.insert()
    
#     # To read an existing ticket pass its id to the constructor:
#     tkt = Ticket(env, 1)
#     print tkt['priority']

#     # Update another ticket:
#     tkt = Ticket(env, 2)
#     tkt['status'] = 'closed'
#             tkt['resolution'] = 'fixed'
#     tkt.save_changes(author='me', comment='progammaticly closed a ticket')
    
#     # And finally deleting:
#     tkt = Ticket(env, 3)
#     tkt.delete()

