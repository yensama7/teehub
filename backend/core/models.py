from django.db import models
from io import BytesIO
from django.core.files import File
from PIL import Image
length = height =300


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField() # makes url friendly and easy to access individual products through category

    class Meta:
        ordering = ('name',) # order category by name
 
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return f'/{self.slug}/' # Url for individual category(eg if slug is men, then '/men' will lead to men section)
    

# Add sizes 
class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Ensure size names are unique

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField() # makes url friendly and easy to access individual products
    description = models.TextField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='', blank=True, null=True) # Adds one image
    thumbnail = models.ImageField(upload_to='thumbnail/', blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)  # Add quantity_in_stock field

    class Meta:
        ordering = ('-date_added',) # in decending order

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        if self.stock > 0:
            return f'/{self.category.slug}/{self.slug}/'  # gets the url for individual products
        else:
            return '#'  # Or redirect to a "Out of Stock" page
    
    def get_image(self):
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url  # url for the image
        return ''
    
    def get_thumbnail(self):
        if self.thumbnail:
            return 'http://127.0.0.1:8000' + self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image) # calls the make thumbnail function
                self.save()

                return 'http://127.0.0.1:8000' + self.thumbnail.url
            else:
                return ''
            
    
    def make_thumbnail(self, image, size=(height, length)): # makes thumbnail image if none
        img = Image.open(image)
        if img.mode != 'RGB':
            img.convert('RGB') # converts to RGB format
        img.thumbnail(size, Image.Resampling.LANCZOS)  # Apply thumbnail method with better quality

        thumb_io = BytesIO()
        img.save(thumb_io, 'JPEG',quality=85 ,optimize=True) # saves as png

        thumbnail = File(thumb_io, name=image.name.replace('.png','.jpg')) 
        
        return thumbnail
    

class ProductSizePrice(models.Model):
    product = models.ForeignKey(Product, related_name='size_prices', on_delete=models.CASCADE)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    price = models.IntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('product', 'size')

    def __str__(self):
        return f"{self.product.name} - {self.size.name} - {self.price}"
        


# to add more images
class ItemImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='', blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'{self.product.name} image'
    
    def get_images(self):
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url #url for the image
        return ''

