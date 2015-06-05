if Rails.env.development? || Rails.env.test?
  require 'sidekiq/testing'
  Sidekiq::Testing.inline!
end
