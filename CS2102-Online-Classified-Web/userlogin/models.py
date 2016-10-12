from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    contact = models.CharField(max_length=200)

    def __str__(self):
        return self.username