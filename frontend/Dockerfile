# Dockerfile for the static frontend.
# nginx serves the HTML, CSS, JavaScript, and assets files.
FROM nginx:alpine

# Copy all frontend files into nginx's default web folder.
COPY . /usr/share/nginx/html

# Use a small custom nginx config so Docker containers can also communicate:
# frontend /api requests are forwarded to the backend service.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx listens on port 80 inside the container.
EXPOSE 80
