import datetime
from time import timezone
from django.db import connection
from django.shortcuts import render, redirect
from django.views import generic
from django.utils import timezone
from product.models import Product, Category


def create(request):
    if 'name' in request.POST:
        cursor = connection.cursor()
        sql = 'INSERT INTO product_product(owner_id, name, category_id, description, company,' \
              + ' country, quality, date, price) VALUES("' \
              + str(request.session['user_id']) + '","' \
              + request.POST['name'] + '","' \
              + request.POST['category'] + '","' \
              + request.POST['description'] + '","' \
              + request.POST['company'] + '","' \
              + request.POST['country'] + '","' \
              + request.POST['quality'] + '","' \
              + str(datetime.datetime.now()) + '","' \
              + request.POST['price'] + '");'
        print sql
        cursor.execute(sql)
        return redirect('/product/list', 'product/list.html')

    return render(request, 'product/form.html', {
        'categories': Category.objects.all(),
    })


class UpdateView(generic.UpdateView):
    template_name = 'product/form.html'


def index(request):
    sql = 'SELECT * FROM product_product'

    if 'price' not in request.POST or not request.POST['price']:
        sql += ' WHERE price > 0'
    else:
        sql += ' WHERE price > ' + request.POST['price']

    if 'category' in request.POST and request.POST['category'] != '0':
        sql += ' AND category_id = ' + request.POST['category']

    if 'company' in request.POST and request.POST['company'] != '':
        sql += ' AND company = ' + request.POST['company']

    if 'country' in request.POST and request.POST['country'] != '':
        sql += ' AND country = ' + request.POST['country']

    if 'search' in request.POST:
        sql += ' AND (description LIKE ' + "'%%" + request.POST['search'] + "%%'" \
            ' OR name LIKE ' + "'%%" + request.POST['search'] + "%%'" + ')'

    if 'sort' in request.POST:
        if request.POST['sort'] == "0":
            sql += ' ORDER BY date'
        elif request.POST['sort'] == "1":
            sql += ' ORDER BY price'

    # print sql
    return render(request, 'product/list.html', {
        'object_list': Product.objects.raw(sql),
        'categories': Category.objects.all(),
    })


class DetailView(generic.DetailView):
    template_name = 'product/detail.html'


class DeleteView(generic.DeleteView):
    template_name = 'product/confirm_delete.html'
