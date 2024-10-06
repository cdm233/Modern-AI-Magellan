from django.contrib import admin
from .models import UserCourse, User, Course, EngCourse, ArtsciCourse

# Register your models here.
admin.site.register([UserCourse, User, Course, EngCourse, ArtsciCourse])