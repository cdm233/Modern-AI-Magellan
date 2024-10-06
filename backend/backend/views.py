from rest_framework import status as STATUS
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserCourseSerializer, UserSerializer, CourseSerializer, EngCourseSerializer, ArtsciCourseSerializer
from .models import UserCourse, User, Course, EngCourse, ArtsciCourse

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json


@api_view(['POST'])
def handle_request(request):
    request_code = request.data.get('request')
    payload = request.data.get('payload')

    if not request_code:
        return Response({'error': 'Empty request'}, status=STATUS.HTTP_400_BAD_REQUEST)

    elif request_code == 'get_user_info':
        return Helper.get_user_info(payload)

    elif request_code == 'add_user':
        return Helper.add_user(payload)

    elif request_code == 'get_course':
        return Helper.get_course(payload)

    elif request_code == 'add_eng_course':
        return Helper.add_eng_course(payload)
    
    elif request_code == 'add_artsci_course':
        return Helper.add_artsci_course(payload)

    else:
        return Response({'error': 'Invalid request'}, status=STATUS.HTTP_400_BAD_REQUEST)


class Helper:
    @staticmethod
    def get_user_info(payload):
        utorid = payload.get('utorid')
        try:
            if utorid: 
                user = User.objects.get(utorid=utorid)
            else: 
                return Response({'error': 'Empty utorid'}, status=STATUS.HTTP_400_BAD_REQUEST)
            serializer = UserSerializer(user)
            data = serializer.data
            courses = UserCourseSerializer(user.courses.all(), many=True).data
            data['courses'] = courses
            return Response(data, status=STATUS.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=STATUS.HTTP_404_NOT_FOUND)


    @staticmethod
    def add_user(payload):
        course_pks = []
        for course_code in payload['courses']: 
            course, created = UserCourse.objects.get_or_create(**course_code)
            course_pks.append(course.id)
        payload['courses'] = course_pks
        serializer = UserSerializer(data=payload)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'status': 'User added'}, status=STATUS.HTTP_201_CREATED)
        return Response(serializer.errors, status=STATUS.HTTP_400_BAD_REQUEST)


    @staticmethod
    def get_course(payload):
        code = payload.get('code')
        try: 
            if code: 
                course = Course.objects.get(code=code)
            else: 
                return Response({'error': 'Empty course code'}, status=STATUS.HTTP_400_BAD_REQUEST)
            if course.domain == 'E': 
                engcourse = EngCourse.objects.get(code=code)
                serializer = EngCourseSerializer(engcourse)
            elif course.domain == 'A': 
                artscicourse = ArtsciCourse.objects.get(code=code)
                serializer = ArtsciCourseSerializer(artscicourse)
            return Response(serializer.data, status=STATUS.HTTP_200_OK)
        except Course.DoesNotExist: 
            return Response({'error': 'Course does not exist'}, status=STATUS.HTTP_404_NOT_FOUND)


    @staticmethod
    def add_eng_course(payload):
        try: 
            EngCourse.objects.get(code=payload['code'])
            return Response({'error': 'Course already exists'}, status=STATUS.HTTP_400_BAD_REQUEST)
        except EngCourse.DoesNotExist: 
            serializer = EngCourseSerializer(data=payload)
            if serializer.is_valid():
                serializer.save()
                return Response({'status': 'Engcourse added'}, status=STATUS.HTTP_201_CREATED)
            return Response(serializer.errors, status=STATUS.HTTP_400_BAD_REQUEST)
    

    @staticmethod
    def add_artsci_course(payload):
        try: 
            ArtsciCourse.objects.get(code=payload['code'])
            return Response({'error': 'Course already exists'}, status=STATUS.HTTP_400_BAD_REQUEST)
        except ArtsciCourse.DoesNotExist: 
            serializer = ArtsciCourseSerializer(data=payload)
            if serializer.is_valid():
                serializer.save()
                return Response({'status': 'Artscicourse added'}, status=STATUS.HTTP_201_CREATED)
            return Response(serializer.errors, status=STATUS.HTTP_400_BAD_REQUEST)
