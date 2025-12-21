from django.shortcuts import render

from .models import Author


def get_form(request):
    authors = Author.objects.order_by('-id')
    print(authors)
    contex = {
        "authors": authors,
        "errors": [],
    }
    if request.method == "POST":
        age = request.POST.get("age")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")

        if len(age) > 0 and len(first_name) > 0 and len(last_name) > 0:
            if age.isdigit():
                new_author = Author(first_name=first_name,
                                    last_name=last_name,
                                    age=age)
                new_author.save()
            else:
                contex.get("errors").append("Возраст должен быть числом")
                print("Возраст должен быть числом")
        else:
            contex.get("errors").append("Не заполнены данные")
            print("Не заполнены данные")

    return render(request, 'my_form.html', contex)
