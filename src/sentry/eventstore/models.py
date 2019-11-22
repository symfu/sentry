from __future__ import absolute_import

from datetime import datetime
from django.utils import timezone

from sentry.models import EventCommon, EventDict
from sentry.db.models import NodeData


def ref_func(x):
    return x.project_id or x.project.id


class Event(EventCommon):
    def __init__(self, project_id, event_id, group_id=None, data=None):
        self.project_id = project_id
        self.event_id = event_id
        self.group_id = group_id
        self.data = data
        super(Event, self).__init__()

    def __getstate__(self):
        state = self.__dict__.copy()
        # do not pickle cached info.  We want to fetch this on demand
        # again.  In particular if we were to pickle interfaces we would
        # pickle a CanonicalKeyView which old sentry workers do not know
        # about
        state.pop("_project_cache", None)
        state.pop("_environment_cache", None)
        state.pop("_group_cache", None)
        state.pop("interfaces", None)

        return state

    def __getattr__(self, name):
        """
        Depending on what snuba data this event was initialized with, we may
        have the data available to return, or we may have to look in the
        `data` dict (which would force a nodestore load). All unresolved
        self.foo type accesses will come through here.
        """
        if name in ("_project_cache", "_group_cache", "_environment_cache"):
            raise AttributeError()

    @property
    def data(self):
        return self._data

    @data.setter
    def data(self, value):
        node_id = Event.generate_node_id(self.project_id, self.event_id)
        self._data = NodeData(
            node_id, data=value, wrapper=EventDict, ref_version=2, ref_func=ref_func
        )

    @property
    def platform(self):
        return self.data.get("platform", None)

    @property
    def datetime(self):
        recorded_timestamp = self.data.get("timestamp")
        date = datetime.fromtimestamp(recorded_timestamp)
        date = date.replace(tzinfo=timezone.utc)
        return date

    # TODO: Implement
    def get_minimal_user(self):
        pass
        # from sentry.interfaces.user import User

        # return User.to_python(
        #     {
        #         "id": self.user_id,
        #         "email": self.email,
        #         "username": self.username,
        #         "ip_address": self.ip_address,
        #     }
        # )

    def save(self):
        """
        Saves event to nodestore.
        """
        self._data.save()
