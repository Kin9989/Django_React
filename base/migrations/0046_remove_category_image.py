# Generated by Django 3.2.6 on 2024-06-06 19:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0045_category_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='image',
        ),
    ]
