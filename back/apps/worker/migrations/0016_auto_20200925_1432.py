# Generated by Django 3.1 on 2020-09-25 12:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0015_auto_20200925_1431'),
    ]

    operations = [
        migrations.AddField(
            model_name='workday',
            name='end',
            field=models.DateTimeField(default=None),
        ),
        migrations.AddField(
            model_name='workday',
            name='start',
            field=models.DateTimeField(default=None),
        ),
    ]