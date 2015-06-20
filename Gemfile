ruby '2.2.0'
source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.0'
# Use postgresql as the database for Active Record
gem 'pg'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'rspec-rails', '~> 3.0'
end


group :test do
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'machinist'
  gem 'shoulda-matchers'
  gem 'database_cleaner'
  gem "codeclimate-test-reporter", require: nil
end

group :production do
  gem 'rails_12factor'
end

gem 'devise'
gem 'slim-rails'
gem 'react-rails', '~> 1.0'
gem 'puma'
gem 'bourbon'
gem 'mailcatcher', group: :development
gem 'carrierwave'
gem 'cloudinary'
gem 'sidekiq'
gem 'omniauth-facebook'

# Rails assets
source 'https://rails-assets.org' do
  gem 'rails-assets-basscss-sass'
  gem 'rails-assets-fontawesome'
  gem 'rails-assets-jsSHA'
  gem 'rails-assets-fluxxor'
  gem 'rails-assets-jsdiff'
  gem 'rails-assets-momentjs'
end
