
from django.contrib.auth.models import User
from django.db import models


class Entry(models.Model):
    user = models.ForeignKey(User, related_name='entries')
    text = models.TextField(help_text='Extracted from images text')
    # XXX: Images are stored in database as blobs
    encoded_thumbnail = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def position(self):
        entries = Entry.objects.filter(user=self.user).order_by('created_at')

        for position, entry in enumerate(entries, start=1):
            if entry == self:
                return position


class EntryImage(models.Model):
    # XXX: it is considered a bad practice in 99% of use cases to store an image as a blob
    encoded_image = models.BinaryField()
    entry = models.ForeignKey(Entry, related_name='images')
