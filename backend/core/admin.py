from django.contrib import admin
from .models import Product,Category,ItemImage,Size

class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1

class ItemAdmin(admin.ModelAdmin):
    inlines = [ItemImageInline]

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'date_added')
    inlines = [ItemImageInline]  # Display ItemImage in the Product admin page
    filter_horizontal = ('sizes',)  # Allow selection of multiple sizes

#adds product, category and image to admin site
admin.site.register(Product,ItemAdmin)
admin.site.register(Category)


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ('name',)
