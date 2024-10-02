from django.urls import path, include

from core import views

urlpatterns = [
    path('latest-products/', views.LatestProductsList.as_view()), # latest products
    path('products/search/', views.search), # search functionality
    path('products/<slug:category_slug>/<slug:product_slug>/', views.ProductDetail.as_view()), # product details
    path('products/<slug:category_slug>/', views.CategoryDetail.as_view()), # products under a category
]