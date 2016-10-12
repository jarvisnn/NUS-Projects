from bsct.models import BSCTModelMixin
import datetime
from django.db import models
from django.forms import DateField
from userlogin.models import User


class Category(models.Model):
    name = models.CharField(max_length=200)
    #    thumbnail = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name


class Product(models.Model, BSCTModelMixin):
    owner = models.ForeignKey(User)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category)
    description = models.TextField()
    quality = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    date = models.DateTimeField()
    #    thumbnail = models.CharField(max_length=200, null=True, blank=True)
    price = models.IntegerField(default=0)

    def __str__(self):
        return self.name
