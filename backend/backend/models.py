from django.db import models
from django.contrib.postgres import fields

# Create your models here.


TYPES = [
    ('K', 'Kernel'), 
    ('D', 'Depth'), 
    ('H', 'HSS'), 
    ('C', 'CS'), 
    ('F', 'Free'), 
    ('O', 'Other'), 
]


class UserCourse(models.Model): 
    STATUSES = [
        (0, 'Passed'), 
        (1, 'In Progress'), 
        (2, 'Failed'), 
        (3, 'Not Taken'), 
    ]
    code = models.CharField(max_length=15)
    name = models.CharField(max_length=255)
    term = models.PositiveSmallIntegerField()
    status = models.PositiveSmallIntegerField(choices=STATUSES)
    area = models.CharField(max_length=7)
    type = models.CharField(max_length=1, choices=TYPES)
    twin = models.PositiveSmallIntegerField()
    ceab = fields.ArrayField(models.PositiveSmallIntegerField(), size=5)


class User(models.Model): 
    GENDERS = [
        ('M', 'male'), 
        ('F', 'female'), 
        ('O', 'other'), 
        ('N', 'prefer not to answer'), 
    ]
    ECE = [
        ('E', 'EE'), 
        ('C', 'CE'), 
    ]
    name = models.CharField(max_length=255)
    utorid = models.CharField(unique=True, max_length=15)
    student_number = models.PositiveBigIntegerField()
    email = models.EmailField()
    alter_email = models.EmailField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDERS)
    degree = models.CharField(max_length=15)
    ece = models.CharField(max_length=1, choices=ECE)
    courses = models.ManyToManyField(to=UserCourse, related_name='users')


AREAS = [
    ('1', 'Photonics & Semiconductor Physics'), 
    ('2', 'Electromagnetics & Energy Systems'), 
    ('3', 'Analog & Digital Electronics'), 
    ('4', 'Control, Communications & Signal Processing'), 
    ('5', 'Computer Hardware & Computer Networks'), 
    ('6', 'Software'), 
    ('7', 'Science/Math Electives'), 
    ('O', 'other'), 
]


class Course(models.Model):
    DOMAINS = [
        ('E', "Eng"), 
        ('A', 'Artsci'), 
    ]
    code = models.CharField(unique=True, max_length=15)
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=1, choices=DOMAINS)


class EngCourse(models.Model): 
    code = models.CharField(unique=True, max_length=15)
    name = models.CharField(max_length=255)
    description = models.TextField()
    prerequisite = models.CharField(max_length=255, blank=True)                 # A | B | C & D | E | F
    corequisite = models.CharField(max_length=255, blank=True)                  # A & B & C
    exclusion = models.CharField(max_length=255, blank=True)                    # A & B & C
    credit = models.PositiveSmallIntegerField()                                 # use percentage, Ex. 50 means weight is 0.50
    area = models.CharField(max_length=7)                                       # maybe multiple areas, but always select from AREAS
    type = models.CharField(max_length=1, choices=TYPES)
    offered = models.CharField(max_length=255)                                  # 20249;20259;
    twin = models.PositiveSmallIntegerField()                                   # if twin (F <-> S or Y) exists
    delivery = fields.ArrayField(models.PositiveSmallIntegerField(), size=3)    # percentage
    au = fields.ArrayField(models.PositiveSmallIntegerField(), size=5)          # percentage
    ceab = fields.ArrayField(models.PositiveSmallIntegerField(), size=5)        # percentage

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Course.objects.get_or_create(code=self.code, name=self.name, domain='E')


class ArtsciCourse(models.Model): 
    code = models.CharField(unique=True, max_length=15)
    name = models.CharField(max_length=255)
    description = models.TextField()
    prerequisite = models.CharField(max_length=255, blank=True)
    corequisite = models.CharField(max_length=255, blank=True)
    exclusion = models.CharField(max_length=255, blank=True)
    credit = models.PositiveSmallIntegerField()
    type = models.CharField(max_length=1, choices=TYPES)
    offered = models.CharField(max_length=255)
    twin = models.PositiveSmallIntegerField()
    delivery = fields.ArrayField(models.PositiveSmallIntegerField(), size=3)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Course.objects.get_or_create(code=self.code, name=self.name, domain='A')
