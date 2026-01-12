from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from main.models import Kategoria, Tovar


# Create your views here.
def get_main_page(request):
    categories = Kategoria.objects.all()
    tovars = Tovar.objects.all()

    context = {
        "categories": categories,
        "tovars": tovars
    }

    return render(request, 'main.html', context)


def get_product_by_category(request, id):
    categories = Kategoria.objects.all()
    tovars = Tovar.objects.filter(kategoria=id)

    context = {
        "categories": categories,
        "tovars": tovars
    }
    return render(request, 'main.html', context)


def get_product_detail_page(request, id):
    categories = Kategoria.objects.all()
    product = get_object_or_404(Tovar, id=id)

    context = {
        "product": product,
        "categories": categories,
    }
    return render(request, 'kartochka_tovara.html', context)


def login_view(request):
    categories = Kategoria.objects.all()
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
    
    context = {
        'form': form,
        'categories': categories,
    }
    return render(request, 'login.html', context)


def register_view(request):
    categories = Kategoria.objects.all()
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    
    context = {
        'form': form,
        'categories': categories,
    }
    return render(request, 'register.html', context)


def logout_view(request):
    logout(request)
    return redirect('home')

