from django.conf.urls import patterns, url
from django.core.urlresolvers import reverse_lazy
from product import views
from product.models import Product

urlpatterns = patterns(
    '',
    url(r'add$', views.create, name='product_create'),
    url(r'update/(?P<pk>\d+)$', views.UpdateView.as_view(model=Product), name='product_update'),
    url(r'list$', views.index, name='product_list'),
    url(r'view/(?P<pk>\d+)$', views.DetailView.as_view(model=Product), name='product_detail'),
    url(r'delete/(?P<pk>\d+)$', views.DeleteView.as_view(model=Product, success_url=reverse_lazy('products')),
        name='product_delete'),
)
