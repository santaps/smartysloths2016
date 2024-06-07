FROM onesysadmin/tesseract
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
RUN apt-get install -y libpng12-dev
RUN apt-get install -y libjpeg62-dev
RUN apt-get install -y libffi-dev
RUN apt-get install -y libssl-dev
RUN apt-get install -y python-mysqldb
COPY . /app
WORKDIR /app

ADD check-image-cron /etc/cron.d/check-image-cron
RUN chmod +x /etc/cron.d/check-image-cron
RUN touch /var/log/cron.log

RUN pip install -r requirements.txt
# ENTRYPOINT ["python"]
# CMD ["manage.py", "runserver_plus", "0.0.0.0:8000", "--cert ./cert/server.crt"]
COPY docker-entrypoint.sh entrypoint.sh
CMD ["bash", "entrypoint.sh"]
