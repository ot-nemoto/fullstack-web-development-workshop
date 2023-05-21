"""
【執筆メモStart】
URLとviews.pyの紐づけを行っています。
https://www.django-rest-framework.org/api-guide/routers/
【執筆メモEnd】
"""
from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductView.as_view()),
    path('products/<int:id>/', views.ProductView.as_view()),
    path('products/generics/', views.ProductGenericView.as_view()),
    path('products/model/', views.ProductModelViewSet.as_view({'get': 'list'})),
    path('purchases/', views.PurchaseView.as_view()),
    path('purchases/<int:id>/', views.PurchaseView.as_view()),
    path('sales/', views.SalesView.as_view()),
    path('sales/<int:id>/', views.SalesView.as_view()),
    path('inventories/', views.InventoryView.as_view()),
    path('inventories/<int:id>/', views.InventoryView.as_view())
]
