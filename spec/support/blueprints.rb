require 'machinist/active_record'

User.blueprint do
  email { "user-#{sn}@trashmail.com" }
  password { "12345678" }
end
