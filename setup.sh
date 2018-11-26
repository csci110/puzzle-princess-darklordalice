#!/bin/bash

# enable apache headers that are set in .htaccess
sudo a2enmod headers
sudo a2enmod expires
service apache2 restart

# retrieve submodules, because the c9 cloning does not
git submodule update --init
