# Generated by Django 3.1 on 2020-09-25 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0013_auto_20200925_1408'),
    ]

    operations = [
        migrations.AddField(
            model_name='workday',
            name='end',
            field=models.DateField(default=None),
        ),
        migrations.AddField(
            model_name='workday',
            name='start',
            field=models.DateField(default=None),
        ),
    ]
