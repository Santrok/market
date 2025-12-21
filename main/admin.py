from django.contrib import admin

from .models import Kategoria, Tovar, TovarImage

# Register your models here.
admin.site.register(Kategoria)
admin.site.register(Tovar)
admin.site.register(TovarImage)

