from django.urls import path

from .views import get_main_page, get_product_by_category, get_product_detail_page, login_view, register_view, logout_view

urlpatterns = [
    path('', get_main_page, name='home'),
    path('category/<int:id>/', get_product_by_category, name='category'),
    path('product/<int:id>/', get_product_detail_page, name='product'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
]