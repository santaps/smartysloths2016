from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone

from ... import models


class Command(BaseCommand):
    help = 'Check images and remove them if they are expired'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Checking expired images...'))
        threshold = timezone.now() - settings.SOURCE_IMAGE_LIFETIME
        expired_entries = models.Entry.objects.filter(created_at__lt=threshold)
        expired_entries_images = models.EntryImage.objects.filter(entry__in=expired_entries)

        if expired_entries_images.exists():
            self.stdout.write(self.style.WARNING('Removing expired images...'))
            expired_entries_images.delete()
        else:
            self.stdout.write(self.style.WARNING('No expired images found'))
