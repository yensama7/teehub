from django.contrib import admin
from .models import Product,Category,ItemImage

class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1

class ItemAdmin(admin.ModelAdmin):
    inlines = [ItemImageInline]

#adds product, category and image to admin site
admin.site.register(Product,ItemAdmin)
admin.site.register(Category)
