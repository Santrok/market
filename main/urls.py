from django.urls import path

from .views import get_main_page, get_product_by_category, get_product_detail_page

urlpatterns = [
    path('', get_main_page, name='home'),
    path('category/<int:id>/', get_product_by_category, name='category'),
    path('product/<int:id>/', get_product_detail_page, name='product'),
]