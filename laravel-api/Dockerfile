# Use the official PHP image with Apache
FROM php:8.2-apache

# Set the working directory
WORKDIR /var/www/html

# Install required extensions
RUN apt-get update \
    && apt-get install -y \
        libzip-dev \
        unzip \
        libonig-dev \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath \
    && a2enmod rewrite

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Update the default Apache site configuration
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Enable Apache site configuration
RUN a2ensite 000-default.conf

# Restart Apache to apply changes
RUN service apache2 restart

# Copy the Laravel project files
COPY . .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install project dependencies
RUN composer install

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

RUN chmod -R 777 storage

# Set up cron job to run php artisan check:websites every minute
RUN apt-get install -y cron
RUN touch /var/log/cron.log
RUN (crontab -l ; echo "* * * * * /bin/bash -c 'cd /var/www/html && /usr/local/bin/php /var/www/html/artisan check:websites >> /var/log/cron.log 2>&1'") | crontab

# Expose port 80
EXPOSE 80

# Start Apache
#ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
