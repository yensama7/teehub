# backend

## Project setup
    cd into backend'
    run:
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver



 - create super user
 - go the admin site
 - create category(men, women, children)
 - add sizes first(user can't order with out it) eg 'S','M','L','XL','XXL'
 - add products from the the admin site(don't add anything in the thumbnail field)
 - when orders are made in the frontend, it will show in orders




# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve