from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.HomePageView.as_view(), name='homepage'),
    url(r'^process/$', views.process, name='process'),
    url(r'^result/$', views.result, name='result'),
    url(r'^entry/(?P<pk>\d+)/$', views.EntryDetailView.as_view(), name='entry-detail'),
]
