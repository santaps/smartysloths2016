# ping -c 3 mysql_master

# wait for database server to up, otherwise sometimes 'Can't connect to MySQL server (111)' will raise'
echo "sleep 30s"
sleep 30

# Apply database migrations
echo "Apply database migrations"
python manage.py migrate

echo "create superuser"
echo "from django.contrib.auth.models import User; User.objects.create_superuser('mcc2016', 'myemail@example.com', 'mcc2016')" | python manage.py shell
echo "from django.contrib.auth.models import User; User.objects.create_user('user1', 'user1@example.com', 'user1')" | python manage.py shell
echo "from django.contrib.auth.models import User; User.objects.create_user('user2', 'user2@example.com', 'user2')" | python manage.py shell
cron

# Start server
echo "Starting server"
python manage.py runserver_plus 0.0.0.0:8000 --cert ./cert/server.crt

