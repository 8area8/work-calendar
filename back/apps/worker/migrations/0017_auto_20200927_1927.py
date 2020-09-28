# Generated by Django 3.1 on 2020-09-27 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worker', '0016_auto_20200925_1432'),
    ]

    operations = [
        migrations.CreateModel(
            name='Week',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monday', models.BooleanField(default=False)),
                ('tuesday', models.BooleanField(default=False)),
                ('wednesday', models.BooleanField(default=False)),
                ('thursday', models.BooleanField(default=False)),
                ('friday', models.BooleanField(default=False)),
                ('saturday', models.BooleanField(default=False)),
                ('sunday', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='employee',
            name='off',
            field=models.ManyToManyField(to='worker.Week'),
        ),
    ]