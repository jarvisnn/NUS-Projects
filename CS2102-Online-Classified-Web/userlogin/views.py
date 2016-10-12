from django.db import connection
from django.shortcuts import render, redirect

# Create your views here.
from userlogin.models import User


def index(request):
    if 'user' in request.session:
        return redirect('/product/list', 'product/list.html')

    if 'username' in request.POST and request.POST['username']:
        sql = 'SELECT * FROM userlogin_user WHERE username="'\
              + request.POST['username'] \
              + '" AND password="' + request.POST['password'] + '";'
        users = User.objects.raw(sql)
        if len(list(users)):
            for user in users:
                request.session['user_id'] = user.id
                break
            request.session['user'] = request.POST['username']
            return redirect('/product/list', 'product/list.html')
    return render(request, 'userlogin/userlogin.html')


def register(request):
    if 'user' in request.session:
        return redirect('/product/list', 'product/list.html')

    if 'username' in request.POST and request.POST['username']:
        if 'password' in request.POST and request.POST['password']:
            if 'password_again' in request.POST and request.POST['password_again']:
                if request.POST['password'] == request.POST['password_again']:
                    sql = 'SELECT * FROM userlogin_user WHERE username="'\
                          + request.POST['username'] \
                          + '";'
                    users = User.objects.raw(sql)
                    if len(list(users)):
                        return render(request, 'userlogin/register.html')

                    cursor = connection.cursor()
                    sql = 'INSERT INTO userlogin_user(username, password) VALUES("' \
                          + request.POST['username'] + '","' \
                          + request.POST['password'] + '");'
                    cursor.execute(sql)
                    return redirect('/user/login', 'userlogin/index.html')
        return render(request, 'userlogin/register.html')
    else:
        return render(request, 'userlogin/register.html')


def logout(request):
    if 'user' in request.session:
        del request.session['user']
        del request.session['user_id']
    return redirect('/product/list', 'product/list.html')
