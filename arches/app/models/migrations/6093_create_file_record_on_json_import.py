# Generated by Django 2.2.9 on 2020-04-29 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('models', '6125_details_search_component'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='path',
            field=models.FileField(max_length=500, upload_to='uploadedfiles'),
        ),
    ]
