from django.db import models
from io import BytesIO
from django.core.files import File
from PIL import Image
length = height =150


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField() # makes url friendly

    class Meta:
        ordering = ('name',)# order category by name
 
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return f'/{self.slug}/'# gets the url for it
    
class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Ensure size names are unique

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField()#makes url friendly
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    date_added = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='thumbnail/', blank=True, null=True)
    sizes = models.ManyToManyField(Size, related_name='products', blank=True)  # Add sizes field

    class Meta:
        ordering = ('-date_added',) # in decending order

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return f'/{self.category.slug}/{self.slug}/' # gets the url for it
    
    def get_image(self):
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url  # url for the image
        return ''
    
    def get_thumbnail(self):
        if self.thumbnail:
            return 'http://127.0.0.1:8000' + self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()

                return 'http://127.0.0.1:8000' + self.thumbnail.url
            else:
                return ''
            
    
    def make_thumbnail(self, image, size=(height, length)): # makes thumbnail image if none
        img = Image.open(image)
        if img.mode != 'RGB':
            img.convert('RGB')
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, 'PNG', quality=85)

        thumbnail = File(thumb_io, name=image.name) 
        
        return thumbnail
        


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

