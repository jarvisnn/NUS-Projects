from django.conf.urls import patterns, url
from userlogin import views

urlpatterns = patterns(
    '',
    # url(r'update$', views.CreateView.as_view(model=User), name='user_login'),
    url(r'register$', views.register, name='user_register'),
    url(r'login$', views.index, name="user_index"),
    url(r'logout$', views.logout, name="user_logout"),
    # url(r'add$', views.CreateView.as_view(model=User), name='product_create'),
    # url(r'update/(?P<pk>\d+)$', views.UpdateView.as_view(model=Product), name='product_update'),
    # url(r'list$', views.index, name='product_list'),
    # url(r'view/(?P<pk>\d+)$', views.DetailView.as_view(model=Product), name='product_detail'),
    # url(r'delete/(?P<pk>\d+)$', views.DeleteView.as_view(model=Product, success_url=reverse_lazy('products')),
    #     name='product_delete'),
)
