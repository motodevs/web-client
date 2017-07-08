FROM ubuntu:16.04

MAINTAINER MotoDev OpenMTS <motodevnet@gmail.com>

# install required packages
RUN apt-get update -y
RUN apt-get install -y nginx tzdata locales

# configure timezone
RUN echo "Europe/Istanbul" > /etc/timezone
RUN rm -f /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata

RUN mkdir -p /opt/app
COPY public /opt/app/
COPY nginx.conf /etc/nginx/sites-enabled/takip.conf


CMD ["nginx", "-g", "daemon off;"]