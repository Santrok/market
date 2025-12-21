from django.db import models

# Create your models here.

class Kategoria(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title


class Tovar(models.Model):
    title = models.CharField(max_length=200)
    img = models.ImageField(upload_to='tovar')
    price = models.DecimalField(decimal_places=2, max_digits=10)
    opisanie = models.TextField()
    kategoria = models.ForeignKey('Kategoria', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class TovarImage(models.Model):
    tovar = models.ForeignKey(Tovar, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tovar/gallery')
    alt = models.CharField(max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']