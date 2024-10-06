from rest_framework import serializers
from .models import UserCourse, User, Course, EngCourse, ArtsciCourse

class UserCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourse
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer): 
    courses = serializers.PrimaryKeyRelatedField(queryset=UserCourse.objects.all(), many=True)
    class Meta: 
        model = User
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Course
        fields = '__all__'

class EngCourseSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = EngCourse
        fields = '__all__'

class ArtsciCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtsciCourse
        fields = '__all__'
