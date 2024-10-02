from django.http import Http404
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class LatestProductsList(APIView):
    def get(self, request, format= None):
        products = Product.objects.all()[0:10] # Gets the first 10 products in the database
        serializer = ProductSerializer(products, many=True) # pass the products into the serializer,many=True(many products)
        return Response(serializer.data) # returns the data
    

class ProductDetail(APIView): # get the information about a product to frontend
    def get_object(self, category_slug, product_slug):
        try:
            return  Product.objects.filter(category__slug=category_slug).get(slug=product_slug) # gets products based on their category slug and product slug
        except Product.DoesNotExist:
            raise Http404
        
    def get(self, request, category_slug, product_slug, format= None):
        products = self.get_object(category_slug, product_slug) # gets the products when request comes in from frontend using get_object function
        serializer = ProductSerializer(products) # serilize the product
        return Response(serializer.data)
    
class CategoryDetail(APIView):
    def get_object(self, category_slug):
        try:
            return  Category.objects.get(slug=category_slug)# gets all product under a category
        except Product.DoesNotExist:
            raise Http404
        
    def get(self, request, category_slug, format= None):
        category = self.get_object(category_slug) # gets the category using get_object function
        serializer = CategorySerializer(category) # serilize the category
        return Response(serializer.data)
    
# Create search functionality
@api_view(['POST']) # recieves a post request
def search(request):
    query = request.data.get('query', '') # gets the search query sent from the frontend

    if query:
        products = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query)) # checks if query exist in database and filters it using Q
        serializer = ProductSerializer(products, many=True) # serialize it
        return Response(serializer.data) # sends the data to the frontend
    else:
        return Response({"products": []}) # returns empty if not found