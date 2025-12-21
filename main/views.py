from django.shortcuts import render, get_object_or_404

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
