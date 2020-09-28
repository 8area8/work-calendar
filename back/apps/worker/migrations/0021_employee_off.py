# Generated by Django 3.1 on 2020-09-28 10:04

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0020_remove_employee_off'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='off',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('monday', 0), ('tuesday', 1), ('wednesday', 2), ('thursday', 3), ('friday', 4), ('saturday', 5), ('sunday', 6)], max_length=30), default=[], size=None),
        ),
    ]