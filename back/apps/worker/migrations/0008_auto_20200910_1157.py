# Generated by Django 3.1 on 2020-09-10 11:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0007_auto_20200906_1727'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='day',
            name='month',
        ),
        migrations.RemoveField(
            model_name='day',
            name='number',
        ),
        migrations.RemoveField(
            model_name='day',
            name='year',
        ),
        migrations.AddField(
            model_name='day',
            name='date',
            field=models.DateField(default=datetime.date(2020, 9, 10)),
            preserve_default=False,
        ),
    ]
